/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Core","sap/base/Log","sap/ui/core/Icon","sap/m/HBox","sap/m/Text","sap/m/Select","sap/ui/core/ListItem","sap/ui/model/json/JSONModel","sap/ui/integration/util/LoadingProvider"],function(C,a,L,I,H,T,S,b,J,c){"use strict";var F=C.extend("sap.ui.integration.cards.Filter",{metadata:{properties:{key:{type:"string",defaultValue:""},config:{type:"object",defaultValue:"null"},value:{type:"string",defaultValue:""}},aggregations:{_select:{type:"sap.m.Select",multiple:false,visibility:"hidden"}},associations:{card:{type:"sap.ui.integration.widgets.Card",multiple:false}}},renderer:{apiVersion:2,render:function(r,f){var l=f.isLoading();r.openStart("div",f).class("sapFCardFilter");if(l){r.class("sapFCardFilterLoading");}r.openEnd();if(f._hasError()){r.renderControl(f._getErrorMessage());}else{r.renderControl(f._getSelect());}r.close("div");}}});F.prototype.init=function(){this._oLoadingProvider=new c();this.attachEventOnce("_dataReady",function(){this.fireEvent("_ready");});};F.prototype.exit=function(){if(this._oDataProvider){this._oDataProvider.destroy();this._oDataProvider=null;}if(this._oLoadingProvider){this._oLoadingProvider.destroy();this._oLoadingProvider=null;}};F.prototype.isLoading=function(){return!this._oLoadingProvider.getDataProviderJSON()&&this._oLoadingProvider.getLoadingState();};F.prototype._getSelect=function(){var o=this.getAggregation("_select");if(!o){o=this._createSelect();this.setAggregation("_select",o);}return o;};F.prototype._hasError=function(){return!!this._bError;};F.prototype._getErrorMessage=function(){var m="Unable to load the filter.";return new H({justifyContent:"Center",alignItems:"Center",items:[new I({src:"sap-icon://message-error",size:"1rem"}).addStyleClass("sapUiTinyMargin"),new T({text:m})]});};F.prototype._handleError=function(l){L.error(l);this._bError=true;this.invalidate();};F.prototype._onDataRequestComplete=function(){this.fireEvent("_dataReady");this._oLoadingProvider.setLoading(false);this.invalidate();};F.prototype._onDataRequested=function(){this._oLoadingProvider.createLoadingState(this._oDataProvider);};F.prototype._updateModel=function(d){var s=this._getSelect(),m=this.getModel();m.setData(d);s.setSelectedKey(this.getValue());this._updateSelected(s.getSelectedItem());};F.prototype._setDataConfiguration=function(d){if(!d){this.fireEvent("_dataReady");return;}if(this._oDataProvider){this._oDataProvider.destroy();}var o=a.byId(this.getCard());this._oDataProvider=o._oDataProviderFactory.create(d,null,true);this.setModel(new J());this._oDataProvider.attachDataRequested(function(){this._onDataRequested();}.bind(this));this._oDataProvider.attachDataChanged(function(e){this._updateModel(e.getParameter("data"));this._onDataRequestComplete();}.bind(this));this._oDataProvider.attachError(function(e){this._handleError(e.getParameter("message"));this._onDataRequestComplete();}.bind(this));this._oDataProvider.triggerDataUpdate();};F.prototype._updateSelected=function(s){var f=this.getModel("filters"),d=this.getKey();f.setProperty("/"+d,{"value":s.getKey(),"selectedItem":{"title":s.getText(),"key":s.getKey()}});};F.prototype._createSelect=function(){var s=new S(),i,d,e="/",o=this.getConfig();s.attachChange(function(E){var v=E.getParameter("selectedItem").getKey();this.setValue(v);this._updateSelected(E.getParameter("selectedItem"));}.bind(this));if(o&&o.item){e=o.item.path||e;}if(o&&o.item&&o.item.template){i=o.item.template.key;d=o.item.template.title;}if(o&&o.items){i="{key}";d="{title}";this.setModel(new J(o.items));}s.bindItems({path:e,template:new b({key:i,text:d})});s.setSelectedKey(this.getValue());return s;};return F;});