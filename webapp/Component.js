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
				oDocumentsModel,
				oProductsModel,
				oRouter;

			UIComponent.prototype.init.apply(this, arguments);

			oModel = new JSONModel(); /**Base model for All Solution */
			this.setModel(oModel); /**Base model for All Solution */
			
			/**
			 * Model 1
			 */
			var oDocumentsModel = new JSONModel();
			jQuery.ajax({
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
					oDocumentsModel.setData(data);
			});/*
			 $.getJSON("temp_database.json", function(data){
			 	oDocumentsModel.setData(data);
			 }).fail(function(){
			 	console.log("An error has occurred.");
			 });*/
			oDocumentsModel.setSizeLimit(1000);
			this.setModel(oDocumentsModel, 'dokumenty');


			/**
			 * Modle 2
			 */
			 var oProductsModel = new JSONModel();
			 jQuery.ajax({
				 method: "GET",
				 url: "proxy/https/localhost:5001/api/inz/produkty",
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
			 });/*
			  $.getJSON("temp_database_products.json", function(data){
			 	oProductsModel.setData(data);
			  }).fail(function(){
			 	 console.log("An error has occurred.");
			  });*/
			 oProductsModel.setSizeLimit(1000);
			 this.setModel(oProductsModel, 'products');


			/**
			 * Modle 3
			 */
			var oTypDokumentuModel = new JSONModel();
			jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/typy_dokumentow",
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
				oTypDokumentuModel.setData(data);
			});

			/*
			$.getJSON("temp_database_typ_dokumentu.json", function(data){
				oTypDokumentuModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});*/
			oTypDokumentuModel.setSizeLimit(1000);
			this.setModel(oTypDokumentuModel, 'typy_dokumentu');

			/**
			 * Modle 4
			 */
			var oKontrahenciModel = new JSONModel();
			jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/kontrahenci",
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
				oKontrahenciModel.setData(data);
			});

			/*
			$.getJSON("temp_database_kontrahenci.json", function(data){
				oKontrahenciModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});*/
			oKontrahenciModel.setSizeLimit(1000);
			this.setModel(oKontrahenciModel, 'kontrahenci');		
			
			/**
			 * Modle 5
			 */
			var oKontrahenciModel = new JSONModel();
			jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/pracownicy",
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
				oKontrahenciModel.setData(data);
			});

			/*
			$.getJSON("temp_database_pracownicy.json", function(data){
				oKontrahenciModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});*/
			oKontrahenciModel.setSizeLimit(1000);
			this.setModel(oKontrahenciModel, 'pracownicy');	

			/**
			 * Modle 6
			 */
			var oLokalizacjaModel = new JSONModel();
			jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/lokalizacje",
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
				oLokalizacjaModel.setData(data);
			});

			/*
			$.getJSON("temp_database_lokalizacje.json", function(data){
				oLokalizacjaModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});*/
			oLokalizacjaModel.setSizeLimit(1000);
			this.setModel(oLokalizacjaModel, 'lokalizacje');	

			/**
			 * Modle 6
			 */
			var oKategorieaModel = new JSONModel();
			jQuery.ajax({
				method: "GET",
				url: "proxy/https/localhost:5001/api/inz/kategorie",
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
				oKategorieaModel.setData(data);
			});

			/*
			$.getJSON("temp_database_kategorie.json", function(data){
				oKategorieaModel.setData(data);
			}).fail(function(){
				console.log("An error has occurred.");
			});*/
			oKategorieaModel.setSizeLimit(1000);
			this.setModel(oKategorieaModel, 'kategorie');	

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
