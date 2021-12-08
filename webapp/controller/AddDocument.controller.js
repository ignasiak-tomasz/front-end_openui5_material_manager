sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Core"
], function (JSONModel, Controller, Core) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.AddDocument", {
		
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.getRoute("addDocument").attachPatternMatched(this._onPatternMatch, this);

			var oMM = Core.getMessageManager();

			// attach handlers for validation errors
			// this.oOwnerComponent = this.getOwnerComponent();
			// this.oModel = this.oOwnerComponent.getModel();
		},
		onSubmit: function () {
			var oView = this.getView(),
				oViewModelDataJson = oView.getModel().getJSON();//,
				/*aInputs = [
				oView.byId("nameInput"),
				oView.byId("emailInput")
				];*/
			/*
				jQuery.ajax({
				method: "POST",
				url: "proxy/https/localhost:5001/xxxxxxxx",
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				data: JSON.stringify(oViewModelDataJson),
				///async: false,
				success: function(data){
						var lv_data = data;
				},
				error: function(error){
					var lv_error = error;
				}
				
			}).then(function(data){
				//Success
				var sHeaderId = data.getResponseHeader( "xxxx"),// Tutaj masz wprowadzić coś co zwraca Denis
					oNextUIState;
				
				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("detail", {
						layout: oNextUIState.layout,
						product: sHeaderId
					});
				}.bind(this));

				var sNewIdKey = sHeaderLocation.replace("/api/restaurant/", "");
				this._onCreateSuccess(sNewIdKey);
			}.bind(this), function(data){
				//Error
			}.bind(this));
			*/

			/*
			var oParseJson = JSON.parse(oViewModelDataJson);
			oParseJson.id = 6;
			var oModelDokumenty = oView.getModel("dokumenty"),
				sModelDokumenty = oModelDokumenty.getJSON(),
				oJSONModelDokumenty = JSON.parse(sModelDokumenty);
			oJSONModelDokumenty.push(oParseJson);
			oModelDokumenty.setData(oJSONModelDokumenty);/*
		},
		_onCreateSuccess: function (sNewIdKey) {
			var sMessage = 'Poprawnie zapisano dane !!!';/*this.getResourceBundle().getText("newPersonCreated",
				[oPerson.Pesel]);*/
			
			var oJSONModel_Add =  this.getView().getBindingContext('products_Add').getModel();

			var sJSON_Add =  oJSONModel_Add.getJSON();
			var oJSON_Add = JSON.parse(sJSON_Add);
			oJSON_Add.id = sNewIdKey;

			var oModel = this.getView().getModel("products");
			var sModel = oModel.getJSON();
			var oJSON = JSON.parse(sModel);

			oJSON.push(oJSON_Add);
			oModel.setData(oJSON);

			this.getRouter().navTo("List", true);
			this.getView().unbindObject('products_Add');
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		_onCreateFailed: function (oError) {
			var sMessage = 'Błąd przy zapisie danych !!!';// this.getResourceBundle().getText("newPersonNotCreated",
				//[oPerson.Pesel]);
				
			this.onNavBack();
	
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},

		_onPatternMatch: function (oEvent) {
			var oModel = this.getView().getModel("dokumenty");
			oModel.dataLoaded().then(this._onMetadataLoaded.bind(this,oModel));
		},
		_onMetadataLoaded: function(oModel){
			var oTODOClearLineModel = oModel.getProperty("/0");

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
									oTODOClearLineModel[key][key_deep][key_deep_deep] = null;
								}
							}
						}else{
							oTODOClearLineModel[key][key_deep] = null;
						}
					}
				}else{
					oTODOClearLineModel[key] = null;
				}
			}


			var oJSON = new JSONModel(oTODOClearLineModel);
			this.getView().setModel(oJSON);// Czysta struktura JSON
		},
		onExit: function () {
			this.oRouter.getRoute("addDocument").detachPatternMatched(this._onPatternMatch, this);
		}
	});
});
