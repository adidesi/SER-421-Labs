var SlideExperienceLite;(function(n){function e(n,t,i,r,f,e,o,s,h,c,l,a,v){var y=new u(n,t,i,r,e,o,s,h,c,l,a,v);y.init()}function t(){sj_evt.fire("lazyLdImg")}var i=_G.RTL,r=i?"marginRight":"marginLeft",u=function(){function n(n,t,r,u,f,e,o,s,h,c,l,a){if(this.swipeThreshold=50,this.firstSlideOffsetLeft=4,this.activeSlideIndex=0,this.scrolling=!1,this.id=n,this.controlId=t,this.bar=_ge(t),this.control=_ge(this.bar.id+"c"),this.viewport=this.getViewPortParent(this.bar)||this.bar.parentElement,this.viewport){if(this.dirMultiplier=!i||sb_ie?1:-1,this.showChevronAllTime=f,this.hideChevronsOnStart=s,this.paddingBuffer=h&&r?this.computePaddingBuffer():0,this.appns=this.control.getAttribute("data-appns"),this.kvalue=this.control.getAttribute("data-k"),this.slideExpType=r?"Carousel":"SlideShow",this.slideRightMargin=u,this.totalSlides=this.bar.childElementCount,this.totalSlides<=0)throw"no slides was found";this.initialViewportWidth=this.viewportWidth();this.getExtraBleedingMargin();this.enableCarouselSeeMore=e;this.shownSlideIndex=o;this.stateKey=this.control.getAttribute("data-stk");this.enableFocusOnSlideChild=c;this.enableHoverExpansion=l;this.isCarouselFixedHeight=a}}return n.prototype.computePaddingBuffer=function(){if(_w.getComputedStyle){var n=_w.getComputedStyle(this.viewport);return parseInt(n.paddingTop)+parseInt(n.paddingBottom)}return 0},n.prototype.enableNativeScrolling=function(){var n,i,t;this.viewport&&this.viewport.getAttribute("nativeScrollingEnabled")!=="1"&&(n=this.viewport.offsetHeight,this.viewport.parentElement.style.overflow="hidden",Lib.CssClass.add(this.viewport,"scrollbar"),n>0&&(this.isCarouselFixedHeight&&(this.viewport.parentElement.style.height=""+n+"px",this.bar.style.height=""+this.viewportHeightToBarHeight(n)+"px",i=this.viewport.offsetHeight,this.viewport.style.height=""+i+"px",this.viewport.style.marginBottom="-30px",this.viewport.style.paddingBottom="30px"),this.enableCarouselSeeMore&&(t=_ge(this.controlId+"_carousel_seemore"),t.style.height=""+n+"px",t.style.lineHeight=""+n+"px")),this.viewport.setAttribute("nativeScrollingEnabled","1"))},n.prototype.init=function(){var n=this,i,r,u,t,e;this.enableNativeScrolling();this.enableHoverExpansion&&this.wireupHoverExpansion();sj_be(this.viewport,"scroll",function(){n.onScroll()});Swipe.OnSwipe(function(){Log.Log("Left","SlideExp","Swipe",!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls")},function(){Log.Log("Right","SlideExp","Swipe",!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls")},this.control,this.swipeThreshold,function(){},function(t){n.isLeft=t>0;n.isRight=t<0;Log.Log("NoOp","SlideExp","Swipe",!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls")},function(){sj_evt.fire("slideexp_movestart",n.controlId)},!0,!1);sj_be(this.control,"mousedown",function(t){i=t.pageX;r=t.pageY;t.preventDefault&&t.preventDefault();var u=t.pageX,f=function(t){var i=t.pageX-u;n.viewport.scrollLeft-=i;u=t.pageX},e=function(){Log.Log("Drag","SlideExp","Drag",!0,n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls");sj_ue(_w,"mousemove",f,!0);sj_ue(_w,"mouseup",e,!0)};sj_be(_w,"mousemove",f,!0);sj_be(_w,"mouseup",e,!0)},!0);u=function(n){n.isTrusted&&(Math.abs(n.pageX-i)>5||Math.abs(n.pageY-r)>5)&&(n.preventDefault&&n.preventDefault(),n.stopPropagation&&n.stopPropagation())};sj_be(this.control,"click",u,!0);this.updateMaxScrollLeft();Orientation.onOrientation(function(t){n.updateMaxScrollLeft();var i=_ge(n.controlId);i?Log.Log(t?"Landsc":"Portrt","SlideExp","Rotate",!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls"):Log.Log(t?"Landsc":"Portrt","SlideExp","Rotate",!1,"Type",n.slideExpType,"GeE","1","AppNS",n.appns,"K",n.kvalue,"Category","CommonControls");sj_evt.fire("slideexp_rotate",n.controlId,i?null:n.bar)});for(sj_be(this.control,"mouseover",function(){n.enableChevronsOnSlideExperienceInvisibility();sj_evt.fire("slideexp_mouseover_show",n.controlId)}),sj_be(this.control,"mouseout",function(){n.showChevronAllTime||sj_evt.fire("slideexp_mouseout_hide",n.controlId)}),sj_evt.bind("slideexp_slideprev",function(t){n.isEventForMe(t)&&n.slidePrev()}),sj_evt.bind("slideexp_slidenext",function(t){n.isEventForMe(t)&&n.slideNext()}),sj_evt.bind("slideexp_slidetoindex",function(t){if(n.isEventForMe(t)){var i=t[2];Log.Log("SlideTo","SlideExp","ID"+i,!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls")}},!0),sj_evt.bind("slideexp_slidetoindexfullview",function(t){t.length<3||!n.isEventForMe(t)||(n.slideToIndexFullView(t[2]),Log.Log("SlideToFullView","SlideExp","ID"+t[2],!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls"))},!0),t=0;t<this.bar.childElementCount;++t)sj_be(this.bar.children[t],"keydown",function(t){return function(i){i.keyCode===37&&t!==0?n.slideToIndex(t-1,!0):i.keyCode===39&&t!==n.bar.childElementCount-1&&n.slideToIndex(t+1,!0)}}(t));this.showChevronAllTime&&!this.hideChevronsOnStart&&(this.updateChevrons(),sj_evt.fire("slideexp_mouseover_show",this.controlId));this.updatePager();this.updateChevrons();e=this;f[this.id]=e;sj_evt.fire("slideexp_init_done",this.controlId)},n.prototype.onScroll=function(){var n=this;this.scrolling||(this.scrolling=!0,sb_st(function(){n.updatePager();n.updateChevrons();sj_evt.fire("slideexp_scroll",n.controlId);Log.Log("Scroll","SlideExp","Scroll",!1,"Type",n.slideExpType,"AppNS",n.appns,"K",n.kvalue,"Category","CommonControls");n.scrolling=!1},1e3))},n.prototype.viewportHeightToBarHeight=function(n){return n-this.paddingBuffer},n.prototype.enableChevronsOnSlideExperienceInvisibility=function(){this.updateMaxScrollLeft();this.updateChevrons()},n.prototype.getElementWidth=function(n){if(_w.getComputedStyle){var t=_w.getComputedStyle(n).width;return Number(t.substring(0,t.length-2))}return n.scrollWidth},n.prototype.updateMaxScrollLeft=function(){this.maxScrollLeft=this.viewport.scrollWidth-this.viewport.offsetWidth},n.prototype.firstElementChild=function(n){if(n.firstElementChild)return n.firstElementChild;for(var t=n.firstChild;t;){if(t.nodeType==1)return t;t=t.nextSibling}return null},n.prototype.slideWidth=function(){return this.getElementWidth(this.firstElementChild(this.bar))},n.prototype.viewportWidth=function(){return this.getElementWidth(this.viewport)},n.prototype.isCssTransitionSupported=function(){var n=this.viewport.style,t=n.WebkitTransition!=null,i=n.MozTransition!=null,r=n.OTransition!=null;return t||i||r||n.transition!=null},n.prototype.getActiveSlide=function(){return Math.round(this.viewport.scrollLeft/this.slideWidth())},n.prototype.getSlide=function(n){return this.bar.children[n]},n.prototype.updatePager=function(n){t();n||(n=this.activeSlideIndex);sj_evt.fire("pager_updateindex",this.controlId,n)},n.prototype.setSlideTabFocus=function(){for(var t,i,n=0;n<this.bar.childElementCount;n++)t=this.bar.children[n],t.removeAttribute("tabindex");i=this.bar.children[this.activeSlideIndex];i.tabIndex=0},n.prototype.slidePrev=function(){var n;if(!this.isLeftMost()){var u=this.slideWidth(),r=this.viewportWidth(),i=u+this.slideRightMargin,f=r%i>=u?1:0,e=Math.floor(r/i)+f,o=Math.ceil(this.GetScrollLeft()/i),s=Math.max(0,o-e);n=s*i;n=Math.max(n,0);this.slideToOffset(n>=this.GetScrollLeft()?this.GetScrollLeft()-r:n);sj_evt.fire("slideexp_slideprev_move",this.controlId);Log.Log("Prev","SlideExp","Slide",!1,"Type",this.slideExpType,"AppNS",this.appns,"K",this.kvalue,"Category","CommonControls");t()}},n.prototype.slideNext=function(){var n;if(!this.isRightMost()){var u=this.slideWidth(),i=this.viewportWidth(),r=u+this.slideRightMargin,f=(this.viewport.scrollLeft+i)%r>=u?1:0,e=Math.floor((this.GetScrollLeft()+i)/r)+f;n=e*r;n=Math.min(n,this.maxScrollLeft);this.slideToOffset(n<=this.GetScrollLeft()?this.GetScrollLeft()+i:n);sj_evt.fire("slideexp_slidenext_move",this.controlId);Log.Log("Next","SlideExp","Slide",!1,"Type",this.slideExpType,"AppNS",this.appns,"K",this.kvalue,"Category","CommonControls");t()}},n.prototype.slideToIndex=function(n,i,r){var u=this,f;(i===void 0&&(i=!1),r===void 0&&(r=!1),t(),n<0||n>=this.totalSlides)||(f=this.slideWidth()*n,this.activeSlideIndex=n,i&&this.setSlideTabFocus(),sb_st(function(){u.slideToOffset(f,i?function(){u.setFocusOnCurrentSlide()}:null,r)},0),sj_evt.fire("slideexp_toActiveIndex",this.controlId,n),t())},n.prototype.slideToIndexFullView=function(n,i,r){var u,f,e;(i===void 0&&(i=!1),r===void 0&&(r=!1),t(),n<0||n>=this.totalSlides)||(u=this.bar.children[n],f=this.GetScrollLeft(),u.offsetLeft-this.firstSlideOffsetLeft<this.GetScrollLeft()&&(f=u.offsetLeft-this.firstSlideOffsetLeft),u.offsetLeft-this.firstSlideOffsetLeft+this.getElementWidth(u)>this.viewportWidth()+this.GetScrollLeft()&&(e=u.offsetLeft-this.firstSlideOffsetLeft+this.getElementWidth(u)-(this.viewportWidth()+this.GetScrollLeft()),f=this.GetScrollLeft()+e),this.slideToOffset(f,null,!0))},n.prototype.getExtraBleedingMargin=function(){return(!this.extraBleedingMargin||this.extraBleedingMargin<=0)&&(this.extraBleedingMargin=this.viewport.scrollWidth-(this.totalSlides*(this.slideWidth()+this.slideRightMargin)-this.slideRightMargin)+Math.abs(parseInt(getComputedStyle(this.bar).marginLeft))),this.extraBleedingMargin},n.prototype.setFocusOnCurrentSlide=function(){var n=this.bar.children[this.activeSlideIndex],t;this.enableFocusOnSlideChild?(t=AccessibilityHelpers.getFocusableElementWithin(n)||n,t.focus()):n.focus()},n.prototype.slideToOffset=function(n,t,i){t===void 0&&(t=null);i===void 0&&(i=!1);this.updateMaxScrollLeft();var r=this.maxScrollLeft;n<0?n=0:n>r&&(n=r);this.updatePager();i?(this.SetScrollLeft(n),t&&t()):this.isCssTransitionSupported()&&this.slideToOffsetUsingTransition(n,t)},n.prototype.slideToOffsetUsingTransition=function(n,t){var i=this,f,u;if(t===void 0&&(t=null),f=n-this.GetScrollLeft(),f===0){t&&t();return}u=function(){Lib.CssClass.remove(i.bar,"anim");i.bar.style.transition="x";i.bar.style[r]="";i.SetScrollLeft(n);i.updateChevrons();sj_ue(i.bar,"transitionend",u);sj_ue(i.bar,"webkitTransitionEnd",u);sj_ue(i.bar,"oTransitionEnd",u);t&&t()};sj_be(this.bar,"transitionend",u);sj_be(this.bar,"webkitTransitionEnd",u);sj_be(this.bar,"oTransitionEnd",u);this.bar.style.transition="";Lib.CssClass.add(this.bar,"anim");this.bar.style[r]=""+-f+"px"},n.prototype.isLeftMost=function(){return this.updateMaxScrollLeft(),this.GetScrollLeft()<=0},n.prototype.isRightMost=function(){return this.updateMaxScrollLeft(),Math.ceil(this.GetScrollLeft())>=this.maxScrollLeft},n.prototype.GetScrollLeft=function(){return this.dirMultiplier*this.viewport.scrollLeft},n.prototype.SetScrollLeft=function(n){this.viewport.scrollLeft=this.dirMultiplier*n},n.prototype.updateChevrons=function(){if(t(),this.isLeftMost()&&this.isRightMost()){sj_evt.fire("slideexp_leftrightmost",this.controlId);return}if(this.isLeftMost()){sj_evt.fire("slideexp_leftmost",this.controlId);return}if(this.isRightMost()){sj_evt.fire("slideexp_rightmost",this.controlId);return}sj_evt.fire("slideexp_middle",this.controlId)},n.prototype.isEventForMe=function(n){var t=n[1];return t==this.controlId||t==this.controlId+"c"},n.prototype.getViewPortParent=function(n){return n==null||this.control==n?null:Lib.CssClass.contains(n,"b_viewport")?n:this.getViewPortParent(n.parentElement)},n.prototype.displaySwitch=function(n,t){for(var i,f,e,u,r=0;r<n.length;r++)i=n[r],f=i.getAttribute("data-mini"),f&&(f===t?(i.style.display="inline-block",e=i.scrollHeight,i.style.height=e+"px",u=e+8,this.viewport.parentElement.style.height=u+"px",this.viewport.parentElement.style.transition="height 0.3s ease-out",this.viewport.parentElement.style.overflow="hidden",this.viewport.style.height=u+"px",this.viewport.style.transition="height 0.3s ease-out",this.viewport.style.marginBottom="-30px",this.viewport.style.paddingBottom="30px",this.bar.style.height=u+"px",this.bar.style.transition="height 0.3s ease-out"):i.style.display="none");_w.sj_log&&sj_log("CI.MiniExpansion","Hover","1")},n.prototype.wireupHoverExpansion=function(){var t=this,n=null;_d.querySelectorAll&&(n=_d.querySelectorAll("#"+this.controlId+" [data-mini]"));sj_be(this.bar,"mouseover",function(){return t.displaySwitch(n,"0")})},n}(),f={};n.init=e;sj_evt.fire("slideexperiencelite_init",n)})(SlideExperienceLite||(SlideExperienceLite={}))