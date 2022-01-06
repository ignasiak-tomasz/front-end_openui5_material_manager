sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Core",
	"sap/m/MessageToast"
], function (JSONModel, Controller, Core, MessageToast) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.AddDocument", {
		
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.getRoute("addDocument").attachPatternMatched(this._onPatternMatch, this);

			var oMM = Core.getMessageManager();

			var oView = this.getView(),
			  	aInputs = [
				oView.byId("kontrahenci"),
				oView.byId("ktoWystawil")
			];

			// attach handlers for validation errors
			// this.oOwnerComponent = this.getOwnerComponent();
			// this.oModel = this.oOwnerComponent.getModel();
		},
		onSubmit: function () {
			this._prepareModel();
			var oView = this.getView(),
				oViewModelDataJson = oView.getModel("addDocument");//,
				let data = JSON.parse(oViewModelDataJson.getJSON());
				delete data.id;
				/*aInputs = [
				oView.byId("nameInput"),
				oView.byId("emailInput")
				];*/
			
				jQuery.ajax({
				method: "POST",
				url: "proxy/https/localhost:5001/api/inz/dokument",
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
			
			var oNewModel = this.getView().getModel("addDocument"),
				oJSONNewModel;
			oNewModel.setProperty("/id", sHeaderId);
			oJSONNewModel = oNewModel.getJSON();

			var oModel = this.getView().getModel("dokumenty"),
				sModelDokumenty = oModel.getJSON(),
				oJSONModelDokumenty = JSON.parse(sModelDokumenty);
			oJSONModelDokumenty.push(JSON.parse(oJSONNewModel));
			oModel.setData(oJSONModelDokumenty);
			oModel.refresh();

			// var oNextUIState = oHelper.getNextUIState(1);
			this.getView().unbindObject("addDocument");
			var index = -1;
			oModel.oData.find(function(item, i){
				if(item.id === sHeaderId){
				  index = i;
				  return i;
				}
			});

			this.oOwnerComponent.getHelper().then(function (oHelper) {
				let oNextUIState = oHelper.getNextUIState(1); 
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
					product: index
				});
				this.onExit();
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
			function toIsoString(date) {
				var tzo = -date.getTimezoneOffset(),
					pad = function(num) {
						var norm = Math.floor(Math.abs(num));
						return (norm < 10 ? '0' : '') + norm;
					};
			  
				return date.getFullYear() +
					'-' + pad(date.getMonth() + 1) +
					'-' + pad(date.getDate()) +
					'T' + pad(date.getHours()) +
					':' + pad(date.getMinutes()) +
					':' + pad(date.getSeconds())
			}

			var dataWystawienia = toIsoString(new Date());
			this.getView().getModel("addDocument").setProperty("/dataWystawienia", dataWystawienia);

			var type_doc = this.getView().byId("type_documentu").getSelectedItem().mProperties;
			this.getView().getModel("addDocument").setProperty("/typDokumentu/id", parseInt(type_doc.key));
			this.getView().getModel("addDocument").setProperty("/typDokumentu/nazwa", type_doc.text);

			var type_doc2 = this.getView().byId("kontrahenci").getSelectedItem().mProperties;
			this.getView().getModel("addDocument").setProperty("/kontrahent/id", parseInt(type_doc2.key));
			this.getView().getModel("addDocument").setProperty("/kontrahent/nazwa", type_doc2.text);
			
			var type_doc3 = this.getView().byId("ktoWystawil").getSelectedItem().mProperties;
			this.getView().getModel("addDocument").setProperty("/ktoWystawil/id", parseInt(type_doc3.key));
			this.getView().getModel("addDocument").setProperty("/ktoWystawil/imie", type_doc3.text);
			this.getView().getModel("addDocument").setProperty("/ktoWystawil/nazwisko", type_doc3.additionalText);
			
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
			var oModel = this.getView().getModel("dokumenty");
			oModel.dataLoaded().then(this._onMetadataLoaded.bind(this,oModel));
		},
		_onMetadataLoaded: function(oModel){
			let oTODOClearLineModel;
			try{
				oTODOClearLineModel = JSON.parse(JSON.stringify(oModel.getProperty("/0"))); // Delete reference to original path
			}catch(error){
				oTODOClearLineModel = {
					"typDokumentu": {
					  "id": 0,
					  "nazwa": "string"
					},
					"kontrahent": {
					  "id": 0,
					  "nazwa": "string"
					},
					"dataWystawienia": "2022-01-02T14:42:35.270Z",
					"dataZatwierdzeniaPrzyjecia": "2022-01-02T14:42:35.270Z",
					"ktoWystawil": {
					  "id": 0,
					  "imie": "string",
					  "nazwisko": "string"
					},
					"ktoZatwierdzilPrzyjal": {
					  "id": 0,
					  "imie": "string",
					  "nazwisko": "string"
					},
					"produkty": [
					  {
						"dokumentId": 0,
						"produktId": 0,
						"ilosc": 0
					  }
					]
				  };
			}
			

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
			}

			let oJSON = new JSONModel(oTODOClearLineModel);
			this.getView().setModel(oJSON, "addDocument");// Czysta struktura JSON
		},
		onExit: function () {
			this.oRouter.getRoute("addDocument").detachPatternMatched(this._onPatternMatch, this);
			this.getView().byId("type_documentu").setSelectedItem(null);
			this.getView().byId("kontrahenci").setSelectedItem(null);
			this.getView().byId("ktoWystawil").setSelectedItem(null);
		}
	});
});
