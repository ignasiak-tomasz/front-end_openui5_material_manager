sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.Master", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oApplicationTable = this.oView.byId("applicationTable");
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		/**
		 * To o dziwo działa. Czy wcześniej miałem problem aby pobrać patch?
		 */
		onListItemPress: function (oEvent) {
			var productPath = oEvent.getSource().getBindingContext("dokumenty").getPath(),
				product = productPath.split("/").slice(-1).pop(),
				oNextUIState;

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("detail", {
						layout: oNextUIState.layout,
						product: product
					});
				}.bind(this));
		}
	});
});
