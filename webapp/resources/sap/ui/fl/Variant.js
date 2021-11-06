/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/fl/Layer","sap/ui/fl/Utils","sap/ui/fl/LayerUtils","sap/ui/fl/registry/Settings","sap/base/util/merge","sap/base/Log"],function(q,M,L,U,a,S,m,b){"use strict";var V=M.extend("sap.ui.fl.Variant",{constructor:function(f){M.apply(this);if(!q.isPlainObject(f)){b.error("Constructor : sap.ui.fl.Variant : oFile is not defined");}this._oDefinition=f;this._oOriginDefinition=m({},f);this._sRequest='';this._bUserDependent=(f.content.layer===L.USER);this._vRevertData=null;this.setState(V.states.NEW);},metadata:{properties:{state:{type:"string"}}}});V.states={NEW:"NEW",PERSISTED:"NONE",DELETED:"DELETE",DIRTY:"UPDATE"};V.events={markForDeletion:"markForDeletion"};V.prototype.setState=function(s){if(this._isValidState(s)){this.setProperty("state",s);}return this;};V.prototype._isValidState=function(s){var c=false;Object.keys(V.states).some(function(k){if(V.states[k]===s){c=true;}return c;});if(!c){return false;}if((this.getState()===V.states.NEW)&&(s===V.states.DIRTY)){return false;}return true;};V.prototype.isValid=function(){var i=true;if(typeof(this._oDefinition)!=="object"){i=false;}if(!this._oDefinition.content.fileType||this._oDefinition.content.fileType!=="ctrl_variant"){i=false;}if(!this._oDefinition.content.fileName){i=false;}if(!this._oDefinition.content.content.title){i=false;}if(!this._oDefinition.content.variantManagementReference){i=false;}if(!this._oDefinition.content.layer){i=false;}if(!this._oDefinition.content.originalLanguage){i=false;}return i;};V.prototype.isVariant=function(){return true;};V.prototype.getDefinitionWithChanges=function(){return this._oDefinition;};V.prototype.getTitle=function(){if(this._oDefinition){return this._oDefinition.content.content.title;}};V.prototype.getFileType=function(){if(this._oDefinition){return this._oDefinition.content.fileType;}};V.prototype.getControlChanges=function(){return this._oDefinition.controlChanges;};V.prototype.getOriginalLanguage=function(){if(this._oDefinition&&this._oDefinition.content.originalLanguage){return this._oDefinition.content.originalLanguage;}return"";};V.prototype.getPackage=function(){return this._oDefinition.content.packageName;};V.prototype.getNamespace=function(){return this._oDefinition.content.namespace;};V.prototype.setNamespace=function(n){this._oDefinition.content.namespace=n;};V.prototype.getId=function(){return this._oDefinition.content.fileName;};V.prototype.getContent=function(){return this._oDefinition.content.content;};V.prototype.setContent=function(c){this._oDefinition.content.content=c;this.setState(V.states.DIRTY);};V.prototype.getVariantManagementReference=function(){return this._oDefinition.content.variantManagementReference;};V.prototype.getVariantReference=function(){return this._oDefinition.content.variantReference;};V.prototype.getOwnerId=function(){return this._oDefinition.content.support?this._oDefinition.content.support.user:"";};V.prototype.getText=function(t){if(typeof(t)!=="string"){b.error("sap.ui.fl.Variant.getTexts : sTextId is not defined");}if(this._oDefinition.content.texts){if(this._oDefinition.content.texts[t]){return this._oDefinition.content.texts[t].value;}}return"";};V.prototype.setText=function(t,n){if(typeof(t)!=="string"){b.error("sap.ui.fl.Variant.setTexts : sTextId is not defined");return;}if(this._oDefinition.content.texts){if(this._oDefinition.content.texts[t]){this._oDefinition.content.texts[t].value=n;this.setState(V.states.DIRTY);}}};V.prototype.isReadOnly=function(){return this._isReadOnlyDueToLayer()||this._isReadOnlyWhenNotKeyUser();};V.prototype._isReadOnlyWhenNotKeyUser=function(){if(this.isUserDependent()){return false;}var r=this.getDefinition().reference;if(!r){return true;}var s=S.getInstanceOrUndef();if(!s){return true;}return!s.isKeyUser();};V.prototype._isReadOnlyDueToLayer=function(){var c;c=a.getCurrentLayer(this._bUserDependent);return(this._oDefinition.content.layer!==c);};V.prototype._isReadOnlyDueToOriginalLanguage=function(){var c;var o;o=this.getOriginalLanguage();if(!o){return false;}c=U.getCurrentLanguage();return(c!==o);};V.prototype.markForDeletion=function(){this.setState(V.states.DELETED);};V.prototype.setRequest=function(r){if(typeof(r)!=="string"){b.error("sap.ui.fl.Variant.setRequest : sRequest is not defined");}this._sRequest=r;};V.prototype.getRequest=function(){return this._sRequest;};V.prototype.getLayer=function(){return this._oDefinition.content.layer;};V.prototype.getComponent=function(){return this._oDefinition.content.reference;};V.prototype.setComponent=function(c){this._oDefinition.content.reference=c;};V.prototype.getCreation=function(){return this._oDefinition.content.creation;};V.prototype.isUserDependent=function(){return(this._bUserDependent);};V.prototype.getPendingAction=function(){return this.getState();};V.prototype.getDefinition=function(){return this._oDefinition.content;};V.prototype.setResponse=function(r){var R=JSON.stringify(r);if(R){this._oDefinition=JSON.parse(R);this._oOriginDefinition=JSON.parse(R);this.setState(V.states.PERSISTED);}};V.prototype.getFullFileIdentifier=function(){var l=this.getLayer();var n=this.getNamespace();var f=this.getDefinition().content.fileName;var F=this.getDefinition().content.fileType;return l+"/"+n+"/"+f+"."+F;};V.prototype.getRevertData=function(){return this._vRevertData;};V.prototype.setRevertData=function(d){this._vRevertData=d;};V.prototype.resetRevertData=function(){this.setRevertData(null);};V.createInitialFileContent=function(p){if(!p){p={};}var f=p.content.fileName||U.createDefaultFileName();var n=p.content.namespace||U.createNamespace(p.content,"variants");var N={content:{fileName:f,fileType:"ctrl_variant",variantManagementReference:p.content.variantManagementReference,variantReference:p.content.variantReference||"",reference:p.content.reference||"",packageName:p.content.packageName||"",content:{title:p.content.content.title||""},self:n+f+"."+"ctrl_variant",layer:p.content.layer||a.getCurrentLayer(p.isUserDependent),texts:p.content.texts||{},namespace:n,creation:"",originalLanguage:U.getCurrentLanguage(),conditions:{},support:{generator:p.generator||"Change.createInitialFileContent",service:p.service||"",user:"",sapui5Version:sap.ui.version}},controlChanges:p.controlChanges||[],variantChanges:{}};return N;};return V;},true);
