/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/base/util/merge","sap/base/strings/capitalize","sap/base/Log","sap/ui/test/Opa5","sap/ui/test/actions/Action","sap/ui/test/actions/Press","sap/ui/test/actions/EnterText","sap/ui/test/matchers/Matcher","sap/ui/test/matchers/MatcherFactory","sap/ui/test/pipelines/MatcherPipeline","sap/ui/test/pipelines/ActionPipeline"],function(m,c,L,O,A,P,E,M,a,b,d){"use strict";function _(){return m.apply(this,[{}].concat(Array.prototype.slice.call(arguments)));}function e(T,V,N){var w=Array.isArray(V)?V:[V];return w.reduce(function(I,x){if(I){return true;}if(x===null||x===undefined){return T===x;}if(T===null||T===undefined){return!!N;}if(typeof x==="function"){if(x===Boolean){return typeof T==="boolean";}if(x===Array){return Array.isArray(T);}if(x===String){return typeof T==="string"||T instanceof String;}if(x===Object){return typeof T==="object"&&T.constructor===Object;}return T instanceof x;}return typeof T===x;},false);}function f(V){return Object.prototype.toString.call(V)==="[object Arguments]";}function g(w){var x=Array.prototype.slice.call(arguments,1);if(x.length===1&&f(x[0])){x=Array.prototype.slice.call(x[0],0);}return w.reduce(function(y,z){if(e(x[0],z,true)){y.push(x.shift());}else{y.push(undefined);}return y;},[]);}function h(w,T,x){if(T===undefined){T=[];}else if(!Array.isArray(T)){T=[T];}else{T=T.slice(0);}if(Array.isArray(w)){T=x?w.slice(0).concat(T):T.concat(w);}else if(w!==undefined){if(x){T.unshift(w);}else{T.push(w);}}return T;}function i(N,w,R){if(!e(N,Function)){throw new Error("not a function");}if(!e(w,Function)){return N;}if(R){return function(x){return w(x)&&N(x);};}return function(x){w(x);N(x);};}function j(S){if(e(S,v)){return function(){return S.execute();};}if(!e(S,Function)){return function(){O.assert.ok(true,S||"Success");};}return S;}function k(w){var x="";x+=w.controlType||"Control";x+="#"+(w.id||"<undefined>");x+=w.matchers?" with "+(e(w.matchers,Array)?w.matchers.length:1)+" additional matcher(s)":"";x+=" not found";return x;}function l(w,x){if(!w){return null;}var y=w["get"+c(x,0)];if(!y){throw new Error("Object '"+w+"' does not have an aggregation called '"+x+"'");}return y.call(w);}function n(w,T){if(w&&T){u.process({actions:w,control:T});}}function o(w,T){return t.process({matchers:s.getFilteringMatchers({matchers:w}),control:T});}function p(F){var w=F.indexOf(">"),x=w===-1?undefined:F.substring(0,w),y=w===-1?F:F.substring(w+1);return{model:x,path:y};}function q(C){if(e(C,Boolean)){return C?v.Matchers.TRUE:v.Matchers.FALSE;}return v.Matchers.match(C);}var r={autoWait:true,visible:true},s=new a(),t=new b(),u=new d();var v=function(w,x){var y=g([O,Object],w,x);this._oOpaInstance=y[0];return this.options(r,y[1]);};v.defaultOptions=function(w){if(arguments.length>0){r=_(w);}return _(r);};v.create=function(w,I,C,D,x,y,z){var B=g([O,[String,RegExp],String,Boolean,[M,Function,Array,Object],[A,Function,Array],Object],w,I,C,D,x,y,z);return new v(B[0]).hasId(B[1]).hasType(B[2]).isDialogElement(!!B[3]).has(B[4]).do(B[5]).options(B[6]);};v.prototype.options=function(w){this._oOptions=_.apply(this,[this._oOptions].concat(Array.prototype.slice.call(arguments)));return this;};v.prototype.viewId=function(V){return this.options({viewId:V});};v.prototype.viewName=function(V){return this.options({viewName:V});};v.prototype.viewNamespace=function(V){return this.options({viewNamespace:V});};v.prototype.fragmentId=function(F){return this.options({fragmentId:F});};v.prototype.timeout=function(T){return this.options({timeout:T});};v.prototype.debugTimeout=function(D){return this.options({debugTimeout:D});};v.prototype.pollingInterval=function(w){return this.options({pollingInterval:w});};v.prototype.hasId=function(I){return this.options({id:I});};v.prototype.hasType=function(C){return this.options({controlType:C});};v.prototype.has=function(w,R){return this.options({matchers:R?w:h(w,this._oOptions.matchers)});};v.prototype.hasProperties=function(w){return this.has(v.Matchers.properties(w));};v.prototype.hasI18NText=function(w,x,y){return this.has(v.Matchers.i18n.apply(v.Matchers,arguments));};v.prototype.hasAggregation=function(w,x){return this.has(v.Matchers.aggregationMatcher(w,x));};v.prototype.hasAggregationProperties=function(w,x){return this.hasAggregation(w,v.Matchers.properties(x));};v.prototype.hasAggregationLength=function(w,N){return this.has(v.Matchers.aggregationLength(w,N));};v.prototype.hasChildren=function(B,D){return this.has(v.Matchers.childrenMatcher(B,D));};v.prototype.hasConditional=function(C,S,w){return this.has(v.Matchers.conditional(C,S,w));};v.prototype.hasSome=function(w){return this.has(v.Matchers.some.apply(v.Matchers,arguments));};v.prototype.mustBeEnabled=function(w){return this.options({enabled:arguments.length?!!w:true});};v.prototype.mustBeVisible=function(V){return this.options({visible:arguments.length?!!V:true});};v.prototype.mustBeReady=function(R){return this.options({autoWait:arguments.length?!!R:true});};v.prototype.isDialogElement=function(D){return this.options({searchOpenDialogs:arguments.length?!!D:true});};v.prototype.check=function(C,R){return this.options({check:R?C:i(C,this._oOptions.check,true)});};v.prototype.checkNumberOfMatches=function(w){return this.check(function(C){if(!C){return w===0;}if(!e(C,Array)){C=[C];}return C.length===w;});};v.prototype.do=function(w,R){if(e(w,v)){L.error("(deprecated) OpaBuilder instance is incorrectly used in .do function - use .success instead");return this.success(w);}return this.options({actions:R?w:h(w,this._oOptions.actions)});};v.prototype.doConditional=function(C,S,w){if(e(S,v)||e(w,v)){L.error("(deprecated) OpaBuilder instance is incorrectly used in .doConditional function - use .success instead");return this.success(v.Actions.conditional(C,S,w));}return this.do(v.Actions.conditional(C,S,w));};v.prototype.doPress=function(I){return this.do(v.Actions.press(I));};v.prototype.doEnterText=function(T,C,K,w,I){return this.do(v.Actions.enterText(T,C,K,w,I));};v.prototype.doOnAggregation=function(w,x,y){if(arguments.length<3){y=x;x=undefined;}var F=v.Matchers.filter(x),z=n.bind(this,y);return this.do(function(C){F(l(C,w)).forEach(z);});};v.prototype.doOnChildren=function(C,w,D){var x=g([[M,Function,Array,Object,v],[A,Function,Array],Boolean],C,w,D);C=x[0];w=x[1];D=x[2];if(!e(C,v)){C=new v(this.getOpaInstance()).has(x[0]);}if(w){C.do(w);}return this.do(function(y){var z=C.build(),B=v.Matchers.children(C,D)(y);return v.Actions.executor(z.actions)(B);});};v.prototype.description=function(D){return this.success(D+" - OK").error(D+" - FAILURE");};v.prototype.success=function(S,R){var w=j(S);return this.options({success:R?w:i(w,this._oOptions.success)});};v.prototype.error=function(w,R){if(e(w,String)){return this.options({errorMessage:w});}return this.options({error:R?w:i(w,this._oOptions.error)});};v.prototype.build=function(){if(!this._oOptions.errorMessage){this.error(k(this._oOptions));}return _(this._oOptions);};v.prototype.execute=function(w){if(e(w,O)){this.setOpaInstance(w);}return this.getOpaInstance().waitFor(this.build());};v.prototype.setOpaInstance=function(w){if(!e(w,O,true)){throw new Error("Opa5 instance expected");}this._oOpaInstance=w;};v.prototype.getOpaInstance=function(){if(!e(this._oOpaInstance,O)){this.setOpaInstance(new O());}return this._oOpaInstance;};v.Matchers={TRUE:function(){return true;},FALSE:function(){return false;},not:function(w){var x=v.Matchers.match(w);return function(C){return!x(C);};},ancestor:function(w,D){return{ancestor:[[w,D]]};},descendant:function(D,w){return{descendant:[[D,w]]};},properties:function(w){return{properties:w};},i18n:function(w,x,y){var z=p(x),B=z.model||"i18n",T=z.path;if(arguments.length>3||(y&&!Array.isArray(y))){y=Array.prototype.slice.call(arguments,2);}return{i18NText:{propertyName:w,modelName:B,key:T,parameters:y}};},resourceBundle:function(w,x,T,y){if(arguments.length>4||(y&&!Array.isArray(y))){y=Array.prototype.slice.call(arguments,3);}return function(C){var R=sap.ui.getCore().getLibraryResourceBundle(x),z=R.getText(T,y),B={};B[w]=z;return o({properties:B},C);};},labelFor:function(w,T,x,y){var z=3,B;if(!e(T,Boolean)){z=2;y=x;x=T;T=false;}if(T){return{labelFor:{propertyName:w,text:x}};}B=p(x);if(arguments.length>z+1||(y&&!Array.isArray(y))){y=Array.prototype.slice.call(arguments,z);}return{labelFor:{propertyName:w,modelName:B.model||"i18n",key:B.path,parameters:y}};},children:function(B,D){var w=g([[M,Function,Array,Object,v],Boolean],B,D);B=w[0];D=w[1];if(!e(B,v)){B=new v().has(B);}return function(C){var x=B.build(),y=O.getPlugin().getMatchingControls(x),z=h(v.Matchers.ancestor(C,D),x.matchers,true);return v.Matchers.filter(z)(y);};},childrenMatcher:function(B,D){var C=v.Matchers.children(B,D);return function(w){return C(w).length>0;};},aggregation:function(w,x){var F=v.Matchers.filter(x);return function(C){return F(l(C,w));};},aggregationMatcher:function(w,x){var y=v.Matchers.aggregation(w,x);return function(C){return y(C).length>0;};},aggregationLength:function(w,x){return{aggregationLengthEquals:{name:w,length:x}};},aggregationAtIndex:function(w,I){return function(C){var x=l(C,w);return x&&I<x.length?x[I]:undefined;};},bindingProperties:function(w,x){if(!x){x=w;w=undefined;}return function(C){var y=C.getBindingContext(w)||C.getModel(w),K,V,U=false;if(!y){return false;}if(y.isA("sap.ui.model.Model")){U=true;}for(K in x){V=y.getProperty(U?"/"+K:K);if(V!==x[K]){return false;}}return true;};},bindingPath:function(w,x){var y=p(w);return{bindingPath:{modelName:y.model,path:y.path,propertyPath:x}};},customData:function(C){if(!C){return v.Matchers.TRUE;}return function(w){if(!w||typeof w.data!=="function"){return false;}return Object.keys(C).reduce(function(x,K){return x&&w.data(K)===C[K];},true);};},conditional:function(C,S,w){var x=q(C);return function(y){if(x(y)){return o(S,y);}return w?o(w,y):true;};},focused:function(C){return function(w){var $=w&&w.isA("sap.ui.core.Element")&&w.$();return $&&($.is(":focus")||$.hasClass("sapMFocus")||(C&&$.find(":focus").length>0))||false;};},some:function(w){if(w.length>1||(w&&!Array.isArray(w))){w=Array.prototype.slice.call(arguments,0);}return function(C){var x=false;if(w.some(function(y){x=o(y,C);return x;})){return x;}return false;};},filter:function(w){return function(I){if(I===null||I===undefined){return[];}if(!e(I,Array)){I=[I];}return o(w,I)||[];};},match:function(w){return function(I){if(I===null||I===undefined){return false;}var R=o(w,[I]);return R.length?R[0]:false;};}};v.Actions={press:function(I){return new P({idSuffix:I});},enterText:function(T,C,K,w,I){var x=g([String,Boolean,Boolean,Boolean,String],arguments);return new E({text:x[0],clearTextFirst:x[1],keepFocus:x[2],pressEnterKey:x[3],idSuffix:x[4]});},conditional:function(C,S,w){var x=q(C),y=S,z=w;if(e(S,v)){y=function(){return S.execute();};}if(w&&e(w,v)){z=function(){return w.execute();};}return function(B){if(x(B)){return n(y,B);}else if(z){return n(z,B);}};},executor:function(w){return function(C){if(!C){return;}if(e(C,Array)){return C.map(function(x){return n(w,x);});}return n(w,C);};}};return v;});
