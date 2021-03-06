sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
], function (JSONModel, Controller, Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.Master", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oApplicationTable = this.oView.byId("applicationTable");
			this.oApplicationTable2 = this.oView.byId("applicationTable2");
			this.oRouter = this.getOwnerComponent().getRouter();

			if(window.location.href.includes("detailProduc")){
				this.oView.byId("IconTabBar").setSelectedKey('Products');
			}
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
		},
		onListItemPressProduct: function(oEvent){
			var productPath = oEvent.getSource().getBindingContext("products").getPath(),
			product = productPath.split("/").slice(-1).pop(),
			oNextUIState;

			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detailProduct", {
					layout: oNextUIState.layout,
					product: product
				});
			}.bind(this));
		},
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("typDokumentu/nazwa", FilterOperator.Contains, sQuery)];
			}

			this.oApplicationTable.getBinding("items").filter(oTableSearchState, "Application");
		},
		onSearchProducts: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("nazwa", FilterOperator.Contains, sQuery)];
			}

			this.oApplicationTable2.getBinding("items").filter(oTableSearchState, "Application");
		},
		onAdd: function(){
			var oNextUIState;
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(2);
				this.oRouter.navTo("addDocument", {
					layout: oNextUIState.layout
				});
			}.bind(this));
		},
		onAddProducts: function(){
			var oNextUIState;
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(2);
				this.oRouter.navTo("addProduct", {
					layout: oNextUIState.layout
				});
			}.bind(this));
		},
		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oApplicationTable.getBinding("items"),
				oSorter = new Sorter("id", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
		onSortProducts: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oApplicationTable2.getBinding("items"),
				oSorter = new Sorter("id", this._bDescendingSort);

			oBinding.sort(oSorter);
		}
	});
});
