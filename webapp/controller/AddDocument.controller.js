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

			// attach handlers for validation errors
			// this.oOwnerComponent = this.getOwnerComponent();
			// this.oModel = this.oOwnerComponent.getModel();
		},
		onSubmit: function () {
			this._prepareModel();
			var oView = this.getView(),
				oViewModelDataJson = oView.getModel("addDocument");//,
				/*aInputs = [
				oView.byId("nameInput"),
				oView.byId("emailInput")
				];*/
			
				jQuery.ajax({
				method: "POST",
				url: "proxy/https/localhost:5001/api/inz/dokument",
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
			oNewModel.id = sHeaderId;
			oJSONNewModel = oNewModel.getJSON();

			var oModel = this.getView().getModel("dokumenty"),
				sModelDokumenty = oModel.getJSON(),
				oJSONModelDokumenty = JSON.parse(sModelDokumenty);
			oJSONModelDokumenty.push(oNewModel);
			oModel.setData(oJSONModelDokumenty)

			var oNextUIState = oHelper.getNextUIState(1);
			this.getView().unbindObject();

			this.oRouter.navTo("detail", {
				layout: oNextUIState.layout,
				product: sHeaderId
			});

			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		_prepareModel: function(){
			var dzisiaj = new Date().toISOString();
			var test = this.getView().getModel("addDocument");
			var type_doc = this.getView().byId("type_documentu").getSelectedItem().mProperties;
			this.getView().getModel("addDocument").setProperty("/typDokumentu/id", type_doc.key);
			this.getView().getModel("addDocument").setProperty("/typDokumentu/nazwa", type_doc.text);
			this.getView().getModel("addDocument").setProperty("dataWystawienia", new Date());
			var test2 = this.getView().getModel("addDocument");
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
			this.getView().setModel(oJSON, "addDocument");// Czysta struktura JSON
		},
		onExit: function () {
			this.oRouter.getRoute("addDocument").detachPatternMatched(this._onPatternMatch, this);
		}
	});
});
