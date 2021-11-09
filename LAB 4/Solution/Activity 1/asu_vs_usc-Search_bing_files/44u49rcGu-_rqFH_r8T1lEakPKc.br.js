var EntityPreviewConfig,__extends,EntityPanePreview;(function(n){var u="a",i,r,t;n.DivTag="div";n.ClickEvent="click";n.MouseUpEvent="mouseup";n.SidParamName="sid";n.AnchorHookName="h";n.HoverHookName="hover-data";n.HideClassName="b_hidden";n.LogEventType="EPWindow";n.LogFeatureName="EntityPreview";n.PreviewWindowLinkTrait="&epw=1";n.EventShow="Show";n.EventHide="Hide";n.PixelSuffix="px";n.EpvCaptionClassName="epv_caption";i=function(){function i(n,t){this._container=n;this._popOver=t}return i.prototype.initLinks=function(){var e,f,r,i,o;if(this._container!=null)for(e=this._container.getElementsByTagName(u),f=0;f<e.length;f++)if((r=e[f],i=t.decodeUrl(r.href),i)&&(o=r.getAttribute(n.HoverHookName),r.className.indexOf("b_moreLink")===-1&&i!=null&&i.search(/\Wsid:"/i)!==-1&&(i.search("&eeptype=Entity")!==-1||i.search(/&eeptype=\w+?/i)===-1)||o)){if(o==="-")continue;this.hookHandlers(r)}},i.prototype.showPreview=function(n){n!=null&&this._popOver.show(n)},i.prototype.hookHandlers=function(){},i}();n.EntityPreviewBaseController=i;r=function(){function i(){this._cache={}}return i.prototype.GetContent=function(n,i,r,u){var o=this,f,e;this._popOver=r;f=t.getSidFromUrl(n);!u&&f&&f in this._cache?(this.renderContent(this._cache[f],f),this._cache[f]==null&&t.Log("CacheFail",f)):(e=this.buildLink(n,f,i),f=u?null:f,sj_ajax(e,{callback:function(n,t){return o.requestCallback(f,n,t)}}))},i.prototype.requestCallback=function(n,i,r){n?i?(r.request.status===200?this._cache[n]=r:(this._cache[n]=null,t.Log("Fail",n)),this.renderContent(r,n)):(this._cache[n]=null,this.renderContent(this._cache[n],n),t.Log("Fail",n)):i&&r.request.status===200&&this.renderContent(r,null)},i.prototype.renderContent=function(i,r){var u=sj_ce(n.DivTag,null);i&&(i.appendTo(u),u.innerHTML==""&&t.Log("NoContent",r));this._popOver.displayContent(u,r)},i.prototype.buildLink=function(n,t,i){var r,f,e,o,u;return t?(f=this.parseQuery(n),r="/entitypreview?q="+(f?f:"query")+("&entityid="+t)+("&psid="+i)):r=n,EntityPreviewConfig&&EntityPreviewConfig.featureList&&(r+="&features="+EntityPreviewConfig.featureList),EntityPreviewConfig.testHooks||(e=this._popOver.hValue(),o="",e&&(u=/ID=(\w+?),(\d+)(\.\d+)?/i.exec(e),u&&(o=u[1]+"."+u[2])),r+="&IG="+_G.IG+"&iid="+o),r},i.prototype.parseQuery=function(n){if(!n)return null;var t=/search\?q=(.+?)[&$]/.exec(n);return t?t[1]:null},i}();n.EntityPreviewContentLoader=r;t=function(){function t(){}return t.decodeUrl=function(n){try{return decodeURIComponent(n)}catch(t){return null}},t.getSidFromUrl=function(n){var r=t.decodeUrl(n),i;return r?(i=/\Wsid:"(.+?)"/i.exec(t.decodeUrl(n)),i?i[1]:null):null},t.getEntityNameFromUrl=function(n){var r=t.decodeUrl(n),i;return r?(i=/[&?]q=(.+?)&/i.exec(t.decodeUrl(n)),i?i[1].replace(/\+/g," "):null):null},t.Log=function(t,i){Log.Log(n.LogEventType,t,n.LogFeatureName,!1,n.SidParamName,i)},t.LogCiHover=function(n,t,i){var u,f,r,e,o;if(n){u=null;f=null;t&&(r=t.split(","),r&&r.length===2&&(f=r[1],u=r[0].toUpperCase().indexOf("SERP")!==-1?"SERP":null));e='{"T":"CI.Hover","AppNS":"'+u+'","K":"'+f+'","Name":"EntityPreview","HType":"'+n+'","TS":'+sb_gt()+',"FID":"'+i+'"}';o=new Image;try{o.src="/fd/ls/ls.gif?IG="+_G.IG+"&Type=Event.ClientInst&DATA="+e+"&log=UserEvent"}catch(s){}}},t}();n.Util=t})(EntityPanePreview||(EntityPanePreview={}));__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}(),function(n){function p(n){if(!n)return null;return n.nextElementSibling&&n.nextElementSibling.className.indexOf(o)>=0?n.nextElementSibling.getAttribute("psid"):""}function w(t,i,r,u,f){i===void 0&&(i=undefined);r===void 0&&(r=!0);u===void 0&&(u=!1);f===void 0&&(f=null);var e=[];sj_evt.bind("EPReady",function(){var o=_d.getElementsByClassName(t),c,l,h,s,v;if(o!=null&&o.length!=0)for(c=new n.EntityPreviewContentLoader,s=0;s<o.length;s++)v=p(o[s]),l=new y("tpPreview",v,c,t,u,f),h=new a(o[s],l,i,r),h.initLinks(),e.push(h)},!0);sj_evt.bind("onCarouselFetch",function(){var n,t,i;if(e&&e.length>0)for(n=0,t=e;n<t.length;n++)i=t[n],i.initLinks()},!0)}var i="mouseover",r="mouseout",f="scroll",e="epv_content",o="epv_meta",s="epvRup",h="epvLup",c="epvRdown",l="epvLdown",t="hidden",u="_blank",a=function(t){function u(n,i,r,u){var f,e;return r===void 0&&(r=undefined),u===void 0&&(u=!0),f=t.call(this,n,i)||this,f.debounceTime=1e3,f.mouseOverHandler=function(n){sj_pd(n);sj_sp(n);f._popOver.setTargetElement(n.currentTarget);u&&f.showPreview(n.currentTarget);r&&(sb_ct(e),e=sb_st(r,f.debounceTime))},f.mouseOutHandler=function(n){n.currentTarget&&(sj_pd(n),sj_sp(n),f._popOver.setTargetElement(null),u&&f._popOver.hide(),r&&sb_ct(e))},f.mouseClickHandler=function(n){n.currentTarget&&(f._popOver.setTargetElement(null),u&&f._popOver.hide(),r&&sb_ct(e))},f}return __extends(u,t),u.prototype.hookHandlers=function(t){if(sj_be(t,i,this.mouseOverHandler),sj_be(t,r,this.mouseOutHandler),sj_be(t,n.ClickEvent,this.mouseClickHandler),t.removeAttribute("title"),t.children&&t.children.length>0){var f=t.children[0],u,e=!1;f.tagName=="IMG"?u=f:f.tagName=="DIV"&&f.className&&f.className.indexOf("rms_img")>=0&&f.children&&f.children.length>0&&f.children[0].tagName=="IMG"&&(u=f.children[0],e=!0);u&&u.className&&typeof u.className.indexOf=="function"&&u.className.indexOf("rms_img")>=0&&(!u.hasAttribute("aria-label")&&u.title&&u.setAttribute("aria-label",u.title),u.removeAttribute("title"),e&&f.removeAttribute("title"))}},u}(n.EntityPreviewBaseController),v=function(){function n(){this.mouseOnLink=!1;this.mouseOnPreviewWindow=!1;this.windowVisible=!1}return n.prototype.shouldShow=function(){return this.mouseOnLink&&!this.mouseOnPreviewWindow&&(!this.windowVisible||this.windowVisible&&!this.sameEntity)},n.prototype.shouldHide=function(){return this.windowVisible&&!this.mouseOnPreviewWindow&&(!this.sameEntity||this.sameEntity&&!this.mouseOnLink)},n}(),y=function(){function o(n,t,i,r,u,f){u===void 0&&(u=!1);f===void 0&&(f=null);this.EventDelay=500;this.D2Timeout=2e3;this.D5Timeout=5e3;this._loader=i;this._psid=t;this._containerClassName=r?r:"NA";this.forceShowingUnderTarget=u;this.EventDelay=f&&+f?+f:this.EventDelay;this.popOverStatus=new v;this.init(n)}return o.prototype.hide=function(){var n=this;(sb_ct(this.eventTimer),this.popOverStatus.shouldHide())&&(this.eventTimer=sb_st(function(){n.popOverStatus.shouldHide()&&(n.clearDwellTimers(),n.popOverStatus.windowVisible=!1,n.hideWindow(n.currentSid),n.currentElement=null)},this.EventDelay))},o.prototype.show=function(t){var i=this;(sb_ct(this.eventTimer),this.popOverStatus.shouldShow())&&(this.eventTimer=sb_st(function(){i.popOverStatus.shouldShow()&&(i.popOverStatus.windowVisible=!0,i.currentElement=t,i.currentSid=n.Util.getSidFromUrl(t.href),i.container.setAttribute(n.AnchorHookName,t.getAttribute(n.AnchorHookName)),i.destinationUrl=t.href,i.container.href=i.destinationUrl+n.PreviewWindowLinkTrait,i.showContainer(),i.container.target=t.target===u?u:"")},this.EventDelay))},o.prototype.hValue=function(){return this.currentElement.getAttribute(n.AnchorHookName)},o.prototype.init=function(t){var u=this;this.container=_ge(t);this.contentPane=_d.getElementsByClassName(e).item(0);this.arrowRightUp=_ge(s);this.arrowRightDown=_ge(c);this.arrowLeftUp=_ge(h);this.arrowLeftDown=_ge(l);sj_be(this.container,i,function(){u.popOverStatus.mouseOnPreviewWindow=!0});sj_be(this.container,r,function(){u.popOverStatus.mouseOnPreviewWindow=!1;u.hide()});sj_be(this.container,n.MouseUpEvent,function(){return u.hideWindow(u.currentSid)});sj_be(_w,f,function(){sb_ct(u.eventTimer);u.clearDwellTimers();u.popOverStatus.windowVisible=!1;u.hideWindow(u.currentSid);u.currentElement=null})},o.prototype.showContainer=function(){sa_cl(this.container,n.HideClassName,!0);this.displayContent(null)},o.prototype.displayContent=function(t,i){if(!i||i===this.currentSid){var r=this.currentElement?this.currentElement.getAttribute(n.HoverHookName):null;this.contentPane.innerHTML="";t==null?r?this._loader.GetContent(r,null,this,!0):this._loader.GetContent(this.destinationUrl,this._psid,this):t.innerHTML!=""&&this.currentElement&&(this.contentPane.appendChild(t),this.updateTitlePadding(),this.placeWindow(this.currentElement.getBoundingClientRect()),sa_cl(this.container,n.HideClassName,!1),this.clearDwellTimers(),this.startDwellTimers(),n.Util.LogCiHover("h",this.hValue(),this._containerClassName))}},o.prototype.setTargetElement=function(n){this.popOverStatus.sameEntity=n===this.currentElement;this.popOverStatus.mouseOnLink=n===null?!1:!0},o.prototype.updateTitlePadding=function(){var t,r=_d.getElementsByClassName(n.EpvCaptionClassName),i,u;(r&&r.length>0&&(t=r.item(0)),t)&&(i=t.previousElementSibling,i)&&(t.offsetHeight>=i.offsetHeight&&t.parentElement?t.parentElement.style.height=t.offsetHeight+n.PixelSuffix:(u=(i.offsetHeight-t.offsetHeight)/2,t.style.padding=u+"px 0"))},o.prototype.startDwellTimers=function(){var t=this;this.dwell2Timer=sb_st(function(){n.Util.LogCiHover("d2",t.currentElement.getAttribute(n.AnchorHookName),t._containerClassName)},this.D2Timeout);this.dwell5Timer=sb_st(function(){n.Util.LogCiHover("d5",t.currentElement.getAttribute(n.AnchorHookName),t._containerClassName)},this.D5Timeout)},o.prototype.clearDwellTimers=function(){sb_ct(this.dwell2Timer);sb_ct(this.dwell5Timer)},o.prototype.hideWindow=function(){this.container.className.indexOf(n.HideClassName)===-1&&sa_cl(this.container,n.HideClassName,!0)},o.prototype.placeWindow=function(i){var f=_w.innerWidth,v=_w.innerHeight,e=i.right-i.left,a=this.container.offsetHeight,o=300,h=15,u=30,y=v-i.bottom,c=0,l=!0,r,s;i.right<o&&i.right<f-i.left?(r=i.right,c=r<u*2?r-u:r<e/2+u*2?r-u:r-e/2-u,l=!1):(r=f-i.left,c=r<u*2?f-o+u-r:r<e/2+u*2?f-o-u:f-r+e/2-o+u);this.container.style.left=c+n.PixelSuffix;this.arrowRightUp.style.visibility=t;this.arrowRightDown.style.visibility=t;this.arrowLeftUp.style.visibility=t;this.arrowLeftDown.style.visibility=t;s=0;this.forceShowingUnderTarget||y>a+h?(s=i.bottom+h,l?this.arrowRightUp.style.visibility="":this.arrowLeftUp.style.visibility=""):(s=i.top-a-h,l?this.arrowRightDown.style.visibility="":this.arrowLeftDown.style.visibility="");this.container.style.top=s+n.PixelSuffix},o}();n.init=w}(EntityPanePreview||(EntityPanePreview={}))