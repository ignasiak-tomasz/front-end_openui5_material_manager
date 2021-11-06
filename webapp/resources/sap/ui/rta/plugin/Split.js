/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/plugin/Plugin","sap/ui/dt/Util","sap/ui/fl/Utils","sap/base/util/uid"],function(P,D,F,u){"use strict";var S=P.extend("sap.ui.rta.plugin.Split",{metadata:{library:"sap.ui.rta",properties:{},associations:{},events:{}}});S.prototype._isEditable=function(o){var s=this.getAction(o);if(s&&s.changeType&&s.changeOnRelevantContainer){var r=o.getRelevantContainer();return this.hasChangeHandler(s.changeType,r).then(function(h){return h&&this.hasStableId(o)&&this._checkRelevantContainerStableID(s,o);}.bind(this));}return false;};S.prototype.isAvailable=function(e){if(e.length!==1){return false;}var E=e[0];if(!this._isEditableByPlugin(E)){return false;}var s=this.getAction(E);var o=E.getElement();if(s&&s.getControlsCount(o)<=1){return false;}return true;};S.prototype.isEnabled=function(e){var E=e[0];var a=this.getAction(E);if(!a||!this.isAvailable(e)){return false;}var A=true;if(typeof a.isEnabled!=="undefined"){if(typeof a.isEnabled==="function"){A=a.isEnabled(E.getElement());}else{A=a.isEnabled;}}return A;};S.prototype.handleSplit=function(e){var s=e.getElement();var p=s.getParent();var d=e.getDesignTimeMetadata();var E=this.getAction(e).getControlsCount(s);var v=F.getViewForControl(s);var n=[];for(var i=0;i<E;i++){n.push(v.createId(u()));}var o=this.getAction(e);var V=this.getVariantManagementReference(e,o);return this.getCommandFactory().getCommandFor(s,"split",{newElementIds:n,source:s,parentElement:p},d,V).then(function(a){this.fireElementModified({command:a});}.bind(this)).catch(function(a){throw D.propagateError(a,"Split#handleSplit","Error occured during handleSplit execution","sap.ui.rta.plugin");});};S.prototype.getMenuItems=function(e){return this._getMenuItems(e,{pluginId:"CTX_UNGROUP_FIELDS",rank:100,icon:"sap-icon://split"});};S.prototype.getActionName=function(){return"split";};S.prototype.handler=function(e){this.handleSplit(e[0]);};return S;});
