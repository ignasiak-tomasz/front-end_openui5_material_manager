sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	'sap/f/library'
], function (JSONModel, Controller, fioriLibrary) {
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
				product = productPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product});
		}
	});
});
