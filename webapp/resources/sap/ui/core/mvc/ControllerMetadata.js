/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Metadata','sap/base/util/merge','sap/ui/core/mvc/OverrideExecution',"sap/base/Log"],function(M,a,O,L){"use strict";var C=function(c,o){M.apply(this,arguments);if(this.isA("sap.ui.core.mvc.ControllerExtension")&&this.getParent().getClass().override){this.getClass().override=this.getParent().getClass().override;}};C.prototype=Object.create(M.prototype);C.prototype.constructor=C;C.prototype.applySettings=function(c){if(c.override){this._override=c.override;delete c.override;}M.prototype.applySettings.call(this,c);var s=c.metadata;this._defaultLifecycleMethodMetadata={"onInit":{"public":true,"final":false,"overrideExecution":O.After},"onExit":{"public":true,"final":false,"overrideExecution":O.Before},"onBeforeRendering":{"public":true,"final":false,"overrideExecution":O.Before},"onAfterRendering":{"public":true,"final":false,"overrideExecution":O.After}};var i=this.isA("sap.ui.core.mvc.ControllerExtension");var r=/^_/;var e=this._oParent.isA("sap.ui.core.mvc.Controller");var d=c.metadata&&c.metadata.methods?true:false;if(!i){if(e&&!d){r=/^_|^on|^init$|^exit$/;}if(e&&d){a(s.methods,this._defaultLifecycleMethodMetadata);}}if(i||d){this._aPublicMethods=[];}this._mMethods=s.methods||{};for(var n in c){if(n!=="metadata"&&n!=="constructor"){if(!n.match(r)){if(e&&this._oParent&&this._oParent.isMethodFinal(n)){L.error("Method: '"+n+"' of controller '"+this._oParent.getName()+"' is final and cannot be overridden by controller '"+this.getName()+"'");delete this._oClass.prototype[n];}if(!(n in this._mMethods)&&typeof c[n]==='function'){if(!(c[n].getMetadata&&c[n].getMetadata().isA("sap.ui.core.mvc.ControllerExtension"))){this._mMethods[n]={"public":true,"final":false};}}}}}for(var m in this._mMethods){if(this.isMethodPublic(m)){this._aPublicMethods.push(m);}}};C.prototype.afterApplySettings=function(){M.prototype.afterApplySettings.call(this);var i=this.isA("sap.ui.core.mvc.ControllerExtension");if(this._oParent){var p=this._oParent._mMethods?this._oParent._mMethods:{};for(var m in p){if(this._mMethods[m]&&!i){var P=this._mMethods[m].public;this._mMethods[m]=a({},p[m]);if(P!==undefined){this._mMethods[m].public=P;}if(!this.isMethodPublic(m)&&this._mMethods[m].public!==p[m].public){this._aAllPublicMethods.splice(this._aAllPublicMethods.indexOf(m),1);}}else{this._mMethods[m]=p[m];}}}if(this._oParent&&this._oParent.isA("sap.ui.core.mvc.ControllerExtension")){this._bFinal=true;}};C.prototype.getNamespace=function(){var i=this._sClassName.indexOf("anonymousExtension~")==0;var n=i?this._oParent._sClassName:this._sClassName;return n.substr(0,n.lastIndexOf("."));};C.prototype.isMethodFinal=function(m){var o=this._mMethods[m];return o&&o.final;};C.prototype.isMethodPublic=function(m){var o=this._mMethods[m];return o&&o.public;};C.prototype.getAllMethods=function(){return this._mMethods;};C.prototype.getOverrideExecution=function(m){var o=this._mMethods[m];var s=O.Instead;if(o){s=o.overrideExecution;}return s;};C.prototype.getOverrides=function(){return this._override;};C.prototype.getStaticOverrides=function(){return this._staticOverride;};C.prototype.hasOverrides=function(){return!!this._override||!!this._staticOverride;};C.prototype.getLifecycleConfiguration=function(){return this._defaultLifecycleMethodMetadata;};return C;});
