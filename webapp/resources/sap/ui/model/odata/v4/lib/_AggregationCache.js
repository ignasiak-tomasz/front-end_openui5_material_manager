/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_GroupLock","./_Helper","./_Parser","sap/base/Log","sap/ui/base/SyncPromise"],function(_,a,b,c,d,L,S){"use strict";var r=/,|%2C|%2c/,e=new RegExp("^"+d.sODataIdentifier+"(?:"+d.sWhitespace+"+(?:asc|desc))?$"),f=new RegExp(d.sWhitespace+"+");function g(R,s,A,q){var m={},F,M;a.call(this,R,s,q,true);this.oAggregation=A;if("$expand"in q){throw new Error("Unsupported system query option: $expand");}if("$select"in q){throw new Error("Unsupported system query option: $select");}if(_.hasMinOrMax(A.aggregate)){if(A.groupLevels.length){throw new Error("Unsupported group levels together with min/max");}this.oMeasureRangePromise=new Promise(function(h,i){M=h;});F=_.buildApply(A,q,m);this.oFirstLevel=a.create(R,s,F,true);this.oFirstLevel.getResourcePathWithQuery=g.getResourcePathWithQuery.bind(this.oFirstLevel,A,q);this.oFirstLevel.handleResponse=g.handleResponse.bind(this.oFirstLevel,null,m,M,this.oFirstLevel.handleResponse);}else if(A.groupLevels.length){this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;if(q.$count){throw new Error("Unsupported system query option: $count");}if(q.$filter){throw new Error("Unsupported system query option: $filter");}this.oFirstLevel=this.createGroupLevelCache();}else{this.oFirstLevel=a.create(R,s,q,true);this.oFirstLevel.getResourcePathWithQuery=g.getResourcePathWithQuery.bind(this.oFirstLevel,A,q);this.oFirstLevel.handleResponse=g.handleResponse.bind(this.oFirstLevel,A,null,null,this.oFirstLevel.handleResponse);}}g.prototype=Object.create(a.prototype);g.prototype.addElements=function(R,o,C,s){var E=this.aElements;if(o<0){throw new Error("Illegal offset: "+o);}R.forEach(function(h,i){var O=E[o+i],p,P=c.getPrivateAnnotation(h,"predicate");if(O){if(O===h){return;}p=c.getPrivateAnnotation(O,"parent");if(!p){throw new Error("Unexpected element");}if(p!==C||c.getPrivateAnnotation(O,"index")!==s+i){throw new Error("Wrong placeholder");}}else if(o+i>=E.length){throw new Error("Array index out of bounds: "+(o+i));}E[o+i]=h;E.$byPredicate[P]=h;});};g.prototype.collapse=function(G){var C=0,E=this.aElements,o=this.fetchValue(b.$cached,G).getResult(),h=o["@$ui5.node.level"],I=E.indexOf(o),i=I+1;c.updateAll(this.mChangeListeners,G,o,{"@$ui5.node.isExpanded":false});while(i<E.length&&E[i]["@$ui5.node.level"]>h){delete E.$byPredicate[c.getPrivateAnnotation(E[i],"predicate")];C+=1;i+=1;}c.setPrivateAnnotation(o,"spliced",E.splice(I+1,C));E.$count-=C;return C;};g.prototype.createGroupLevelCache=function(p){var C,F,s,G,l,i,m,q,t;i=p?p["@$ui5.node.level"]+1:1;F=g.filterAggregation(this.oAggregation,i);G=F.$groupBy;delete F.$groupBy;m=F.$missing;delete F.$missing;q=Object.assign({},this.mQueryOptions);s=g.filterOrderby(this.mQueryOptions.$orderby,F);if(s){q.$orderby=s;}else{delete q.$orderby;}if(p){q.$$filterBeforeAggregate=c.getPrivateAnnotation(p,"filter");}delete q.$count;q=_.buildApply(F,q);q.$count=true;C=a.create(this.oRequestor,this.sResourcePath,q,true);l=!F.groupLevels.length;t=!l&&Object.keys(F.aggregate).length>0;C.calculateKeyPredicate=g.calculateKeyPredicate.bind(null,p,G,m,l,t,this.aElements.$byPredicate);return C;};g.prototype.expand=function(G,v){var C,h,o=typeof v==="string"?this.fetchValue(b.$cached,v).getResult():v,s=c.getPrivateAnnotation(o,"spliced"),t=this;if(v!==o){c.updateAll(this.mChangeListeners,v,o,{"@$ui5.node.isExpanded":true});}if(s){c.deletePrivateAnnotation(o,"spliced");this.aElements.splice.apply(this.aElements,[this.aElements.indexOf(o)+1,0].concat(s));h=s.length;this.aElements.$count+=h;s.forEach(function(E){var p=c.getPrivateAnnotation(E,"predicate");if(p){t.aElements.$byPredicate[p]=E;if(c.getPrivateAnnotation(E,"expanding")){c.deletePrivateAnnotation(E,"expanding");h+=t.expand(b.$cached,E).getResult();}}});return S.resolve(h);}C=c.getPrivateAnnotation(o,"cache");if(!C){C=this.createGroupLevelCache(o);c.setPrivateAnnotation(o,"cache",C);}return C.read(0,this.iReadLength,0,G).then(function(R){var I=t.aElements.indexOf(o)+1,i;if(!o["@$ui5.node.isExpanded"]){c.deletePrivateAnnotation(o,"spliced");return 0;}if(!I){c.setPrivateAnnotation(o,"expanding",true);return 0;}h=R.value.$count;if(I===t.aElements.length){t.aElements.length+=h;}else{for(i=t.aElements.length-1;i>=I;i-=1){t.aElements[i+h]=t.aElements[i];delete t.aElements[i];}}t.addElements(R.value,I,C,0);t.aElements.$count+=h;for(i=I+R.value.length;i<I+h;i+=1){t.aElements[i]=_.createPlaceholder(o["@$ui5.node.level"]+1,i-I,C);}return h;},function(E){c.updateAll(t.mChangeListeners,v,o,{"@$ui5.node.isExpanded":false});throw E;});};g.prototype.fetchValue=function(G,p,D,l){var t=this;if(p==="$count"){if(!this.mQueryOptions.$count){L.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return S.resolve();}if(!this.oMeasureRangePromise){return this.oFirstLevel.fetchValue(G,p).then(function(){return t.oFirstLevel.iLeafCount;});}}if(this.oAggregation.groupLevels.length){this.registerChange(p,l);return this.drillDown(this.aElements,p,G);}return this.oFirstLevel.fetchValue(G,p,D,l);};g.prototype.getMeasureRangePromise=function(){return this.oMeasureRangePromise;};g.prototype.read=function(I,l,p,G,D){var i,n,C,o,h,H=this.oAggregation.groupLevels.length,R=[],t=this;function k(h,j){var m=o,s=c.getPrivateAnnotation(t.aElements[h],"index"),q=t.aElements[h];R.push(o.read(s,j-h,0,G.getUnlockedCopy(),D).then(function(u){var E;if(q!==t.aElements[h]&&u.value[0]!==t.aElements[h]){h=t.aElements.indexOf(q);if(h<0){h=t.aElements.indexOf(u.value[0]);if(h<0){E=new Error("Collapse before read has finished");E.canceled=true;throw E;}}}t.addElements(u.value,h,m,s);}));}if(H&&this.aElements.length){for(i=I,n=Math.min(I+l,this.aElements.length);i<n;i+=1){C=c.getPrivateAnnotation(this.aElements[i],"parent");if(C!==o){if(h){k(h,i);o=h=undefined;}if(C){h=i;o=C;}}}if(h){k(h,i);}G.unlock();return S.all(R).then(function(){var E=t.aElements.slice(I,I+l);E.$count=t.aElements.$count;return{value:E};});}return this.oFirstLevel.read(I,l,p,G,D).then(function(m){var j;if(H){t.aElements.length=t.aElements.$count=m.value.$count;t.addElements(m.value,I,t.oFirstLevel,I);for(j=0;j<t.aElements.$count;j+=1){if(!t.aElements[j]){t.aElements[j]=_.createPlaceholder(0,j,t.oFirstLevel);}}t.iReadLength=l+p;}else if(!t.oMeasureRangePromise){m.value.forEach(function(E){if(!("@$ui5.node.level"in E)){E["@$ui5.node.isExpanded"]=undefined;E["@$ui5.node.isTotal"]=false;E["@$ui5.node.level"]=1;}});}return m;});};g.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,_.buildApply(this.oAggregation,this.mQueryOptions),false,true);};g.calculateKeyPredicate=function(G,h,m,l,t,B,E,T,M){var p;function s(o){return JSON.stringify(c.publicClone(o));}h.forEach(function(n){if(!(n in E)){E[n]=G[n];}});m.forEach(function(n){E[n]=null;});p=c.getKeyPredicate(E,M,T,h,true);if(p in B){throw new Error("Multi-unit situation detected: "+s(E)+" vs. "+s(B[p]));}c.setPrivateAnnotation(E,"predicate",p);if(!l){c.setPrivateAnnotation(E,"filter",c.getKeyFilter(E,M,T,h));}if(E["@$ui5.node.level"]!==0){E["@$ui5.node.isExpanded"]=l?undefined:false;E["@$ui5.node.isTotal"]=t;E["@$ui5.node.level"]=G?G["@$ui5.node.level"]+1:1;}};g.create=function(R,s,A,q){return new g(R,s,A,q);};g.filterAggregation=function(A,l){var F,G,h;function i(t,K){t[K]=this[K];return t;}function j(M,K){return K.reduce(i.bind(M),{});}function k(M,p){return Object.keys(M).filter(p);}function m(s){return!A.aggregate[s].subtotals;}function n(s){return A.aggregate[s].subtotals;}function o(s){return A.groupLevels.indexOf(s)<0;}G=A.groupLevels.slice(l-1,l);F={aggregate:G.length?j(A.aggregate,k(A.aggregate,n)):A.aggregate,groupLevels:G,$groupBy:A.groupLevels.slice(0,l)};h=k(A.group,o).sort();if(G.length){F.group={};F.$missing=A.groupLevels.slice(l).concat(h).concat(Object.keys(A.aggregate).filter(m));}else{F.group=j(A.group,h);F.$groupBy=F.$groupBy.concat(h);F.$missing=[];}return F;};g.filterOrderby=function(o,A){if(o){return o.split(r).filter(function(O){var n;if(e.test(O)){n=O.split(f)[0];return n in A.aggregate||n in A.group||A.groupLevels.indexOf(n)>=0;}return true;}).join(",");}};g.getResourcePathWithQuery=function(A,q,s,E){q=Object.assign({},q,{$skip:s,$top:E-s});q=_.buildApply(A,q,null,this.bFollowUp);this.bFollowUp=true;return this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,q,false,true);};g.handleResponse=function(A,m,M,h,s,E,R,t){var i,j={},o;function k(l){j[l]=j[l]||{};return j[l];}if(m){o=R.value.shift();R["@odata.count"]=o.UI5__count;for(i in m){k(m[i].measure)[m[i].method]=o[i];}M(j);this.handleResponse=h;}else{o=R.value[0];if("UI5__count"in o){this.iLeafCount=parseInt(o.UI5__count);R["@odata.count"]=this.iLeafCount+1;if(s>0){R.value.shift();}}if(s===0){o["@$ui5.node.isExpanded"]=true;o["@$ui5.node.isTotal"]=true;o["@$ui5.node.level"]=0;Object.keys(o).forEach(function(K){if(K.startsWith("UI5grand__")){o[K.slice(10)]=o[K];}});Object.keys(A.aggregate).forEach(function(l){o[l]=o[l]||null;});Object.keys(A.group).forEach(function(G){o[G]=null;});}}h.call(this,s,E,R,t);};return g;},false);
