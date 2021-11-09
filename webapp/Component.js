sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/f/library",
		"sap/f/FlexibleColumnLayoutSemanticHelper",
		'sap/ui/model/json/JSONModel'
	], function (UIComponent, fioriLibrary, FlexibleColumnLayoutSemanticHelper, JSONModel){
	"use strict"; 

	return UIComponent.extend("opensap.myapp.Component", {
		
		metadata: {
			manifest: "json"
		},
		
		init : function(){
			var oModel,
				oProductsModel,
				oRouter;

			UIComponent.prototype.init.apply(this, arguments);

			oModel = new JSONModel();
			this.setModel(oModel);
				
			var oProductsModel = new JSONModel();
			/*jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/dokumenty",
        		contentType: "application/json",
        		dataType: 'json',
				async: false,
				success: function(data){
					console.log(data);
				},
				error: function(error){
					console.log(error);
				}
			}).then(function(data){
					oProductsModel.setData(data);
			});*/
			$.getJSON("temp_database.json", function(data){
				oProductsModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});
			oProductsModel.setSizeLimit(1000);
			this.setModel(oProductsModel, 'dokumenty');

			oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
		},
		getHelper: function () {
			return this._getFcl().then(function(oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded,
					initialColumnsCount: 2//,
					// maxColumnsCount: 2
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			});
		},


		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;//TODO czy zamiast tegi return aby nie wywoływać niżej kodu nie można else dać aby ładniej to wyglądało?
				//sLayout = LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		},
		_getFcl: function () {
			return new Promise(function(resolve, reject) {
				var oFCL = this.getRootControl().byId('fcl');
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function(oEvent) {
						resolve(oEvent.getSource().byId('fcl'));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}

	});			         
});
