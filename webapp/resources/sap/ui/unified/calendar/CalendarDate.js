/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object','sap/ui/core/date/UniversalDate',"sap/ui/thirdparty/jquery"],function(B,U,q){"use strict";var C=B.extend("sap.ui.unified.calendar.CalendarDate",{constructor:function(){var A=arguments,j,n,s;switch(A.length){case 0:n=new Date();return this.constructor(n.getFullYear(),n.getMonth(),n.getDate());case 1:case 2:if(!(A[0]instanceof C)){throw"Invalid arguments: the first argument must be of type sap.ui.unified.calendar.CalendarDate.";}s=A[1]?A[1]:A[0]._oUDate.sCalendarType;j=new Date(A[0].valueOf());j.setFullYear(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());j.setHours(j.getUTCHours(),j.getUTCMinutes(),j.getUTCSeconds(),j.getUTCMilliseconds());this._oUDate=c(j,s);break;case 3:case 4:d(A[0],"Invalid year: "+A[0]);d(A[1],"Invalid month: "+A[1]);d(A[2],"Invalid date: "+A[2]);j=new Date(0,0,1);j.setFullYear(A[0],A[1],A[2]);if(A[3]){s=A[3];}this._oUDate=c(j,s);break;default:throw"Invalid arguments. Accepted arguments are: 1) oCalendarDate, (optional)calendarType"+"or 2) year, month, date, (optional) calendarType"+A;}}});C.prototype.getYear=function(){return this._oUDate.getUTCFullYear();};C.prototype.setYear=function(y){d(y,"Invalid year: "+y);this._oUDate.setUTCFullYear(y);return this;};C.prototype.getMonth=function(){return this._oUDate.getUTCMonth();};C.prototype.setMonth=function(m,e){d(m,"Invalid month: "+m);if(e||e===0){d(e,"Invalid date: "+e);this._oUDate.setUTCMonth(m,e);}else{this._oUDate.setUTCMonth(m);}return this;};C.prototype.getDate=function(){return this._oUDate.getUTCDate();};C.prototype.setDate=function(e){d(e,"Invalid date: "+e);this._oUDate.setUTCDate(e);return this;};C.prototype.getDay=function(){return this._oUDate.getUTCDay();};C.prototype.getCalendarType=function(){return this._oUDate.sCalendarType;};C.prototype.getEra=function(){return this._oUDate.getUTCEra();};C.prototype.isBefore=function(o){b(o);return this.valueOf()<o.valueOf();};C.prototype.isAfter=function(o){b(o);return this.valueOf()>o.valueOf();};C.prototype.isSameOrBefore=function(o){b(o);return this.valueOf()<=o.valueOf();};C.prototype.isSameOrAfter=function(o){b(o);return this.valueOf()>=o.valueOf();};C.prototype.isSame=function(o){b(o);return this.valueOf()===o.valueOf();};C.prototype.toLocalJSDate=function(){var l=new Date(this._oUDate.getTime());l.setFullYear(l.getUTCFullYear(),l.getUTCMonth(),l.getUTCDate());l.setHours(0,0,0,0);return l;};C.prototype.toUTCJSDate=function(){var u=new Date(this._oUDate.getTime());u.setUTCHours(0,0,0,0);return u;};C.prototype.toString=function(){return this._oUDate.sCalendarType+": "+this.getYear()+"/"+(this.getMonth()+1)+"/"+this.getDate();};C.prototype.valueOf=function(){return this._oUDate.getTime();};C.fromLocalJSDate=function(j,s){if(!j||Object.prototype.toString.call(j)!=="[object Date]"||isNaN(j)){throw new Error("Date parameter must be a JavaScript Date object: ["+j+"].");}return new C(j.getFullYear(),j.getMonth(),j.getDate(),s);};function c(D,s){if(s){return U.getInstance(a(D),s);}else{return new U(a(D).getTime());}}function a(D){var u=new Date(Date.UTC(0,0,1));u.setUTCFullYear(D.getFullYear(),D.getMonth(),D.getDate());return u;}function b(o){if(!(o instanceof C)){throw"Invalid calendar date: ["+o+"]. Expected: sap.ui.unified.calendar.CalendarDate";}}function d(v,m){if(v==undefined||v===Infinity||isNaN(v)){throw m;}}return C;});