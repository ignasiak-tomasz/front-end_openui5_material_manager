/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/ui/core/CustomData","sap/ui/core/mvc/View","sap/ui/base/ManagedObjectObserver","./BlockBaseMetadata","sap/ui/model/Context","sap/ui/Device","sap/ui/layout/form/ColumnLayout","./library","sap/ui/core/Component","sap/ui/layout/library","sap/base/Log"],function(q,C,a,b,M,B,c,D,d,l,e,f,L){"use strict";var S=f.form.SimpleFormLayout;var g=l.BlockBaseFormAdjustment;var h=C.extend("sap.uxap.BlockBase",{metadata:{designtime:"sap/uxap/designtime/BlockBase.designtime",library:"sap.uxap",properties:{"mode":{type:"string",group:"Appearance"},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"columnLayout":{type:"sap.uxap.BlockBaseColumnLayout",group:"Behavior",defaultValue:"auto"},"formAdjustment":{type:"sap.uxap.BlockBaseFormAdjustment",group:"Behavior",defaultValue:g.BlockColumns},"showSubSectionMore":{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"mappings",aggregations:{"mappings":{type:"sap.uxap.ModelMapping",multiple:true,singularName:"mapping"},"_views":{type:"sap.ui.core.Control",multiple:true,singularName:"view",visibility:"hidden"}},associations:{"selectedView":{type:"sap.ui.core.Control",multiple:false}},events:{"viewInit":{parameters:{view:{type:"sap.ui.core.mvc.View"}}}},views:{}},renderer:"sap.uxap.BlockBaseRenderer"},B);h.prototype.init=function(){if(!this.getMetadata().hasViews()){this.getMetadata().setView("defaultXML",{viewName:this.getMetadata().getName(),type:"XML"});}this._oMappingApplied={};this._bLazyLoading=false;this._bConnected=false;this._oUpdatedModels={};this._oParentObjectPageSubSection=null;this._oPromisedViews={};this._oViewDestroyObserver=new M(this._onViewDestroy.bind(this));};h.prototype.onBeforeRendering=function(){var p;this._applyMapping();if(!this.getMode()||this.getMode()===""){if(this.getMetadata().getView("defaultXML")){this.setMode("defaultXML");}else{L.error("BlockBase ::: there is no mode defined for rendering "+this.getMetadata().getName()+". You can either set a default mode on the block metadata or set the mode property before rendering the block.");}}this._applyFormAdjustment();p=this._getObjectPageLayout();this._bLazyLoading=p&&(p.getEnableLazyLoading()||p.getUseIconTabBar());};h.prototype.onAfterRendering=function(){var p=this._getObjectPageLayout();if(p){p._requestAdjustLayout();}};h.prototype.setParent=function(p,A,s){if(p instanceof l.ObjectPageSubSection){this._bLazyLoading=true;this._oParentObjectPageSubSection=p;}else{C.prototype.setParent.call(this,p,A,s);}};h.prototype.setModel=function(m,n){this._applyMapping(n);return C.prototype.setModel.call(this,m,n);};h.prototype._applyMapping=function(){if(this._shouldLazyLoad()){L.debug("BlockBase ::: Ignoring the _applyMapping as the block is not connected");}else{this.getMappings().forEach(function(m,i){var o,j,I=m.getInternalModelName(),E=m.getExternalPath(),s=m.getExternalModelName(),p;if(E){if(I==""||E==""){throw new Error("BlockBase :: incorrect mapping, one of the modelMapping property is empty");}o=this.getModel(s);if(!o){return;}p=o.resolve(E,this.getBindingContext(s));j=this.getBindingContext(I);if(!this._isMappingApplied(I)||(this.getModel(I)!==this.getModel(s))||(j&&(j.getPath()!==p))){L.info("BlockBase :: mapping external model "+s+" to "+I);this._oMappingApplied[I]=true;C.prototype.setModel.call(this,o,I);this.setBindingContext(new c(o,p),I);}}},this);}};h.prototype._isMappingApplied=function(i){return this.getModel(i)&&this._oMappingApplied[i];};h.prototype.propagateProperties=function(n){if(this._shouldLazyLoad()&&!this._oUpdatedModels.hasOwnProperty(n)){this._oUpdatedModels[n]=true;}else{this._applyMapping(n);}return C.prototype.propagateProperties.call(this,n);};h.prototype.getSupportedModes=function(){var s=q.extend({},this.getMetadata().getViews());for(var k in s){s[k]=k;}return s;};h.prototype.setMode=function(m){m=this._validateMode(m);if(this.getMode()!==m){this.setProperty("mode",m,false);if(!this._shouldLazyLoad()){this._selectView(m);}}return this;};h.prototype.setColumnLayout=function(s){if(this._oParentObjectPageSubSection){this._oParentObjectPageSubSection.invalidate();}this.setProperty("columnLayout",s);};h.prototype.clone=function(){var A=-1,s=this.getAssociation("selectedView"),v=this.getAggregation("_views")||[];if(s){v.forEach(function(V,i){if(V.getId()===s){A=i;}return A<0;});}var n=C.prototype.clone.call(this);if(A>=0){n.setAssociation("selectedView",n.getAggregation("_views")[A]);}return n;};h.prototype._validateMode=function(m){this.validateProperty("mode",m);if(!this.getMetadata().getView(m)){var s=this.getMetadata()._sClassName||this.getId();if(this.getMetadata().getView("defaultXML")){L.warning("BlockBase :: no view defined for block "+s+" for mode "+m+", loading defaultXML instead");m="defaultXML";}else{throw new Error("BlockBase :: no view defined for block "+s+" for mode "+m);}}return m;};h.prototype._getSelectedViewContent=function(){var v=null,s,V;s=this.getAssociation("selectedView");V=this.getAggregation("_views");if(V){for(var i=0;!v&&i<V.length;i++){if(V[i].getId()===s){v=V[i];}}}return v;};h.prototype.createView=function(p,m){if(!this._oPromisedViews[p.id]){this._oPromisedViews[p.id]=new Promise(function(r,i){var o=e.getOwnerComponentFor(this),j=function(){var k=function(){return b.create(p);};if(o){return o.runAsOwner(k);}else{return k();}};j().then(function(v){this._afterViewInstantiated(v,m);r(v);}.bind(this));}.bind(this));}return this._oPromisedViews[p.id];};h.prototype._afterViewInstantiated=function(v,m){var o=v.getController();if(v){if(o){o.oParentBlock=this;}v.addCustomData(new a({"key":"layoutMode","value":m}));this.addAggregation("_views",v);this._oViewDestroyObserver.observe(v,{destroy:true});this.fireEvent("viewInit",{view:v});}else{throw new Error("BlockBase :: no view defined in metadata.views for mode "+m);}};h.prototype._notifyForLoadingInMode=function(o,v,m){if(o&&typeof o.onParentBlockModeChange==="function"){o.onParentBlockModeChange(m);}else{L.info("BlockBase ::: could not notify "+v.sViewName+" of loading in mode "+m+": missing controller onParentBlockModeChange method");}};h.prototype._selectView=function(m){var v,V=this.getId()+"-"+m,s,i;i=function(v){if(v&&this.getAssociation("selectedView")!==V){this.setAssociation("selectedView",v);this._notifyForLoadingInMode(v.getController(),v,m);}}.bind(this);v=this._findView(m);if(v){i(v);return;}s=this.getMetadata().getView(m);s.id=V;this.createView(s,m).then(function(v){i(v);});};h.prototype._findView=function(m){var v=this.getAggregation("_views")||[],V,F;F=v.filter(function(o){return o.data("layoutMode")===m;});if(F.length){return F[0];}V=this.getMetadata().getView(m);F=v.filter(function(o){return V.viewName===o.getViewName();});if(F.length){return F[0];}};h.FORM_ADUSTMENT_OFFSET=16;h._FORM_ADJUSTMENT_CONST={labelSpan:{L:12},emptySpan:{L:0},columns:{XL:1,L:1,M:1}};h._PARENT_GRID_SIZE=12;h.prototype._computeFormAdjustmentFields=function(F,p){if(F&&p){return F===g.BlockColumns?q.extend({},h._FORM_ADJUSTMENT_CONST,{columns:p}):h._FORM_ADJUSTMENT_CONST;}};h.prototype._applyFormAdjustment=function(){var F=this.getFormAdjustment(),v=this._getSelectedViewContent(),p=this._oParentObjectPageSubSection,o;if((F!==g.None)&&v&&p){o=this._computeFormAdjustmentFields(F,p._oLayoutConfig);v.getContent().forEach(function(i){this._adjustForm(i,o);}.bind(this));}};h.prototype._adjustForm=function(F,o){var i,j;if(F.getMetadata().getName()==="sap.ui.layout.form.SimpleForm"){F.setLayout(S.ColumnLayout);j=F.getAggregation("form").getLayout();j._iBreakPointTablet-=h.FORM_ADUSTMENT_OFFSET;j._iBreakPointDesktop-=h.FORM_ADUSTMENT_OFFSET;j._iBreakPointLargeDesktop-=h.FORM_ADUSTMENT_OFFSET;F.setLabelSpanL(o.labelSpan.L);F.setEmptySpanL(o.emptySpan.L);this._applyFormAdjustmentFields(o,F);F.setWidth("100%");}else if(F.getMetadata().getName()==="sap.ui.layout.form.Form"){j=F.getLayout();if(j&&j.getMetadata().getName()==="sap.ui.layout.form.ColumnLayout"){i=j;}else{i=new d();F.setLayout(i);}i._iBreakPointTablet-=h.FORM_ADUSTMENT_OFFSET;i._iBreakPointDesktop-=h.FORM_ADUSTMENT_OFFSET;i._iBreakPointLargeDesktop-=h.FORM_ADUSTMENT_OFFSET;i.setLabelCellsLarge(o.labelSpan.L);i.setEmptyCellsLarge(o.emptySpan.L);this._applyFormAdjustmentFields(o,i);F.setWidth("100%");}};h.prototype._applyFormAdjustmentFields=function(F,o){o.setColumnsXL(F.columns.XL);o.setColumnsL(F.columns.L);o.setColumnsM(F.columns.M);};h.prototype._getObjectPageLayout=function(){return l.Utilities.getClosestOPL(this);};h.prototype.setVisible=function(v,s){var p=this._getObjectPageLayout();if(v===this.getVisible()){return this;}this.setProperty("visible",v,s);p&&p._requestAdjustLayoutAndUxRules();return this;};h.prototype.setShowSubSectionMore=function(v,i){if(v!=this.getShowSubSectionMore()){this.setProperty("showSubSectionMore",v,true);if(this._oParentObjectPageSubSection){this._oParentObjectPageSubSection.refreshSeeMoreVisibility();}}return this;};h.prototype.connectToModels=function(){if(!this._bConnected){L.debug("BlockBase :: Connecting block to the UI5 model tree");this._bConnected=true;if(this._bLazyLoading){var m=this.getMode();m&&this._selectView(m);this.updateBindings(true,null);}this.invalidate();}};h.prototype._allowPropagationToLoadedViews=function(A){if(!this._bConnected){return;}this.mSkipPropagation._views=!A;};h.prototype.updateBindingContext=function(s,i,m,u){if(!this._shouldLazyLoad()){return C.prototype.updateBindingContext.call(this,s,i,m,u);}else{L.debug("BlockBase ::: Ignoring the updateBindingContext as the block is not visible for now in the ObjectPageLayout");}};h.prototype.updateBindings=function(u,m){if(!this._shouldLazyLoad()){return C.prototype.updateBindings.call(this,u,m);}else{L.debug("BlockBase ::: Ignoring the updateBindingContext as the block is not visible for now in the ObjectPageLayout");}};h.prototype.exit=function(){if(this._oViewDestroyObserver){this._oViewDestroyObserver.disconnect();}};h.prototype._shouldLazyLoad=function(){return!!this._oParentObjectPageSubSection&&this._bLazyLoading&&!this._bConnected;};h.prototype._onViewDestroy=function(E){delete this._oPromisedViews[E.object.getId()];};return h;});
