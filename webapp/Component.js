sap.ui.define([
		"sap/base/util/UriParameters",
		"sap/ui/core/UIComponent",
		"sap/f/library",
		"sap/f/FlexibleColumnLayoutSemanticHelper",
		'sap/ui/model/json/JSONModel'
	], function (UriParameters, UIComponent, library, FlexibleColumnLayoutSemanticHelper, JSONModel){
	"use strict"; 
	
	var LayoutType = library.LayoutType;

	return UIComponent.extend("opensap.myapp.Component", {
		
		metadata: {
			manifest: "json"
		},
		
		init : function(){
			var oModel,
				oProductsModel,
				oRouter;

			oModel = new JSONModel();
			this.setModel(oModel);
				
			UIComponent.prototype.init.apply(this, arguments);
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

		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
	});			         
});
