sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.Detail", {
        onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			/* Te  trzy wystąpienia chyba są po to aby wyświetlać ciągle te same informacje na trzech różnych podoknach.*/
			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this); 
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
		},
        /**
		 * To się nie uda
		 */
		onProductPress: function (oEvent) {
			var supplierPath = oEvent.getSource().getBindingContext("dokumenty").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop(),
				oNextUIState;

			this.oOwnerComponent.getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(2); /* Dzięki temu pobieramy informacje od klasy jaki layout ma zostać wdrożony na podstawie analizy urządzenia i zagnieżdżenia struktury */
					this.oRouter.navTo("detailDetail", {
						layout: oNextUIState.layout,
						supplier: supplier,
						product: this._product
					});
				}.bind(this));
		},

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/" + this._product,
				model: "dokumenty"
			});
		},
        /**
         * Ta metoda wyświetla w dolnej części Drugiego okna informację o tym czy chcemy zapisać zmiany.
         */
		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
