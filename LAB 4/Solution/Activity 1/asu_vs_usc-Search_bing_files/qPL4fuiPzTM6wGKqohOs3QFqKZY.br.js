var SerpVTI=typeof SerpVTI=="undefined"?{}:SerpVTI,SerpVT=SerpVT||new function(){function c(){if(typeof i=="function"&&i("Start"),SerpVT.player){var n=SerpVT.player.parentElement;n&&(n.className=u,n.style.backgroundColor="black");SerpVT.player.style.height=SerpVT.player.style.width="100%";sj_so(SerpVT.player,100);SerpVTI.vs&&SerpVTI.vs();_G.TestEnv&&sj_evt.fire("Vi.Hover.Display")}}function it(){st();SerpVT.player=null;n=null;t=null}function r(){var n,t;typeof i=="function"&&i("Stop");SerpVT.player&&(rt(),n=SerpVT.player.parentElement,n&&(n.className=u,n.style.backgroundColor="transparent",n.innerHTML=""),SerpVT._destroyAfterPlay&&(t=n.parentNode,t&&t.removeChild&&t.removeChild(n),SerpVT.lp=null,SerpVT.lt=null,it()));SerpVT._destroyAfterPlay=!1;SerpVTI.mot&&SerpVTI.mot()}function rt(){SerpVT.player&&(SerpVT.player.style.display="none",n&&(n.autoplay=!1,n.removeAttribute("src"),n.load()),t&&t.removeAttribute("src"))}function l(){typeof i=="function"&&i("Error");r()}function a(){typeof i=="function"&&i("Loading");SerpVT.player&&SerpVT.player.parentElement&&(SerpVT.player.parentElement.className=g)}function ut(){SerpVT.v=parseInt(sj_cook.get(e,y));SerpVT.v>=0&&SerpVT.v<=100||(SerpVT.v=50);n.volume=SerpVT.v/100}function ft(t){SerpVT.m=p?sj_cook.get(e,v)=="1":!0;typeof t!="undefined"&&t===!0&&(SerpVT.m=!0);n.muted=SerpVT.m}function et(t){if(t){var i=sj_gx();i.open("GET",t,!0);i.responseType="blob";i.onreadystatechange=function(r){if(i.readyState==4&&i.status==200){var u=i.response,e=(_w.URL||_w.webkitURL).createObjectURL(u);if(f=e,f&&n)try{n.srcObject=f}catch(r){n.src=t}else n&&(n.src=t)}else i.readyState===4&&(f=null,n&&(n.src=t))};i.onerror=function(){n&&(n.src=t)};i.send()}}function ot(i,r,u,e,h,c){var v,y;u&&u.length>0?(f=null,n=sj_ce("video",i,o),SerpVT.player=n,n.setAttribute("playsinline",""),n.setAttribute("webkit-playsinline",""),n.style.width=e!=null&&e>0?e+"px":"1px",n.style.height=h!=null&&h>0?h+"px":"1px",n.poster=r,k(),ut(),ft(c),n.autoplay=!0,n.setAttribute("type","video/mp4"),w===!0?et(u):n.src=u):r&&r.length>0&&(a(),t=sj_ce("img",i,o),t.setAttribute("role","presentation"),v="&h="+h,r=b("&h=\\d+",v,r),y="&w="+e,r=b("&w=\\d+",y,r),t.onerror=function(){l()},t.onload=function(){sj_evt.fire(s,t)},t.src=r,t.style.height=h,t.style.width=e,SerpVT.player=t,k())}function b(n,t,i){var u=i,f,r;return n&&n.length>0&&(f=new RegExp(n,"g"),r=f.exec(i),u=r&&r.length>0?i.replace(r[0],t):i+t),u}function k(){SerpVT.player&&(sj_be(n,"loadstart",a),sj_be(n,"playing",c),sj_be(n,"ended",r),sj_be(n,"error",l),sj_evt.bind(s,d),SerpVT._playTimeoutTimer&&sb_ct(SerpVT._playTimeoutTimer),SerpVT._playTimeoutMS>0&&(SerpVT._playTimeoutTimer=sb_st(r,SerpVT._playTimeoutMS)))}function st(){SerpVT.player&&(sj_ue(n,"loadstart",a),sj_ue(n,"playing",c),sj_ue(n,"ended",r),sj_ue(n,"error",l),sj_evt.unbind(s,d),SerpVT._playTimeoutTimer&&sb_ct(SerpVT._playTimeoutTimer))}function d(n){n!=null&&n.length>1&&n[1]==t&&c()}var e="SRCHHPGUSR",v="VMUTE",y="VOLUME",u="vt_vp",g="vt_vph",o="vt_fp",nt="tw",tt="th",s="SerpVT.InlineImage.Show",h;var n,t,i=null,p=!1,w=!1,f=null;this.hover=function(n,t,f,e,s,c,l,a){var v,k,y,it;if((SerpVT.m=!0,SerpVT.v=50,SerpVT.lp=null,SerpVT.lt=null,SerpVT._destroyAfterPlay=!1,(!(t==null||t.length<1)||l!=null&&l!=l.length<1)&&t!=SerpVT.lp&&l!=SerpVT.lt)&&(SerpVT._destroyAfterPlay===!0&&i&&i("Error"),SerpVT.player&&r(),w=c,SerpVT._destroyAfterPlay=!!e,SerpVT._playTimeoutMS=isNaN(a)?a:0,i=s,v=n.firstChild,k=new RegExp(u,"g"),v&&!k.test(v.className)&&(y=sj_ce("span",null,u),y.setAttribute("data-priority","2"),n.insertBefore(y,v),v=y),!v.firstChild||v.firstChild.className!=o)){var d=n.getAttributeNode(nt),g=n.getAttributeNode(tt),p=0,b=0;d&&g?(p=d.value,b=g.value):(p=n.clientWidth,b=n.clientHeight);SerpVTI.mov&&SerpVTI.mov(n);(t&&t.length>0||l&&l.length>0)&&(h||(h=0),it=u+h++,ot(it,l,t,p,b,f),sj_so(SerpVT.player,0));SerpVT.player&&(v.insertBefore(SerpVT.player,v.firstChild),SerpVT._destroyAfterPlay==!0?sj_ue(v.parentNode,"mouseout",SerpVT.unhover):(sj_be(v.parentNode,"mouseout",SerpVT.unhover),sj_be(SerpVT.player,"mouseout",SerpVT.unhover)));t&&t.length>0&&(SerpVT.lp=t);l&&l.length>0&&(SerpVT.lt=l)}};this.unhover=function(n){n=sj_ev(n);var t=sj_mo(n),i=typeof HoverUtils!="undefined"&&HoverUtils!=null&&typeof HoverUtils.getClassName=="function"?HoverUtils.getClassName(t):"";t&&i.match(/^(vol cont)|volMute|(vt_(vph|fp|povl_c|pt|pts))$/)||(SerpVT.player&&SerpVT.player.parentNode&&sj_ue(SerpVT.player.parentNode,"mouseout",SerpVT.unhover),SerpVT.lp=null,SerpVT.lt=null,r())};this.status=function(n){n=="Mute"&&SerpVT.toggleMute()};this.toggleMute=function(){SerpVT.m=!SerpVT.m;n&&(n.muted=SerpVT.m);p=!0;sj_cook.set(e,v,SerpVT.m?"1":"0",!0)};this.setVolume=function(t){t>=0&&t<=100&&t!=SerpVT.v&&(SerpVT.v=t,n&&(n.volume=SerpVT.v/100),sj_cook.set(e,y,SerpVT.v.toString(),!0))}};SerpVT.m=!0;SerpVT.v=0