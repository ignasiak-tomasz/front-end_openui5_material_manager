sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Core"
], function (JSONModel, Controller, Core) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.AddDocument", {
		
		onInit: function () {
			var oView = this.getView(),
				oMM = Core.getMessageManager();

			oView.setModel(new JSONModel({ name: "", email: "" }));

			this.oRouter = this.getOwnerComponent().getRouter();

			// attach handlers for validation errors

			// this.oOwnerComponent = this.getOwnerComponent();

			// this.oRouter = this.oOwnerComponent.getRouter();
			// this.oModel = this.oOwnerComponent.getModel();

			// this.oRouter.getRoute("addDocument").attachPatternMatched(this._onPatternMatch, this);
		},
		onSubmit: function () {
			var oView = this.getView(),
				oViewModelDataJson = oView.getModel().getJSON();//,
				/*aInputs = [
				oView.byId("nameInput"),
				oView.byId("emailInput")
				];*/
			jQuery.ajax({
				method: "POST",
				url: "proxy/https/localhost:5001/xxxxxxxx",
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				data: JSON.stringify(oViewModelDataJson),
				///async: false,
				success: function(data){
						var lv_data = data;
				},
				error: function(error){
					var lv_error = error;
				}
				
			}).then(function(data){
				//Success
				var sHeaderId = data.getResponseHeader( "xxxx"),// Tutaj masz wprowadzić coś co zwraca Denis
					oNextUIState;
				
				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("detail", {
						layout: oNextUIState.layout,
						product: sHeaderId
					});
				}.bind(this));

				var sNewIdKey = sHeaderLocation.replace("/api/restaurant/", "");
				this._onCreateSuccess(sNewIdKey);
			}.bind(this), function(data){
				//Error
			}.bind(this));/*.then(function(data){
					oProductsModel.setData(data);
			});*/
			//this.getView().setModel(oProductsModel, 'products');
			//var oModel = this.getView().getModel('products'); // nadmiarowe do tymaczasowej pomocy*/
		},
		_onCreateSuccess: function (sNewIdKey) {
			var sMessage = 'Poprawnie zapisano dane !!!';/*this.getResourceBundle().getText("newPersonCreated",
				[oPerson.Pesel]);*/
			
			var oJSONModel_Add =  this.getView().getBindingContext('products_Add').getModel();

			var sJSON_Add =  oJSONModel_Add.getJSON();
			var oJSON_Add = JSON.parse(sJSON_Add);
			oJSON_Add.id = sNewIdKey;

			var oModel = this.getView().getModel("products");
			var sModel = oModel.getJSON();
			var oJSON = JSON.parse(sModel);

			oJSON.push(oJSON_Add);
			oModel.setData(oJSON);

			this.getRouter().navTo("List", true);
			this.getView().unbindObject('products_Add');
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		_onCreateFailed: function (oError) {
			var sMessage = 'Błąd przy zapisie danych !!!';// this.getResourceBundle().getText("newPersonNotCreated",
				//[oPerson.Pesel]);
				
			this.onNavBack();
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		}
		
		/*,

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

		handleAboutPress: function () {
			var oNextUIState;
			this.oOwnerComponent.getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(3);
				this.oRouter.navTo("page2", {layout: oNextUIState.layout});
			}.bind(this));
		},

		onExit: function () {
			this.oRouter.getRoute("detailDetail").detachPatternMatched(this._onPatternMatch, this);
		}*/
	});
});
