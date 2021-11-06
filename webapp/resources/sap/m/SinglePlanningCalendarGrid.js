/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.getCore().loadLibrary("sap.ui.unified");sap.ui.define(['./SinglePlanningCalendarUtilities','sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/core/Locale','sap/ui/core/InvisibleText','sap/ui/core/format/DateFormat','sap/ui/core/date/UniversalDate','sap/ui/core/dnd/DragInfo','sap/ui/core/dnd/DropInfo','sap/ui/core/dnd/DragDropInfo','sap/ui/unified/library','sap/ui/unified/CalendarAppointment','sap/ui/unified/calendar/DatesRow','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/DateTypeRange','sap/ui/events/KeyCodes','./SinglePlanningCalendarGridRenderer','sap/ui/Device','sap/ui/core/delegate/ItemNavigation',"sap/ui/thirdparty/jquery",'./PlanningCalendarLegend'],function(S,C,L,a,I,D,U,b,c,d,u,e,f,g,h,k,K,l,m,n,q,P){"use strict";var R=69,o=48,B=34,p=25,H=3600000/2,O=60*1000,r=7,F=0,s=24;var t=C.extend("sap.m.SinglePlanningCalendarGrid",{metadata:{library:"sap.m",properties:{startDate:{type:"object",group:"Data"},startHour:{type:"int",group:"Data",defaultValue:0},endHour:{type:"int",group:"Data",defaultValue:24},fullDay:{type:"boolean",group:"Data",defaultValue:true},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",dnd:{draggable:true}},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},_columnHeaders:{type:"sap.ui.unified.calendar.DatesRow",multiple:false,visibility:"hidden"},_intervalPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}},_blockersPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}}},dnd:true,associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.m.PlanningCalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}}}}});t.prototype.init=function(){var i=new Date(),j=new f(this.getId()+"-columnHeaders",{showDayNamesLine:false,showWeekNumbers:false,startDate:i}).addStyleClass("sapMSinglePCColumnHeader"),x=(60-i.getSeconds())*1000,T=this._getCoreLocaleData().getTimePattern("medium");j._setAriaRole("columnheader");this.setAggregation("_columnHeaders",j);this.setStartDate(i);this._setColumns(7);this._configureBlockersDragAndDrop();this._configureAppointmentsDragAndDrop();this._configureAppointmentsResize();this._configureAppointmentsCreate();this._oUnifiedRB=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");this._oFormatStartEndInfoAria=D.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY 'at' "+T});this._oFormatAriaFullDayCell=D.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY"});this._sLegendId=undefined;setTimeout(this._updateRowHeaderAndNowMarker.bind(this),x);};t.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}};t.prototype.onBeforeRendering=function(){var A=this._createAppointmentsMap(this.getAppointments()),i=this.getStartDate(),j=g.fromLocalJSDate(i),x=this._getColumns();this._oVisibleAppointments=this._calculateVisibleAppointments(A.appointments,this.getStartDate(),x);this._oAppointmentsToRender=this._calculateAppointmentsLevelsAndWidth(this._oVisibleAppointments);this._aVisibleBlockers=this._calculateVisibleBlockers(A.blockers,j,x);this._oBlockersToRender=this._calculateBlockersLevelsAndWidth(this._aVisibleBlockers);if(this._iOldColumns!==x||this._oOldStartDate!==i){this._createBlockersDndPlaceholders(i,x);this._createAppointmentsDndPlaceholders(i,x);}};t.prototype.onmousedown=function(E){var i=E.target.classList;this._isResizeHandleBottomMouseDownTarget=i.contains("sapMSinglePCAppResizeHandleBottom");this._isResizeHandleTopMouseDownTarget=i.contains("sapMSinglePCAppResizeHandleTop");};t.prototype._isResizingPerformed=function(){return this._isResizeHandleBottomMouseDownTarget||this._isResizeHandleTopMouseDownTarget;};t.prototype._configureBlockersDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_blockersPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsDragAndDrop()){E.preventDefault();return false;}var i=function(){var $=q(".sapMSinglePCOverlay");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");});q(document).one("dragend",function(){$.removeClass("sapMSinglePCOverlayDragging");});};i();}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),x=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),y=function(){var $=q(i.getIndicator()),z=A.$().outerHeight(),G=A.$().outerWidth(),J=j.$().closest(".sapMSinglePCBlockersColumns").get(0).getBoundingClientRect(),M=j.getDomRef().getBoundingClientRect(),N=(M.left+G)-(J.left+J.width);if(x){$.css("min-height",z);$.css("min-width",Math.min(G,G-N));}else{$.css("min-height",i.getDropControl().$().outerHeight());$.css("min-width",i.getDropControl().$().outerWidth());}};if(!i.getIndicator()){setTimeout(y,0);}else{y();}}.bind(this),drop:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),x=j.getDate().getJSDate(),y,z=E.getParameter("browserEvent"),G=(z.metaKey||z.ctrlKey),J=this.isAllDayAppointment(A.getStartDate(),A.getEndDate());y=new Date(x);if(J){y.setMilliseconds(A.getEndDate().getTime()-A.getStartDate().getTime());}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(J&&A.getStartDate().getTime()===x.getTime()){return;}this.fireAppointmentDrop({appointment:A,startDate:x,endDate:y,copy:G});}.bind(this)}));};t.prototype._configureAppointmentsDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsDragAndDrop()||this._isResizingPerformed()){E.preventDefault();return false;}var i=function(){var $=q(".sapMSinglePCOverlay");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");});q(document).one("dragend",function(){$.removeClass("sapMSinglePCOverlayDragging");});};i();}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),x=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),y=function(){var $=q(i.getIndicator()),z=A.$().outerHeight(),G=j.$().closest(".sapMSinglePCColumn").get(0).getBoundingClientRect(),J=i.getDropControl().getDomRef().getBoundingClientRect(),M=(J.top+z)-(G.top+G.height);if(x){$.css("min-height",2*i.getDropControl().$().outerHeight());}else{$.css("min-height",Math.min(z,z-M));}};if(!i.getIndicator()){setTimeout(y,0);}else{y();}}.bind(this),drop:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),x=j.getDate().getJSDate(),y,z=E.getParameter("browserEvent"),G=(z.metaKey||z.ctrlKey),J=this.isAllDayAppointment(A.getStartDate(),A.getEndDate());y=new Date(x);if(J){y.setHours(y.getHours()+1);}else{y.setMilliseconds(A.getEndDate().getTime()-A.getStartDate().getTime());}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(!J&&A.getStartDate().getTime()===x.getTime()){return;}this.fireAppointmentDrop({appointment:A,startDate:x,endDate:y,copy:G});}.bind(this)}));};t.prototype._configureAppointmentsResize=function(){var i=new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsResize()||!this._isResizingPerformed()){E.preventDefault();return;}var j=E.getParameter("dragSession"),$=this.$().find(".sapMSinglePCOverlay"),x=q(j.getIndicator()),y=j.getDragControl().$();if(this._isResizeHandleBottomMouseDownTarget){j.setComplexData("bottomHandle","true");}if(this._isResizeHandleTopMouseDownTarget){j.setComplexData("topHandle","true");}x.addClass("sapUiDnDIndicatorHide");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");},0);q(document).one("dragend",function(){var A=j.getComplexData("appointmentStartingBoundaries");$.removeClass("sapMSinglePCOverlayDragging");x.removeClass("sapUiDnDIndicatorHide");y.css({top:A.top,height:A.height,"z-index":"auto",opacity:1});});if(!m.browser.msie&&!m.browser.edge){E.getParameter("browserEvent").dataTransfer.setDragImage(v(),0,0);}}.bind(this),dragEnter:function(E){var j=E.getParameter("dragSession"),A=j.getDragControl().$().get(0),x=j.getDropControl().getDomRef(),y=j.getComplexData("appointmentStartingBoundaries"),z=function(){var $=q(j.getIndicator());$.addClass("sapUiDnDIndicatorHide");},T,G,J,V,M;if(!y){y={top:A.offsetTop,bottom:A.offsetTop+A.getBoundingClientRect().height,height:A.getBoundingClientRect().height};j.setComplexData("appointmentStartingBoundaries",y);}V=j.getData("bottomHandle")?y.top:y.bottom;T=Math.min(V,x.offsetTop);G=Math.max(V,x.offsetTop+x.getBoundingClientRect().height);J=G-T;M={top:T,height:J,"z-index":1,opacity:0.8};j.getDragControl().$().css(M);if(!j.getIndicator()){setTimeout(z,0);}else{z();}},drop:function(E){var j=E.getParameter("dragSession"),A=j.getDragControl(),x=this.indexOfAggregation("_intervalPlaceholders",j.getDropControl()),y=j.getComplexData("appointmentStartingBoundaries"),z;z=this._calcResizeNewHoursAppPos(A.getStartDate(),A.getEndDate(),x,j.getComplexData("bottomHandle"));this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");q(j.getIndicator()).removeClass("sapUiDnDIndicatorHide");A.$().css({top:y.top,height:y.height,"z-index":"auto",opacity:1});if(A.getEndDate().getTime()===z.endDate.getTime()&&A.getStartDate().getTime()===z.startDate.getTime()){return;}this.fireAppointmentResize({appointment:A,startDate:z.startDate,endDate:z.endDate});}.bind(this)});this.addDragDropConfig(i);};t.prototype._configureAppointmentsCreate=function(){this.addDragDropConfig(new d({targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsCreate()){E.preventDefault();return;}var i=E.getParameter("browserEvent");var $=this.$().find(".sapMSinglePCOverlay");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");});q(document).one("dragend",function(){$.removeClass("sapMSinglePCOverlayDragging");q(".sapUiAppCreate").remove();q(".sapUiDnDDragging").removeClass("sapUiDnDDragging");});if(!m.browser.msie&&!m.browser.edge){i.dataTransfer.setDragImage(v(),0,0);}var G=E.getParameter("target"),j=G.getAggregation("_intervalPlaceholders"),x=j[0].getDomRef().getBoundingClientRect(),y=x.height,z=Math.floor((x.top-G.getDomRef().getBoundingClientRect().top)/y),A=E.getParameter("dragSession"),J=Math.floor(i.offsetY/y)-z,M,N;if(this._iColumns===1){M=J;}else{var Q=64,T=2,V=Math.floor(j[0].getDomRef().getBoundingClientRect().width)-T,W=Math.floor(Math.floor((i.offsetX-Q))/V),X=j.length/this._iColumns;M=J+((W)*X);}if(M<0){M=0;}N=j[M].getDomRef().getBoundingClientRect();A.setComplexData("startingRectsDropArea",{top:Math.ceil(J*y),left:N.left});A.setComplexData("startingDropDate",j[M].getDate());}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),j=i.getDropControl(),x=j.getDomRef(),y=x.offsetHeight,z=x.offsetTop,A=z,G=x.getBoundingClientRect().left,J=G,M=j.$().parents(".sapMSinglePCColumn").get(0),$=q(".sapUiAppCreate");if(!$.get(0)){$=q("<div></div>").addClass("sapUiCalendarApp sapUiCalendarAppType01 sapUiAppCreate");$.appendTo(M);}q(".sapUiDnDDragging").removeClass("sapUiDnDDragging");if(!i.getComplexData("startingRectsDropArea")){i.setComplexData("startingRectsDropArea",{top:z,left:G});i.setComplexData("startingDropDate",j.getDate());}else{A=i.getComplexData("startingRectsDropArea").top;J=i.getComplexData("startingRectsDropArea").left;}if(G!==J){E.preventDefault();return false;}j.$().closest(".sapMSinglePCColumn").find(".sapMSinglePCAppointments").addClass("sapUiDnDDragging");$.css({top:Math.min(A,z)+2,height:Math.abs(A-z)+y-4,left:3,right:3,"z-index":2});i.setIndicatorConfig({display:"none"});},drop:function(E){var i=E.getParameter("dragSession"),j=i.getDropControl(),T=30*60*1000,x=i.getComplexData("startingDropDate").getTime(),y=j.getDate().getJSDate().getTime(),z=Math.min(x,y),A=Math.max(x,y)+T;this.fireAppointmentCreate({startDate:new Date(z),endDate:new Date(A)});q(".sapUiAppCreate").remove();q(".sapUiDnDDragging").removeClass("sapUiDnDDragging");}.bind(this)}));};t.prototype._calcResizeNewHoursAppPos=function(A,i,j,x){var M=30*60*1000,y=this.getAggregation("_intervalPlaceholders")[j].getDate().getTime(),z=y+M,V=x?A.getTime():i.getTime(),E=Math.min(V,y),G=Math.max(V,z);return{startDate:new Date(E),endDate:new Date(G)};};t.prototype._adjustAppointmentsHeightforCompact=function(i,j,x){var A,$,y,z,E,G,J,M,N=this._getRowHeight(),Q=this;if(this._oAppointmentsToRender[i]){this._oAppointmentsToRender[i].oAppointmentsList.getIterator().forEach(function(T){A=T.getData();$=q("div[data-sap-day='"+i+"'].sapMSinglePCColumn #"+A.getId());y=A.getStartDate();z=A.getEndDate();J=j.getTime()>y.getTime();M=x.getTime()<z.getTime();E=J?0:Q._calculateTopPosition(y);G=M?0:Q._calculateBottomPosition(z);$.css("top",E);$.css("bottom",G);$.find(".sapUiCalendarApp").css("min-height",N/2-3);});}};t.prototype._adjustBlockersHeightforCompact=function(){var M=this._getBlockersToRender().iMaxlevel,i=(M+1)*this._getBlockerRowHeight(),j=this._getColumns()===1?i+r:i,x=this._getBlockerRowHeight();if(M>0){j=j+3;}this.$().find(".sapMSinglePCBlockersColumns").css("height",j);this._oBlockersToRender.oBlockersList.getIterator().forEach(function(y){y.getData().$().css("top",x*y.level+1);});};t.prototype._adjustBlockersHeightforCozy=function(){var M=this._getBlockersToRender()&&this._getBlockersToRender().iMaxlevel,i;if(this._getColumns()===1){i=(M+1)*this._getBlockerRowHeight();this.$().find(".sapMSinglePCBlockersColumns").css("height",i+r);}};t.prototype.onAfterRendering=function(){var j=this._getColumns(),x=this.getStartDate(),y=this._getRowHeight();if(y===o){for(var i=0;i<j;i++){var z=new g(x.getFullYear(),x.getMonth(),x.getDate()+i),A=this._getDateFormatter().format(z.toLocalJSDate()),E=new U(z.getYear(),z.getMonth(),z.getDate(),this._getVisibleStartHour()),G=new U(z.getYear(),z.getMonth(),z.getDate(),this._getVisibleEndHour(),59,59);this._adjustAppointmentsHeightforCompact(A,E,G);}this._adjustBlockersHeightforCompact();}else{this._adjustBlockersHeightforCozy();}this._updateRowHeaderAndNowMarker();_.call(this);};t.prototype._appFocusHandler=function(E,i){var T=sap.ui.getCore().byId(E.target.id);if(T&&T.isA("sap.ui.unified.CalendarAppointment")){this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)});this._focusCellWithKeyboard(T,i);E.preventDefault();}};t.prototype._cellFocusHandler=function(E,i){var G=E.target,j=this._getDateFormatter(),x;if(G.classList.contains("sapMSinglePCRow")||G.classList.contains("sapMSinglePCBlockersColumn")){x=j.parse(G.getAttribute("data-sap-start-date"));if(this._isBorderReached(x,i)){this.fireEvent("borderReached",{startDate:x,next:i===K.ARROW_RIGHT,fullDay:G.classList.contains("sapMSinglePCBlockersColumn")});}}};t.prototype.onsapup=function(E){this._appFocusHandler(E,K.ARROW_UP);};t.prototype.onsapdown=function(E){this._appFocusHandler(E,K.ARROW_DOWN);};t.prototype.onsapright=function(E){this._appFocusHandler(E,K.ARROW_RIGHT);this._cellFocusHandler(E,K.ARROW_RIGHT);};t.prototype.onsapleft=function(E){this._appFocusHandler(E,K.ARROW_LEFT);this._cellFocusHandler(E,K.ARROW_LEFT);};t.prototype.setStartDate=function(i){this._oOldStartDate=this.getStartDate();this.getAggregation("_columnHeaders").setStartDate(i);return this.setProperty("startDate",i);};t.prototype.applyFocusInfo=function(x){var V=this._getVisibleBlockers(),y=this._getVisibleAppointments(),z=Object.keys(y),A,i,j;for(i=0;i<V.length;++i){if(V[i].getId()===x.id){V[i].focus();return this;}}for(i=0;i<z.length;++i){A=y[z[i]];for(j=0;j<A.length;++j){if(A[j].getId()===x.id){A[j].focus();return this;}}}return this;};t.prototype.getSelectedAppointments=function(){return this.getAppointments().filter(function(A){return A.getSelected();});};t.prototype._toggleAppointmentSelection=function(A,j){var x=[],y,z,i;if(j){y=this.getAppointments();for(i=0,z=y.length;i<z;i++){if((!A||y[i].getId()!==A.getId())&&y[i].getSelected()){y[i].setProperty("selected",false);x.push(y[i]);}}}if(A){A.setProperty("selected",!A.getSelected());x.push(A);}return x;};t.prototype._isBorderReached=function(i,j){var G=g.fromLocalJSDate(this.getStartDate()),x=new g(G.getYear(),G.getMonth(),G.getDate()+this._getColumns()-1),T=g.fromLocalJSDate(i),y=j===K.ARROW_LEFT&&T.isSame(G),z=j===K.ARROW_RIGHT&&T.isSame(x);return y||z;};t.prototype._focusCellWithKeyboard=function(A,i){var j=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),x=this._getDateFormatter(),y=new Date(A.getStartDate().getFullYear(),A.getStartDate().getMonth(),A.getStartDate().getDate(),A.getStartDate().getHours()),G=new Date(this.getStartDate().getFullYear(),this.getStartDate().getMonth(),this.getStartDate().getDate(),this.getStartDate().getHours());if(y<G){y=G;}if(this._isBorderReached(y,i)){this.fireEvent("borderReached",{startDate:y,next:i===K.ARROW_RIGHT,fullDay:j});return;}switch(i){case K.ARROW_UP:if(!j){y.setHours(y.getHours()-1);}break;case K.ARROW_DOWN:if(!j){y.setHours(y.getHours()+1);}break;case K.ARROW_LEFT:y.setDate(y.getDate()-1);break;case K.ARROW_RIGHT:y.setDate(y.getDate()+1);break;default:}if(j&&i!==K.ARROW_DOWN){q("[data-sap-start-date='"+x.format(y)+"'].sapMSinglePCBlockersColumn").trigger("focus");}else{q("[data-sap-start-date='"+x.format(y)+"'].sapMSinglePCRow").trigger("focus");}};t.prototype.ontap=function(E){this._fireSelectionEvent(E);};t.prototype.onkeydown=function(E){if(E.which===K.SPACE||E.which===K.ENTER){this._fireSelectionEvent(E);E.preventDefault();}};t.prototype._fireSelectionEvent=function(E){var i=E.srcControl,G=E.target;if(E.target.classList.contains("sapMSinglePCRow")||E.target.classList.contains("sapMSinglePCBlockersColumn")){this.fireEvent("cellPress",{startDate:this._getDateFormatter().parse(G.getAttribute("data-sap-start-date")),endDate:this._getDateFormatter().parse(G.getAttribute("data-sap-end-date"))});this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)});}else if(i&&i.isA("sap.ui.unified.CalendarAppointment")){this.fireAppointmentSelect({appointment:i,appointments:this._toggleAppointmentSelection(i,!(E.ctrlKey||E.metaKey))});}};t.prototype._getVisibleStartHour=function(){return(this.getFullDay()||!this.getStartHour())?F:this.getStartHour();};t.prototype._getVisibleEndHour=function(){return((this.getFullDay()||!this.getEndHour())?s:this.getEndHour())-1;};t.prototype._isVisibleHour=function(i){var j=this.getStartHour(),E=this.getEndHour();if(!this.getStartHour()){j=F;}if(!this.getEndHour()){E=s;}return j<=i&&i<E;};t.prototype._shouldHideRowHeader=function(i){var j=new Date().getHours(),x=h._areCurrentMinutesLessThan(15)&&j===i,y=h._areCurrentMinutesMoreThan(45)&&j===i-1;return x||y;};t.prototype._parseDateStringAndHours=function(i,j){var x=this._getDateFormatter().parse(i);if(j){x.setHours(j);}return x;};t.prototype._getDateFormatter=function(){if(!(this._oDateFormat instanceof D)){this._oDateFormat=D.getDateTimeInstance({pattern:"YYYYMMdd-HHmm"});}return this._oDateFormat;};t.prototype._formatTimeAsString=function(i){var j=this._getHoursPattern()+":mm",x=D.getDateTimeInstance({pattern:j},new a(this._getCoreLocaleId()));return x.format(i);};t.prototype._addAMPM=function(i){var A=this._getAMPMFormat();return" "+A.format(i);};t.prototype._calculateTopPosition=function(i){var j=i.getHours()-this._getVisibleStartHour(),M=i.getMinutes(),x=this._getRowHeight();return Math.floor((x*j)+(x/60)*M);};t.prototype._calculateBottomPosition=function(i){var j=this._getVisibleEndHour()+1-i.getHours(),M=i.getMinutes(),x=this._getRowHeight();return Math.floor((x*j)-(x/60)*M);};t.prototype._updateRowHeaderAndNowMarker=function(){var i=new Date();this._updateNowMarker(i);this._updateRowHeaders(i);setTimeout(this._updateRowHeaderAndNowMarker.bind(this),O);};t.prototype._updateNowMarker=function(i){var $=this.$("nowMarker"),j=this.$("nowMarkerText"),x=this.$("nowMarkerAMPM"),y=!this._isVisibleHour(i.getHours());$.toggleClass("sapMSinglePCNowMarkerHidden",y);$.css("top",this._calculateTopPosition(i)+"px");j.text(this._formatTimeAsString(i));x.text(this._addAMPM(i));j.append(x);};t.prototype._updateRowHeaders=function(i){var $=this.$(),j=i.getHours(),N=j+1;$.find(".sapMSinglePCRowHeader").removeClass("sapMSinglePCRowHeaderHidden");if(this._shouldHideRowHeader(j)){$.find(".sapMSinglePCRowHeader"+j).addClass("sapMSinglePCRowHeaderHidden");}else if(this._shouldHideRowHeader(N)){$.find(".sapMSinglePCRowHeader"+N).addClass("sapMSinglePCRowHeaderHidden");}};t.prototype._createAppointmentsMap=function(A){var i=this;return A.reduce(function(M,j){var x=j.getStartDate(),y=j.getEndDate(),z,E,G;if(!x||!y){return M;}if(!i.isAllDayAppointment(x,y)){z=g.fromLocalJSDate(x);E=g.fromLocalJSDate(y);while(z.isSameOrBefore(E)){G=i._getDateFormatter().format(z.toLocalJSDate());if(!M.appointments[G]){M.appointments[G]=[];}M.appointments[G].push(j);z.setDate(z.getDate()+1);}}else{M.blockers.push(j);}return M;},{appointments:{},blockers:[]});};t.prototype._calculateVisibleAppointments=function(A,j,x){var V={},y,z,E;for(var i=0;i<x;i++){y=new g(j.getFullYear(),j.getMonth(),j.getDate()+i);z=this._getDateFormatter().format(y.toLocalJSDate());E=this._isAppointmentFitInVisibleHours(y);if(A[z]){V[z]=A[z].filter(E,this).sort(this._sortAppointmentsByStartHourCallBack);}}return V;};t.prototype._isAppointmentFitInVisibleHours=function(i){return function(A){var j=A.getStartDate().getTime(),x=A.getEndDate().getTime(),y=(new U(i.getYear(),i.getMonth(),i.getDate(),this._getVisibleStartHour())).getTime(),z=(new U(i.getYear(),i.getMonth(),i.getDate(),this._getVisibleEndHour(),59,59)).getTime();var E=j<y&&x>z,G=j>=y&&j<z,J=x>y&&x<=z;return E||G||J;};};t.prototype._calculateAppointmentsLevelsAndWidth=function(V){var i=this;return Object.keys(V).reduce(function(A,j){var M=0,x=new S.list(),y=V[j];y.forEach(function(z){var E=new S.node(z),G=z.getStartDate().getTime();if(x.getSize()===0){x.add(E);return;}x.getIterator().forEach(function(J){var N=true,Q=J.getData(),T=Q.getStartDate().getTime(),W=Q.getEndDate().getTime(),X=W-T;if(X<H){W=W+(H-X);}if(G>=T&&G<W){E.level++;M=Math.max(M,E.level);}if(J.next&&J.next.level===E.level){N=false;}if(G>=W&&N){this.interrupt();}});x.insertAfterLevel(E.level,E);});A[j]={oAppointmentsList:i._calculateAppointmentsWidth(x),iMaxLevel:M};return A;},{});};t.prototype._calculateAppointmentsWidth=function(A){A.getIterator().forEach(function(i){var j=i.getData(),x=i.level,y=i.level,z=j.getStartDate().getTime(),E=j.getEndDate().getTime(),G=E-z;if(G<H){E=E+(H-G);}new S.iterator(A).forEach(function(J){var M=J.getData(),N=J.level,Q=M.getStartDate().getTime(),T=M.getEndDate().getTime(),V=T-Q;if(V<H){T=T+(H-V);}if(y>=N){return;}if(z>=Q&&z<T||E>Q&&E<T||z<=Q&&E>=T){i.width=N-y;this.interrupt();return;}if(x<N){x=N;i.width++;}});});return A;};t.prototype._calculateVisibleBlockers=function(i,j,x){var y=new g(j.getYear(),j.getMonth(),j.getDate()+x-1),z=this._isBlockerVisible(j,y);return i.filter(z).sort(this._sortAppointmentsByStartHourCallBack);};t.prototype._isBlockerVisible=function(V,i){return function(A){var j=g.fromLocalJSDate(A.getStartDate()),x=g.fromLocalJSDate(A.getEndDate());var y=j.isBefore(V)&&x.isAfter(i),z=h._isBetween(j,V,i,true),E=h._isBetween(x,V,i,true);return y||z||E;};};t.prototype._calculateBlockersLevelsAndWidth=function(V){var M=0,i=new S.list();V.forEach(function(j){var x=new S.node(j),y=g.fromLocalJSDate(j.getStartDate()),z=g.fromLocalJSDate(j.getEndDate());x.width=h._daysBetween(z,y);if(i.getSize()===0){i.add(x);return;}i.getIterator().forEach(function(A){var E=true,G=A.getData(),J=g.fromLocalJSDate(G.getStartDate()),N=g.fromLocalJSDate(G.getEndDate());if(y.isSameOrAfter(J)&&y.isSameOrBefore(N)){x.level++;M=Math.max(M,x.level);}if(A.next&&A.next.level===x.level){E=false;}if(y.isSameOrAfter(N)&&E){this.interrupt();}});i.insertAfterLevel(x.level,x);},this);return{oBlockersList:i,iMaxlevel:M};};t.prototype._sortAppointmentsByStartHourCallBack=function(A,i){return A.getStartDate().getTime()-i.getStartDate().getTime()||i.getEndDate().getTime()-A.getEndDate().getTime();};t.prototype._getVisibleAppointments=function(){return this._oVisibleAppointments;};t.prototype._getAppointmentsToRender=function(){return this._oAppointmentsToRender;};t.prototype._getVisibleBlockers=function(){return this._aVisibleBlockers;};t.prototype._getBlockersToRender=function(){return this._oBlockersToRender;};t.prototype._setColumns=function(i){this._iOldColumns=this._iColumns;this._iColumns=i;this.getAggregation("_columnHeaders").setDays(i);this.invalidate();return this;};t.prototype._getColumns=function(){return this._iColumns;};t.prototype._getRowHeight=function(){return this._isCompact()?o:R;};t.prototype._getBlockerRowHeight=function(){return this._isCompact()?p:B;};t.prototype._isCompact=function(){var i=this.getDomRef();while(i&&i.classList){if(i.classList.contains("sapUiSizeCompact")){return true;}i=i.parentNode;}return false;};t.prototype._getCoreLocaleId=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};t.prototype._getCoreLocaleData=function(){var i,j;if(!this._oLocaleData){i=this._getCoreLocaleId();j=new a(i);this._oLocaleData=L.getInstance(j);}return this._oLocaleData;};t.prototype._hasAMPM=function(){var i=this._getCoreLocaleData();return i.getTimePattern("short").search("a")>=0;};t.prototype._getHoursFormat=function(){var i=this._getCoreLocaleId();if(!this._oHoursFormat||this._oHoursFormat.oLocale.toString()!==i){var j=new a(i),x=this._getHoursPattern();this._oHoursFormat=D.getTimeInstance({pattern:x},j);}return this._oHoursFormat;};t.prototype._getHoursPattern=function(){return this._hasAMPM()?"h":"H";};t.prototype._getAMPMFormat=function(){var i=this._getCoreLocaleId(),j=new a(i);if(!this._oAMPMFormat||this._oAMPMFormat.oLocale.toString()!==i){this._oAMPMFormat=D.getTimeInstance({pattern:"a"},j);}return this._oAMPMFormat;};t.prototype._getColumnHeaders=function(){return this.getAggregation("_columnHeaders");};t.prototype._getAppointmentAnnouncementInfo=function(A){var i=this._oUnifiedRB.getText("CALENDAR_START_TIME"),E=this._oUnifiedRB.getText("CALENDAR_END_TIME"),j=this._oFormatStartEndInfoAria.format(A.getStartDate()),x=this._oFormatStartEndInfoAria.format(A.getEndDate()),y=i+": "+j+"; "+E+": "+x;return y+"; "+P.findLegendItemForItem(sap.ui.getCore().byId(this._sLegendId),A);};t.prototype.enhanceAccessibilityState=function(i,A){if(i.getId()===this._getColumnHeaders().getId()){A.labelledby=I.getStaticId("sap.m","PLANNINGCALENDAR_DAYS");}};t.prototype._getCellStartEndInfo=function(i,E){var j=this._oUnifiedRB.getText("CALENDAR_START_TIME"),x=this._oUnifiedRB.getText("CALENDAR_END_TIME"),y=!E;if(y){return j+": "+this._oFormatAriaFullDayCell.format(i)+"; ";}return j+": "+this._oFormatStartEndInfoAria.format(i)+"; "+x+": "+this._oFormatStartEndInfoAria.format(E);};t.prototype.isAllDayAppointment=function(A,i){return h._isMidnight(A)&&h._isMidnight(i);};t.prototype._createBlockersDndPlaceholders=function(j,x){this.destroyAggregation("_blockersPlaceholders");for(var i=0;i<x;i++){var y=new U(j.getFullYear(),j.getMonth(),j.getDate()+i);var z=new w({date:y});this.addAggregation("_blockersPlaceholders",z,true);}};t.prototype._createAppointmentsDndPlaceholders=function(x,y){var z=this._getVisibleStartHour(),E=this._getVisibleEndHour();this._dndPlaceholdersMap={};this.destroyAggregation("_intervalPlaceholders");for(var i=0;i<y;i++){var A=new g(x.getFullYear(),x.getMonth(),x.getDate()+i);if(!this._dndPlaceholdersMap[A]){this._dndPlaceholdersMap[A]=[];}for(var j=z;j<=E;j++){var G=this._dndPlaceholdersMap[A],Y=A.getYear(),M=A.getMonth(),J=A.getDate();G.push(this._createAppointmentsDndPlaceHolder(new U(Y,M,J,j)));G.push(this._createAppointmentsDndPlaceHolder(new U(Y,M,J,j,30)));}}};t.prototype._createAppointmentsDndPlaceHolder=function(i){var j=new w({date:i});this.addAggregation("_intervalPlaceholders",j,true);return j;};t.prototype._getSpecialDates=function(){var j=this.getSpecialDates();for(var i=0;i<j.length;i++){var N=j[i].getSecondaryType()===u.CalendarDayType.NonWorking&&j[i].getType()!==u.CalendarDayType.NonWorking;if(N){var x=new k();x.setType(u.CalendarDayType.NonWorking);x.setStartDate(j[i].getStartDate());if(j[i].getEndDate()){x.setEndDate(j[i].getEndDate());}j.push(x);}}return j;};function v(){var $=q("<span></span>").addClass("sapUiCalAppResizeGhost");$.appendTo(document.body);setTimeout(function(){$.remove();},0);return $.get(0);}var w=C.extend("sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",{metadata:{library:"sap.m",properties:{date:{type:"object",group:"Data"}}},renderer:{apiVersion:2,render:function(i,j){i.openStart("div",j).class("sapMSinglePCPlaceholder").openEnd().close("div");}}});function _(){var i=this.getDomRef(),j=this.$().find(".sapMSinglePCBlockersColumn").toArray();this._aGridCells=Array.prototype.concat(j);for(var x=0;x<=this._getVisibleEndHour();++x){j=this.$().find("div[data-sap-hour='"+x+"']").toArray();this._aGridCells=this._aGridCells.concat(j);}if(!this._oItemNavigation){this._oItemNavigation=new n();this.addDelegate(this._oItemNavigation);}this._oItemNavigation.setRootDomRef(i);this._oItemNavigation.setItemDomRefs(this._aGridCells);this._oItemNavigation.setCycling(false);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"],saphome:["alt","meta"],sapend:["meta"]});this._oItemNavigation.setTableMode(true,true).setColumns(this._getColumns());this._oItemNavigation.setPageSize(this._aGridCells.length);}return t;});
