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

			// attach handlers for validation errors

			// this.oOwnerComponent = this.getOwnerComponent();

			// this.oRouter = this.oOwnerComponent.getRouter();
			// this.oModel = this.oOwnerComponent.getModel();

			// this.oRouter.getRoute("addDocument").attachPatternMatched(this._onPatternMatch, this);
		},
		onSubmit: function () {
			var oView = this.getView(),
				aInputs = [
				oView.byId("nameInput"),
				oView.byId("emailInput")
			];

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
