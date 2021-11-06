sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], function (Controller, UIComponent, History) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.BaseController", {

		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		}
	});
});