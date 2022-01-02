sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/util/File",
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/ui/core/syncStyleClass"
], function (Controller, MessageBox, MessageToast, File, JSONModel, Fragment, Filter, FilterOperator, syncStyleClass) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.DetailProduct", {
        onInit: function () {
			
			var oEditDetailModel = new JSONModel();
			oEditDetailModel.setData({
				edit: false
			});
			this.getView().setModel(oEditDetailModel, "editDetail");

			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			/* Te  trzy wystąpienia chyba są po to aby wyświetlać ciągle te same informacje na trzech różnych podoknach.*/
			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this); 
			this.oRouter.getRoute("detailProduct").attachPatternMatched(this._onProductMatched, this);
		},
		_onProductMatched: function (oEvent) {	
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/" + this._product,
				model: "products"
			});
			
			let iIdPersonCreateDocument = this.getView().getBindingContext("products").getProperty("lokalizacja/id");
			let oComboBoxKtoWystail = this.getView().byId("productLocalization");
			oComboBoxKtoWystail.setSelectedKey(iIdPersonCreateDocument);

			let iIdPersonAcceptDocument = this.getView().getBindingContext("products").getProperty("kategoria/id");
			let oComboBoxKtoZatwierdzil = this.getView().byId("productCategories");
			oComboBoxKtoZatwierdzil.setSelectedKey(iIdPersonAcceptDocument);
			
		},
		onDelete: function(oEvent){
			var idProduct = this.getView().getBindingContext("products").getProperty("id");

			MessageBox.warning( this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deletionQuestion", [idProduct]), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if(sAction === MessageBox.Action.OK){
						//oModel.metadataLoaded().then(this._onMetadataDelete.bind(this,sPath,sId)); OData
						this.getView().getModel("products").dataLoaded().then(this._onMetadataDelete.bind(this, idProduct));
					}
				}.bind(this)
				
			});
		},
		onCoppy: function(oEvent){
			let oBindingProduct = this.getView().getBindingContext("products");
			let oProduct = oBindingProduct.getObject();
			this.getView().getModel('coppyModelProduct').setData(oProduct);

			var oNextUIState;
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(2);
				this.oRouter.navTo("addProduct", {
					layout: oNextUIState.layout
				});
			}.bind(this));
		},
		_onMetadataDelete: function(idProduct){
			$.ajax({
					
				url: "proxy/https/localhost:5001/api/inz/produkt/" + idProduct,
				type: 'DELETE',
				success: function(result) {
					var Object = result;
				},
				error: function(error){
					var Object = error;
				}
			}).then(
				function(data){
					this._mySuccessHandler(idProduct);
				}.bind(this),
				function(data){
					this._myErrorHandler(idProduct);
				}.bind(this)
			);
		},
		_mySuccessHandler: function(idProduct){				
			var oModel = this.getView().getModel("products"),
				oData = oModel.getData(),
				oModelDocument = this.getView().getModel("dokumenty"),
				oDataDocuments = oModelDocument.getData();
			
			for(var i = 0; i<oDataDocuments.length; i++){
				for(var j = 0; j<oDataDocuments[i].produkty.length; j++){
					if(oDataDocuments[i].produkty[j].produktId === idProduct){
						oDataDocuments[i].produkty.splice(j,1);
					}
				}
			}
			oModelDocument.setData(oDataDocuments);

			oData.splice(this._product,1);
			oModel.setData(oData);
			oModel.refresh();

			this.handleExitFullScreen();

			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deletionSuccess", [idProduct]);
			MessageToast.show(sMessage);
		},
		_myErrorHandler: function(idProduct){
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deletionError", [idProduct]);
			MessageToast.show(sMessage);
			//this.getView().getModel("dokumenty").resetChanges(); Only OData
		},
        /**
         * Ta metoda wyświetla w dolnej części Drugiego okna informację o tym czy chcemy zapisać zmiany.
         */
		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
			
			let bEdit = this.getView().getModel('editDetail').getProperty("/edit");
			this.getView().getModel('editDetail').setProperty("/edit", !bEdit);
		},
		onToolbarSpacerAccept: function(){
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
			bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
			
			let bEdit = this.getView().getModel('editDetail').getProperty("/edit");
			this.getView().getModel('editDetail').setProperty("/edit", !bEdit);

			let oDokument = this.getView().getBindingContext("products").getObject();
			
			let oModelLokalizacje = this.getView().getModel("lokalizacje").getData();
			let oComboBoxProductLocalization = this.getView().byId("productLocalization").getSelectedItem().mProperties;
			oDokument.lokalizacja.id = parseInt(oComboBoxProductLocalization.key);
			for(let i=0; i<oModelLokalizacje.length; i++){
				if(oModelLokalizacje[i].id === oDokument.lokalizacja.id){
					oDokument.lokalizacja.numerRegalu = oModelLokalizacje[i].numerRegalu;
					break;
				}
			};
			
			let oModelKategorie = this.getView().getModel("kategorie").getData();
			let oComboBoxProductCategories = this.getView().byId("productCategories").getSelectedItem().mProperties;
			oDokument.kategoria.id = parseInt(oComboBoxProductCategories.key);
			for(let i=0; i<oModelKategorie.length; i++){
				if(oModelKategorie[i].id === oDokument.kategoria.id){
					oDokument.kategoria.nazwa = oModelKategorie[i].nazwa;
					break;
				}
			};

			jQuery.ajax({
				method: "PUT",
				url: "proxy/https/localhost:5001/api/inz/produkt/" + oDokument.id,
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				data: JSON.stringify(oDokument),
				success: function(data){
					var lv_data = data;
				},
				error: function(error){
					var lv_error = error;
				}
				
			}).then(function(data){
				let sPath = this.getView().getBindingContext("products").getPath();
				this.getView().getModel("products").setProperty(sPath,oDokument);		
				this.getOwnerComponent().getHelper().then(function (oHelper) {
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
		
		_onChangeFailed: function () {
			var sMessage = 'Błąd przy zapisie danych !!!';// this.getResourceBundle().getText("newPersonNotCreated",
				//[oPerson.Pesel]);
				
			//this.onNavBack(); //<!-- brak takiej funkcji
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		}/*,
		onAdd: function(oEvent){
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: oView.getId(),
					name: "opensap.myapp.view.Products",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pDialog.then(function(oDialog){
				this._configDialog(oButton, oDialog);
				oDialog.open();
			}.bind(this));
		}*//*,
		_configDialog: function (oButton, oDialog) {

			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			oDialog.setMultiSelect(bMultiSelect);

			// toggle compact style
			syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
		}*//*,

		handleSearchPopUp: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("nazwa", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		}*//*,

		handleClosePopUp: function (oEvent) {
			// reset the filter
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				let oObjectSelected = aContexts.map(function (oContext) { 
					return oContext.getObject(); 
				});
				let oBindingIdDocument = this.getView().getBindingContext("dokumenty").getProperty('id');
				let oBindingProduktyInDocument = this.getView().getBindingContext("dokumenty").getProperty('produkty');
				for(let i = 0; i<oObjectSelected.length ; i++){
					oBindingProduktyInDocument.push({
						"dokumentId": parseInt(oBindingIdDocument),
						"produktId": parseInt(oObjectSelected[i].id),
						"ilosc": 0
					});
				}
				let sPath = this.getView().getBindingContext("dokumenty").getPath();
				this.getView().getModel("dokumenty").setProperty(sPath+"/produkty",oBindingProduktyInDocument);
				
				//1MessageToast.show("You have chosen " + aContexts.map(function (oContext) { return oContext.getObject().id; }).join(", "));
			}

		}*/,

		onToolbarSpacerReject: function(){
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
			bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);

			let bEdit = this.getView().getModel('editDetail').getProperty("/edit");
			this.getView().getModel('editDetail').setProperty("/edit", !bEdit);
		},

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detailProduct", {layout: sNextLayout, product: this._product});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detailProduct", {layout: sNextLayout, product: this._product});
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detailProduct").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
