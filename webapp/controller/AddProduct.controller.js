sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Core",
	"sap/m/MessageToast"
], function (JSONModel, Controller, Core, MessageToast) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.AddProduct", {
		
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.getRoute("addProduct").attachPatternMatched(this._onPatternMatch, this);
			var oMM = Core.getMessageManager();
		},
		onSubmit: function () {
			this._prepareModel();
			var oView = this.getView(),
				oViewModelDataJson = oView.getModel("addProduct");//,
				let data = JSON.parse(oViewModelDataJson.getJSON());
				delete data.id;
			
				jQuery.ajax({
				method: "POST",
				url: "proxy/https/localhost:5001/api/inz/produkt",
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				data: JSON.stringify(data),
				///async: false,
				success: function(data){
						var lv_data = data;
				},
				error: function(error){
					var lv_error = error;
				}
				
			}).then(function(data){		
				this.getOwnerComponent().getHelper().then(function (oHelper) {
					this._onCreateSuccess(data.id, oHelper);
				}.bind(this));
			}.bind(this), function(data){
				this._onCreateFailed();
			}.bind(this));
		},
		_onCreateSuccess: function (sHeaderId, oHelper) {
			var sMessage = 'Poprawnie zapisano dane !!!';/*this.getResourceBundle().getText("newPersonCreated",*/
			
			var oNewModel = this.getView().getModel("addProduct"),
				oJSONNewModel;
			oNewModel.setProperty("/id", sHeaderId);
			oJSONNewModel = oNewModel.getJSON();

			var oModel = this.getView().getModel("products"),
				sModelDokumenty = oModel.getJSON(),
				oJSONModelDokumenty = JSON.parse(sModelDokumenty);
			oJSONModelDokumenty.push(JSON.parse(oJSONNewModel));
			oModel.setData(oJSONModelDokumenty);
			oModel.refresh();

			// var oNextUIState = oHelper.getNextUIState(1);
			//this.getView().unbindObject("addProduct");
			var index = -1;
			oModel.oData.find(function(item, i){
				if(item.id === sHeaderId){
				  index = i;
				  return i;
				}
			});

			this.oOwnerComponent.getHelper().then(function (oHelper) {
				let oNextUIState = oHelper.getNextUIState(1); 
				this.oRouter.navTo("detailProduct", {
					layout: oNextUIState.layout,
					product: index
				});
				this.destroy();
				
			}.bind(this));
			// this.oRouter.navTo("detail", {
			// 	layout: oNextUIState.layout,
			// 	product: index
			// });

			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		_prepareModel: function(){

			var type_doc = this.getView().byId("productLocalization").getSelectedItem().mProperties;
			this.getView().getModel("addProduct").setProperty("/lokalizacja/id", parseInt(type_doc.key));
			this.getView().getModel("addProduct").setProperty("/lokalizacja/numerRegalu", type_doc.text);

			var type_doc2 = this.getView().byId("productCategories").getSelectedItem().mProperties;
			this.getView().getModel("addProduct").setProperty("/kategoria/id", parseInt(type_doc2.key));
			this.getView().getModel("addProduct").setProperty("/kategoria/nazwa", type_doc2.text);			
		},
		_onCreateFailed: function (oError) {
			var sMessage = 'Błąd przy zapisie danych !!!';// this.getResourceBundle().getText("newPersonNotCreated",
				//[oPerson.Pesel]);
				
			//this.onNavBack(); //<!-- brak takiej funkcji
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},

		_onPatternMatch: function (oEvent) {
			var oModel = this.getView().getModel("products");
			oModel.dataLoaded().then(this._onMetadataLoaded.bind(this,oModel));
		},
		_onMetadataLoaded: function(oModel){
			let oTODOClearLineModel
			try {
				oTODOClearLineModel = JSON.parse(JSON.stringify(oModel.getProperty("/0"))); // Delete reference to original path
			}catch(error){
				oTODOClearLineModel = {
					"nazwa": "string",
					"iloscObecna": 0,
					"iloscZarezerwowana": 0,
					"iloscDostepna": 0,
					"kodEan": "string",
					"lokalizacja": {
					  "id": 0,
					  "numerRegalu": 0
					},
					"kategoria": {
					  "id": 0,
					  "nazwa": "string"
					},
					"dokumenty": [
					  {
						"dokumentId": 0,
						"produktId": 0,
						"ilosc": 0
					  }
					]
				  };
			};

			// for (var item in oTODOClearLineModel) { https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
			// 	if (oTODOClearLineModel.hasOwnProperty(item)) {
			// 		console.log(item + " -> " + oTODOClearLineModel[item]);
			// 	}
			// }
			// console.log("-----------------------------------------------------------------------------------");
			// for (var key of Object.keys(oTODOClearLineModel)) {
			// 	console.log(key + " -> " + oTODOClearLineModel[key])
			// }
			// console.log("-----------------------------------------------------------------------------------");

			for (let key of Object.keys(oTODOClearLineModel)) {
				if(typeof(oTODOClearLineModel[key]) === 'object' && oTODOClearLineModel[key] !== null){
					if(Array.isArray(oTODOClearLineModel[key])){ oTODOClearLineModel[key] = null; continue; }
					for (let key_deep of Object.keys(oTODOClearLineModel[key])) {
						if(typeof(oTODOClearLineModel[key][key_deep]) === 'object' && oTODOClearLineModel[key][key_deep] !== null){
							if(Array.isArray(oTODOClearLineModel[key][key_deep])){ oTODOClearLineModel[key][key_deep] = null; continue; }
							for (let key_deep_deep of Object.keys(oTODOClearLineModel[key][key_deep])) {
								if(typeof(oTODOClearLineModel[key][key_deep][key_deep_deep]) === 'object' && oTODOClearLineModel[key][key_deep][key_deep_deep] !== null){
									console.log('Controller AddDocument to more deep structure');
								}else{
									oTODOClearLineModel[key][key_deep][key_deep_deep] = undefined;
								}
							}
						}else{
							oTODOClearLineModel[key][key_deep] = undefined;
						}
					}
				}else{
					oTODOClearLineModel[key] = undefined;
				}
			};
			let oCoppyModelProduct = this.getView().getModel("coppyModelProduct");

			if( Object.keys(oCoppyModelProduct.oData).length !== 0 && oCoppyModelProduct.oData.constructor === Object){
				oTODOClearLineModel = oCoppyModelProduct.getData();
				this.getView().getModel("coppyModelProduct").setData(null);

				let oComboBoxKtoWystail = this.getView().byId("productLocalization");
				oComboBoxKtoWystail.setSelectedKey(oTODOClearLineModel.lokalizacja.id);

				let oComboBoxKtoZatwierdzil = this.getView().byId("productCategories");
				oComboBoxKtoZatwierdzil.setSelectedKey(oTODOClearLineModel.kategoria.id);
			}

			let oJSON = new JSONModel(oTODOClearLineModel);
			this.getView().setModel(oJSON, "addProduct");// Czysta struktura JSON
		},
		onExit: function () {
			this.oRouter.getRoute("addProduct").detachPatternMatched(this._onPatternMatch, this);
			
			this.getView().byId("productLocalization").setSelectedItem(null);
			this.getView().byId("productCategories").setSelectedItem(null);
		}
	});
});
