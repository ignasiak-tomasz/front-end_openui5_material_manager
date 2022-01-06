sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
], function (JSONModel, Controller, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.DetailDetail", {
		
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPatternMatch, this);
		},

		_onPatternMatch: function (oEvent) {
			this._supplier = oEvent.getParameter("arguments").supplier || this._supplier || "0";
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			var produkt_id = this.getView().getModel("dokumenty").getProperty("/" + this._product + "/produkty/" + this._supplier + "/produktId");
			var oModel = this.getView().getModel("products");

			oModel.dataLoaded().then(function() {

				var oData = oModel.getData();
				for(var i = 0; i< oData.length; i++){
					if(oData[i].id == produkt_id){
						this.getView().bindElement({
							path: "/"+i,
							model: "products"
						  });
						break;
					}
				}
								
			}.bind(this));
		},
		onDeleteProductWithDocument: function (){
			let idProduktWithDocument = this.getView().getBindingContext("products").getProperty("id"),
				idDocument = this.getView().getModel("dokumenty").getProperty( "/" + this._product + "/id");


			MessageBox.warning( this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deletionQuestionProductsWithDocument", [idProduktWithDocument, idDocument]), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if(sAction === MessageBox.Action.OK){
						//oModel.metadataLoaded().then(this._onMetadataDelete.bind(this,sPath,sId)); OData
						this.getView().getModel("dokumenty").dataLoaded().then(this._onMetadataDelete.bind(this));
					}
				}.bind(this)
				
			});
		},
		_onMetadataDelete: function(){
			let oDocument = this.getView().getModel("dokumenty").getProperty( "/" + this._product );
			oDocument.produkty.splice(this._supplier,1);
			jQuery.ajax({
				method: "PUT",
				url: "proxy/https/localhost:5001/api/inz/dokument/" + oDocument.id,
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				data: JSON.stringify(oDocument),
				success: function(data){
					var lv_data = data;
				},
				error: function(error){
					var lv_error = error;
				}
				
			}).then(function(data){
				this.getView().getModel("dokumenty").setProperty("/" + this._product ,oDocument);	

				this.oOwnerComponent.getHelper().then(function (oHelper) {
					var oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("detail", {
						layout: oNextUIState.layout,
						product: this._product
					});
				}.bind(this));	
				this.oOwnerComponent.getHelper().then(function (oHelper) {
					this._onEditSuccess();
				}.bind(this));
			}.bind(this), function(data){
				this._onChangeFailed();
			}.bind(this));

		},
		_onEditSuccess: function () {
			var sMessage = 'Poprawnie zapisano dane !!!';/*this.getResourceBundle().getText("newPersonCreated",*/
				//[oPerson.Pesel]);
				
			//this.onNavBack(); //<!-- brak takiej funkcji
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		_onChangeFailed: function (oError) {
			var sMessage = 'Błąd przy zapisie danych !!!';// this.getResourceBundle().getText("newPersonNotCreated",
				//[oPerson.Pesel]);
				
			//this.onNavBack(); //<!-- brak takiej funkcji
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		handleAboutPress: function () {
			var oNextUIState;
			this.oOwnerComponent.getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(3);
				this.oRouter.navTo("page2", {layout: oNextUIState.layout});
			}.bind(this));
		},

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("detailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("detailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		onExit: function () {
			this.oRouter.getRoute("detailDetail").detachPatternMatched(this._onPatternMatch, this);
		}
	});
});
