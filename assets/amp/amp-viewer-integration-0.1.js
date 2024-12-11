;
(self.AMP=self.AMP||[]).push({m:0,v:"2410292120000",n:"amp-viewer-integration",ev:"0.1",l:!0,p:"high",f:function(t,n){!function(){function n(t,n){(null==n||n>t.length)&&(n=t.length);for(var i=0,r=new Array(n);i<n;i++)r[i]=t[i];return r}function i(t,i){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,i){if(t){if("string"==typeof t)return n(t,i);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,i):void 0}}(t))||i&&t&&"number"==typeof t.length){r&&(t=r);var e=0;return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r;function e(){return r||(r=Promise.resolve(void 0))}var s=function(){var t=this;this.promise=new Promise((function(n,i){t.resolve=n,t.reject=i}))};function o(t,n){var i=t.length-n.length;return i>=0&&t.indexOf(n,i)==i}Array.isArray;var u=Object.prototype;function h(t){var n=Object.create(null);return t&&Object.assign(n,t),n}function a(t,n,i,r,e,s,o,u,h,a,f){return t}u.hasOwnProperty,u.toString;var f=/(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;function c(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";try{return decodeURIComponent(t)}catch(t){return n}}function v(t){var n=Object.getOwnPropertyDescriptor(t,"message");if(null!=n&&n.writable)return t;var i=t.message,r=t.stack,e=new Error(i);for(var s in t)e[s]=t[s];return e.stack=r,e}function l(t){for(var n,r=null,e="",s=i(arguments,!0);!(n=s()).done;){var o=n.value;o instanceof Error&&!r?r=v(o):(e&&(e+=" "),e+=o)}return r?e&&(r.message=e+": "+r.message):r=new Error(e),r}function d(t){var n,i;null===(n=(i=self).__AMP_REPORT_ERROR)||void 0===n||n.call(i,t)}self.__AMP_LOG=self.__AMP_LOG||{user:null,dev:null,userForEmbed:null};var p=self.__AMP_LOG;function m(t,n){throw new Error("failed to call initLogConstructor")}function y(t){return p.user||(p.user=g()),function(t,n){return n&&n.ownerDocument.defaultView!=t}(p.user.win,t)?p.userForEmbed||(p.userForEmbed=g()):p.user}function g(t){return m()}function w(){return p.dev||(p.dev=m())}function b(t,n,i,r,e,s,o,u,h,a,f){return t}function x(t,n,i,r,e,s,o,u,h,a,f){return y().assert(t,n,i,r,e,s,o,u,h,a,f)}function k(t,n){return I(t=function(t){return t.__AMP_TOP||(t.__AMP_TOP=t)}(t),n)}function E(t,n){return I(A(S(t)),n)}function S(t){return t.nodeType?(i=t,n=(i.ownerDocument||i).defaultView,k(n,"ampdoc")).getAmpDoc(t):t;var n,i}function A(t){var n=S(t);return n.isSingleDoc()?n.win:n}function I(t,n){b(_(t,n));var i=function(t){var n=t.__AMP_SERVICES;return n||(n=t.__AMP_SERVICES={}),n}(t)[n];return i.obj||(b(i.ctor),b(i.context),i.obj=new i.ctor(i.context),b(i.obj),i.context=null,i.resolve&&i.resolve(i.obj)),i.obj}function _(t,n){var i=t.__AMP_SERVICES&&t.__AMP_SERVICES[n];return!(!i||!i.ctor)}var M,O=function(t){return k(t,"platform")},C=function(t){return E(t,"viewer")},P=function(t){return E(t,"viewport")},T=["Webkit","webkit","Moz","moz","ms","O","o"],N={"getPropertyPriority":function(){return""},"getPropertyValue":function(){return""}};function R(t){var n=t.replace(/[A-Z]/g,(function(t){return"-"+t.toLowerCase()}));return T.some((function(t){return n.startsWith(t+"-")}))?"-".concat(n):n}function U(t,n,i){if(X(n))return n;M||(M=h());var r=M[n];if(!r||i){if(r=n,void 0===t[n]){var e=function(t){return t.charAt(0).toUpperCase()+t.slice(1)}(n),s=function(t,n){for(var i=0;i<T.length;i++){var r=T[i]+n;if(void 0!==t[r])return r}return""}(t,e);void 0!==t[s]&&(r=s)}i||(M[n]=r)}return r}function j(t,n){var i=t.style;for(var r in n)i.setProperty(R(U(i,r)),String(n[r]),"important")}function q(t,n,i,r,e){var s=U(t.style,n,e);if(s){var o=r?i+r:i;t.style.setProperty(R(s),o)}}function z(t,n,i){var r=U(t.style,n,i);if(r)return X(r)?t.style.getPropertyValue(r):t.style[r]}function L(t,n){for(var i in n)q(t,i,n[i])}function Y(t,n){var i=t.style;a(""!==n&&"none"!==n),a(!i.display),i.display=n}function F(t,n){return t.getComputedStyle(n)||N}function K(t,n){for(var i=0;i<n.length;i++)q(t,n[i],null)}function X(t){return t.startsWith("--")}var D=function(){function t(){}return t.solveYValueFromXValue=function(n,i,r,e,s,o,u,h,a){return t.Qd(t.Zd(n,i,e,o,h),r,s,u,a)},t.Zd=function(n,i,r,e,s){var o=1e-6,u=(n-i)/(s-i);if(u<=0)return 0;if(u>=1)return 1;for(var h=0,a=1,f=0,c=0;c<8;c++){f=t.tm(u,i,r,e,s);var v=(t.tm(u+o,i,r,e,s)-f)/o;if(Math.abs(f-n)<o)return u;if(Math.abs(v)<o)break;f<n?h=u:a=u,u-=(f-n)/v}for(var l=0;Math.abs(f-n)>o&&l<8;l++)f<n?(h=u,u=(u+a)/2):(a=u,u=(u+h)/2),f=t.tm(u,i,r,e,s);return u},t.tm=function(n,i,r,e,s){if(0==n)return i;if(1==n)return s;var o=t.im(i,r,n),u=t.im(r,e,n),h=t.im(e,s,n);return o=t.im(o,u,n),u=t.im(u,h,n),t.im(o,u,n)},t.Qd=function(n,i,r,e,s){if(0==n)return i;if(1==n)return s;var o=t.im(i,r,n),u=t.im(r,e,n),h=t.im(e,s,n);return o=t.im(o,u,n),u=t.im(u,h,n),t.im(o,u,n)},t.im=function(t,n,i){return t+i*(n-t)},t}(),V={LINEAR:function(t){return t},EASE:function(t){return D.solveYValueFromXValue(t,0,0,.25,.1,.25,1,1,1)},EASE_IN:function(t){return D.solveYValueFromXValue(t,0,0,.42,0,1,1,1,1)},EASE_OUT:function(t){return D.solveYValueFromXValue(t,0,0,0,0,.58,1,1,1)},EASE_IN_OUT:function(t){return D.solveYValueFromXValue(t,0,0,.42,0,.58,1,1,1)}},H={"linear":V.LINEAR,"ease":V.EASE,"ease-in":V.EASE_IN,"ease-out":V.EASE_OUT,"ease-in-out":V.EASE_IN_OUT};function J(t){if(!t)return null;if("string"==typeof t){if(-1!=t.indexOf("cubic-bezier")){var n=t.match(/cubic-bezier\((.+)\)/);if(n){var i=n[1].split(",").map(parseFloat);if(4==i.length){for(var r=0;r<4;r++)if(isNaN(i[r]))return null;return e=i[0],s=i[1],o=i[2],u=i[3],function(t){return D.solveYValueFromXValue(t,0,0,e,s,o,u,1,1)}}}return null}return H[t]}var e,s,o,u;return t}var B="Animation",G=function(){},W=function(){function t(t,n){this.nm=t,this.Gc=n||k(self,"vsync"),this.rm=null,this.sm=[]}t.animate=function(n,i,r,e){return new t(n).setCurve(e).add(0,i,1).start(r)};var n=t.prototype;return n.setCurve=function(t){return t&&(this.rm=J(t)),this},n.add=function(t,n,i,r){return this.sm.push({delay:t,func:n,duration:i,curve:J(r)}),this},n.start=function(t){return new Z(this.Gc,this.nm,this.sm,this.rm,t)},t}(),Z=function(){function t(t,n,i,r,e){this.Gc=t,this.nm=n,this.sm=[];for(var o=0;o<i.length;o++){var u=i[o];this.sm.push({delay:u.delay,func:u.func,duration:u.duration,curve:u.curve||r,started:!1,completed:!1})}this.om=e,this.ka=Date.now(),this.es=!0,this.Ke={};var h=new s;this.um=h.promise,this.Fe=h.resolve,this.hm=h.reject,this.am=this.Gc.createAnimTask(this.nm,{mutate:this.fm.bind(this)}),this.Gc.canAnimate(this.nm)?this.am(this.Ke):(w().warn(B,"cannot animate"),this.lm(!1,0))}var n=t.prototype;return n.then=function(t,n){return t||n?this.um.then(t,n):this.um},n.thenAlways=function(t){var n=t||G;return this.then(n,n)},n.halt=function(t){this.lm(!1,t||0)},n.lm=function(t,n){if(this.es){if(this.es=!1,0!=n){this.sm.length>1&&this.sm.sort((function(t,n){return t.delay+t.duration-(n.delay+n.duration)}));try{if(n>0)for(var i=0;i<this.sm.length;i++)this.sm[i].func(1,!0);else for(var r=this.sm.length-1;r>=0;r--)this.sm[r].func(0,!1)}catch(n){w().error(B,"completion failed: "+n,n),t=!1}}t?this.Fe():this.hm()}},n.fm=function(t){if(this.es){for(var n=Date.now(),i=Math.min((n-this.ka)/this.om,1),r=0;r<this.sm.length;r++){var e=this.sm[r];!e.started&&i>=e.delay&&(e.started=!0)}for(var s=0;s<this.sm.length;s++){var o=this.sm[s];o.started&&!o.completed&&this.vm(o,i)}1==i?this.lm(!0,0):this.Gc.canAnimate(this.nm)?this.am(this.Ke):(w().warn(B,"cancel animation"),this.lm(!1,0))}},n.vm=function(t,n){var i,r;if(t.duration>0){if(r=i=Math.min((n-t.delay)/t.duration,1),t.curve&&1!=r)try{r=t.curve(i)}catch(t){return w().error(B,"step curve failed: "+t,t),void this.lm(!1,0)}}else i=1,r=1;1==i&&(t.completed=!0);try{t.func(r,t.completed)}catch(t){return w().error(B,"step mutate failed: "+t,t),void this.lm(!1,0)}},t}(),$=function(){function t(t,n,i){var r=this;this.Xo=I(t,"timer"),this.Jo=n,this.Qo=i||0,this.Zo=-1,this.rs=0,this.es=!1,this.us=function(){r.os()}}var n=t.prototype;return n.isPending=function(){return-1!=this.Zo},n.schedule=function(t){var n=t||this.Qo;this.es&&n<10&&(n=10);var i=Date.now()+n;return(!this.isPending()||i-this.rs<-10)&&(this.cancel(),this.rs=i,this.Zo=this.Xo.delay(this.us,n),!0)},n.os=function(){this.Zo=-1,this.rs=0,this.es=!0,this.Jo(),this.es=!1},n.cancel=function(){this.isPending()&&(this.Xo.cancel(this.Zo),this.Zo=-1)},t}(),Q="FixedLayer",tt="i-amphtml-lightbox",nt="i-amphtml-lightbox-element";function it(t){return-1!==t.tagName.indexOf("LIGHTBOX")}var rt,et=function(){function t(t,n,i,r,e){var s=this;this.ampdoc=t,this.Gc=n,this.tI=i,this.ym=r,this.nI=r,this.iI=e&&t.isSingleDoc(),this.rI=null,this.eI=0,this.Qt=[],this.sI=new $(t.win,(function(){return s.update()})),this.oI=null,this.uI=[],this.hI=[]}var n=t.prototype;return n.enterLightbox=function(t,n){var i=this,r=this.aI();r&&r.setLightboxMode(!0),t&&n&&n.then((function(){return i.fI(t,!0)}))},n.leaveLightbox=function(){var t=this.aI();t&&t.setLightboxMode(!1);var n=function(t,n){for(var i=[],r=0,e=0;e<t.length;e++){var s=t[e];s.lightboxed?i.push(s):(r<e&&(t[r]=s),r++)}return r<t.length&&(t.length=r),i}(this.Qt);this.cI(n),this.Qt.length||this.vI()},n.setup=function(){if(!C(this.ampdoc).isEmbedded())return!1;var t=this.ampdoc.getRootNode(),n=t.styleSheets;if(!n)return!0;this.uI.length=0,this.hI.length=0;for(var i=0;i<n.length;i++){var r=n[i];if(!r)return w().error(Q,"Aborting setup due to null stylesheet."),!0;var e=r.disabled,s=r.ownerNode;e||!s||"STYLE"!=s.tagName||s.hasAttribute("amp-boilerplate")||s.hasAttribute("amp-runtime")||s.hasAttribute("amp-extension")||this.lI(r.cssRules)}this.fI(t),this.Qt.length>0&&this.observeHiddenMutations();var o=O(this.ampdoc.win);return this.Qt.length>0&&!this.iI&&o.isIos()&&y().warn(Q,"Please test this page inside of an AMP Viewer such as Google's because the fixed or sticky positioning might have slightly different layout."),!0},n.fI=function(t,n){this.dI(t,n),this.pI(),this.update()},n.observeHiddenMutations=function(){this.mI()},n.vI=function(){this.sI.cancel();var t=this.oI;t&&(t(),this.oI=null)},n.mI=function(){var t=this;if(!this.oI){var n=this.ampdoc.getRootNode(),i=function(t){return n="hidden-observer",_(i=A(S(t)),n)?I(i,n):null;var n,i}(n.documentElement||n);this.oI=i.add((function(){t.sI.isPending()||t.sI.schedule(16)}))}},n.updatePaddingTop=function(t,n){this.ym=t,n||(this.nI=t),this.update()},n.transformMutate=function(t){t?this.Qt.forEach((function(n){n.fixedNow&&n.top&&(q(n.element,"transition","none"),n.transform&&"none"!=n.transform?q(n.element,"transform",n.transform+" "+t):q(n.element,"transform",t))})):this.Qt.forEach((function(t){t.fixedNow&&t.top&&L(t.element,{transform:"",transition:""})}))},n.addElement=function(t,n){return this.yI(t,"*","fixed",n)?(this.pI(),this.observeHiddenMutations(),this.update()):e()},n.removeElement=function(t){var n=this.gI(t);this.cI(n)},n.cI=function(t){var n=this;t.length>0&&this.rI&&this.Gc.mutate((function(){for(var i=0;i<t.length;i++){var r=t[i];"fixed"==r.position&&n.rI.returnFrom(r)}}))},n.isDeclaredFixed=function(t){return!!t.__AMP_DECLFIXED},n.isDeclaredSticky=function(t){return!!t.__AMP_DECLSTICKY},n.update=function(){var t=this;if(this.Qt.filter((function(n){return!t.ampdoc.contains(n.element)})).forEach((function(n){return t.gI(n.element)})),0==this.Qt.length)return e();this.sI.cancel();var n=!1;return this.Gc.runPromise({measure:function(i){for(var r=t.Qt,e=[],s=t.ampdoc.win,u=0;u<r.length;u++)j(r[u].element,{top:"",bottom:"-9999vh",transition:"none"});for(var h=0;h<r.length;h++)e.push(F(s,r[h].element).top);for(var a=0;a<r.length;a++)q(r[a].element,"bottom","");for(var f=0;f<r.length;f++){var c=r[f],v=c.element,l=c.forceTransfer,d=F(s,v),p=v.offsetHeight,m=v.offsetTop,y=v.offsetWidth,g=d.bottom,w=d.display,b=void 0===w?"":w,x=d.position,k=void 0===x?"":x,E=d.zIndex,S=parseFloat(d.opacity),A=d[U(d,"transform")],I=d.top,_="fixed"===k&&(l||y>0&&p>0),M=o(k,"sticky");if("none"!==b&&(_||M)){"auto"!==I&&e[f]===I||(I=_&&m===t.nI+t.tI?"0px":"");var O=!1;_&&(O=!0===l||!1!==l&&S>0&&p<300&&!(!I&&!g)),O&&(n=!0),i[c.id]={fixed:_,sticky:M,transferrable:O,top:I,zIndex:E,transform:A}}else i[c.id]={fixed:!1,sticky:!1,transferrable:!1,top:"",zIndex:""}}},mutate:function(i){n&&t.iI&&t.aI().update();for(var r=t.Qt,e=0;e<r.length;e++){var s=r[e],o=i[s.id];q(s.element,"transition","none"),q(s.element,"transition",""),o&&t.wI(s,e,o)}}},{}).catch((function(t){w().error(Q,"Failed to mutate fixed elements:",t)}))},n.dI=function(t,n){try{this.bI(t,n)}catch(t){w().error(Q,"Failed to setup fixed elements:",t)}},n.bI=function(t,n){for(var i=0;i<this.uI.length;i++)for(var r=this.uI[i],e=t.querySelectorAll(r),s=0;s<e.length&&!(this.Qt.length>10);s++)this.yI(e[s],r,"fixed",void 0,n);for(var o=0;o<this.hI.length;o++)for(var u=this.hI[o],h=t.querySelectorAll(u),a=0;a<h.length;a++)this.yI(h[a],u,"sticky",void 0,n)},n.xI=function(t){t.hasAttribute("style")&&(z(t,"top")||z(t,"bottom"))&&y().error(Q,"Inline styles with `top`, `bottom` and other CSS rules are not supported yet for fixed or sticky elements (#14186). Unexpected behavior may occur.",t)},n.yI=function(t,n,i,r,e){if(r||this.xI(t),it(t))return!1;var s=function(t,n,i){var r;for(r=t;r&&void 0!==r;r=r.parentElement)if(n(r))return r;return null}(t,it);if(!e&&s)return!1;for(var o=this.Qt,u=[],h=0;h<o.length;h++){var a=o[h].element;if(a===t)break;if(a.contains(t))return!1;t.contains(a)&&u.push(a)}for(var f=0;f<u.length;f++)this.removeElement(u[f]);for(var c=null,v=0;v<o.length;v++){var l=o[v];if(l.element==t&&l.position==i){c=l;break}}var d="fixed"==i;if(c)c.selectors.includes(n)||c.selectors.push(n);else{var p="F"+this.eI++;t.setAttribute("i-amphtml-fixedid",p),d?t.__AMP_DECLFIXED=!0:t.__AMP_DECLSTICKY=!0,c={id:p,element:t,position:i,selectors:[n],fixedNow:!1,stickyNow:!1,lightboxed:!!s},o.push(c)}return c.forceTransfer=!!d&&r,!0},n.gI=function(t){for(var n=[],i=0;i<this.Qt.length;i++){var r=this.Qt[i];r.element===t&&(r.lightboxed||this.Gc.mutate((function(){q(t,"top","")})),this.Qt.splice(i,1),n.push(r))}return this.Qt.length||this.vI(),n},n.pI=function(){this.Qt.sort((function(t,n){return(i=t.element)===(r=n.element)?0:i.compareDocumentPosition(r)&(Node.DOCUMENT_POSITION_PRECEDING|Node.DOCUMENT_POSITION_CONTAINS)?1:-1;var i,r}))},n.wI=function(t,n,i){var r=t.element,e=t.fixedNow;t.fixedNow=i.fixed,t.stickyNow=i.sticky,t.top=i.fixed||i.sticky?i.top:"",t.transform=i.transform,!e||i.fixed&&i.transferrable||!this.rI||this.rI.returnFrom(t),i.top&&(i.fixed||i.sticky)&&!t.lightboxed&&(i.fixed||!this.iI?q(r,"top","calc(".concat(i.top," + ").concat(this.ym,"px)")):this.nI===this.ym?q(r,"top",i.top):q(r,"top","calc(".concat(i.top," - ").concat(this.nI,"px)"))),this.iI&&i.fixed&&i.transferrable&&this.aI().transferTo(t,n,i)},n.aI=function(){if(!this.iI||this.rI)return this.rI;var t=this.ampdoc.win.document;return this.rI=new st(t,this.Gc),this.rI},n.lI=function(t){for(var n=0;n<t.length;n++){var i=t[n];if(4!=i.type&&12!=i.type){if(1==i.type){var r=i.selectorText,e=i.style.position;if("*"===r||!e)continue;"fixed"===e?this.uI.push(r):o(e,"sticky")&&this.hI.push(r)}}else this.lI(i.cssRules)}},n.animateFixedElements=function(t,n,i,r,s){var o=this;return this.updatePaddingTop(t,s),i<=0?e():W.animate(this.ampdoc.getRootNode(),(function(i){var r=function(i){return n-t+(t-n)*i}(i);o.transformMutate("translateY(".concat(r,"px)"))}),i,r).thenAlways((function(){o.transformMutate(null)}))},t}(),st=function(){function t(t,n){var i;this.si=t,this.Gc=n,this.kI=t.body.cloneNode(!1),this.kI.removeAttribute("style"),L(this.kI,("display"in(i={position:"absolute",top:0,left:0,height:0,width:0,pointerEvents:"none",overflow:"hidden",animation:"none",background:"none",border:"none",borderImage:"none",boxSizing:"border-box",boxShadow:"none",float:"none",margin:0,opacity:1,outline:"none",padding:"none",transform:"none",transition:"none"})&&function(t){for(var n=arguments.length,i=new Array(n>1?n-1:0),r=1;r<n;r++)i[r-1]=arguments[r];var e=l.apply(null,i);e.name=t||e.name,d(e)}("STYLE","`display` style detected. You must use toggle instead."),i)),Y(this.kI,"block"),t.documentElement.appendChild(this.kI)}var n=t.prototype;return n.getRoot=function(){return this.kI},n.setLightboxMode=function(t){var n=this;this.Gc.mutate((function(){var i=n.getRoot();t?i.setAttribute(tt,""):i.removeAttribute(tt)}))},n.update=function(){for(var t=this.si.body,n=this.kI,i=t.attributes,r=n.attributes,e=0;e<i.length;e++){var s=i[e];"style"!==s.name&&r.setNamedItem(s.cloneNode(!1))}for(var o=0;o<r.length;o++){var u=r[o].name;"style"===u||u===tt||t.hasAttribute(u)||(n.removeAttribute(u),o--)}},n.transferTo=function(t,n,i){var r=this,e=t.element;if(e.parentElement!=this.kI){if(w().fine(Q,"transfer to fixed:",t.id,t.element),y().warn(Q,"In order to improve scrolling performance in Safari, we now move the element to a fixed positioning layer:",t.element),!t.placeholder){q(e,"pointer-events","initial");var s=t.placeholder=this.si.createElement("i-amphtml-fpa");!function(t,n){void 0===n&&(n=t.hasAttribute("hidden")),n?t.removeAttribute("hidden"):t.setAttribute("hidden","")}(s,!1),s.setAttribute("i-amphtml-fixedid",t.id)}q(e,"zIndex","calc(".concat(1e4+n," + ").concat(i.zIndex||0,")")),t.lightboxed&&e.classList.add(nt),e.parentElement.replaceChild(t.placeholder,e),this.kI.appendChild(e),t.selectors.some((function(t){return r.EI(e,t)}))||(y().warn(Q,"Failed to move the element to the fixed position layer. This is most likely due to the compound CSS selector:",t.element),this.returnFrom(t))}},n.returnFrom=function(t){if(t.placeholder&&this.si.contains(t.placeholder)){var n=t.element,i=t.placeholder;w().fine(Q,"return from fixed:",t.id,n),t.lightboxed&&n.classList.remove(nt),this.si.contains(n)?(q(t.element,"zIndex",""),i.parentElement.replaceChild(n,i)):i.parentElement.removeChild(i)}},n.EI=function(t,n){try{return function(t,n){var i=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector;return!!i&&i.call(t,n)}(t,n)}catch(t){return w().error(Q,"Failed to test query match:",t),!1}},t}();function ot(t,n,i,r){var e=t,s=i,o=function(t){try{return s(t)}catch(t){var n,i;throw null===(n=(i=self).__AMP_REPORT_ERROR)||void 0===n||n.call(i,t),t}},u=function(){if(void 0!==rt)return rt;rt=!1;try{var t={get capture(){return rt=!0,!1}};self.addEventListener("test-options",null,t),self.removeEventListener("test-options",null,t)}catch(t){}return rt}(),h=!(null==r||!r.capture);return e.addEventListener(n,o,u?r:h),function(){null==e||e.removeEventListener(n,o,u?r:h),s=null,e=null,o=null}}function ut(t,n,i,r){return ot(t,n,i,r)}function ht(t){return t.data}function at(t,n,i,r){var e=i,s=ot(t,n,(function(t){try{e(t)}finally{e=null,s()}}),r);return s}var ft=function(){function t(t,n){this.win=t,this.H=n,this.SI()}var n=t.prototype;return n.SI=function(){ut(this.win.document,"focusin",this.AI.bind(this),{capture:!1})},n.AI=function(t){t.defaultPrevented||this.H.sendRequest(t.type,{"focusTargetRect":t.target.getBoundingClientRect()},!1)},t}();function ct(t){return"loading"!=t.readyState&&"uninitialized"!=t.readyState}function vt(t,n,i){return 0==n&&0==i||0==t.width&&0==t.height?t:{left:r=t.left+n,top:e=t.top+i,width:s=t.width,height:o=t.height,bottom:e+o,right:r+s,x:r,y:e};var r,e,s,o}var lt=function(){function t(t){this.II=t,this._I=[],this.dr=0}var n=t.prototype;return n.push=function(t){this._I[this.dr]=t,this.dr=(this.dr+1)%this.II},n.get=function(t){return this._I.length>=this.II&&(t=(this.dr+t)%this.II),this._I[t]},n.size=function(){return this._I.length},t}();function dt(t){return t.node.wholeText[t.offset]}var pt=/[,.\s\u2022()]/;function mt(t){return"’"==t||"‘"==t?"'":"“"==t||"”"==t?'"':t.toLowerCase()}function yt(t){for(var n=[],i=0;i<t.length;i++){var r=t[i];pt.test(r)||n.push(mt(r))}return n.join("")}var gt=function(){function t(t,n){this.MI=t,this.OI=n,this.matches=[],this.CI={},this.TI=t.length-1;for(var i=0;i<t.length;i++){var r=t[i];this.CI[r]=t.length-1-i}}return t.prototype.update=function(){if(this.TI>0)this.TI--;else{for(var t=this.OI,n=this.MI,i=t.size(),r=0;r<n.length;r++){var e=mt(dt(t.get(i-1-r).pos));if(n[n.length-1-r]!=e){var s=this.CI[e];return null==s&&(s=n.length),(s-=r)<1&&(s=1),void(this.TI=s-1)}}var o=t.get(i-1),u=o.pos;this.matches.push({start:t.get(i-n.length),end:{pos:{node:u.node,offset:u.offset+1},idx:o.idx+1}})}},t}();function wt(t,n,i,r){for(var e=i;e<r.length;e++){var s=r[e];if(t.node!=s.start.node)return;if(s.start.node=n,s.start.offset-=t.offset,t.node!=s.end.node)return;s.end.node=n,s.end.offset-=t.offset}}function bt(t,n,i,r,e,s){for(;;){if(n.node==i.node){var o=xt(t,n.node,n.offset,i.offset,s);return void(o&&wt(i,o,e+1,r))}var u=kt(t,n.node);if(xt(t,n.node,n.offset,n.node.wholeText.length,s),!u)break;n={node:u,offset:0}}}function xt(t,n,i,r,e){if(i>=r)return null;var s=t.document,o=n.parentNode,u=n.wholeText;i>0&&o.insertBefore(s.createTextNode(u.substring(0,i)),n);var h=s.createElement("span");h.appendChild(s.createTextNode(u.substring(i,r))),o.insertBefore(h,n),e.push(h);var a=null;return r<u.length&&(a=s.createTextNode(u.substring(r)),o.insertBefore(a,n)),o.removeChild(n),a}function kt(t,n){for(var i=!0,r=n;;){if(null==r)return null;if(i){var e=r.nextSibling;e?(r=e,i=!1):r=r.parentNode}else{if(r instanceof t.Text)return r;r.firstChild?r=r.firstChild:i=!0}}}var Et=function(){function t(n,i){if(this.t=n,this.NI=i,this.RI=-1,this.UI=null,i instanceof n.Text)this.RI=0;else if(i instanceof n.Element){if("none"==F(n,i).display)return;var r=i.firstChild;null!=r&&(this.UI=new t(n,r))}}var n=t.prototype;return n.next=function(){if(this.RI>=0)return this.jI();for(;null!=this.UI;){var n=this.UI.next();if(null!=n)return n;var i=this.UI.NI.nextSibling;this.UI=null!=i?new t(this.t,i):null}return null},n.jI=function(){var t=this.NI.wholeText;if(this.RI<t.length){var n=this.RI;return this.RI++,{node:this.NI,offset:n}}return null},t}(),St=function(){function t(t,n){var i=this;this.vu=t,this.yh=C(t),this.Th=P(this.vu),this.qI=null;var r,e=O(this.vu.win);"fragmentDirective"in document&&e.isChrome()&&e.getMajorVersion()>=93?t.whenFirstVisible().then((function(){return i.zI(n)})):(r=t.win.document,new Promise((function(t){!function(t,n){!function(t,n,i){var r=n(t);r?i(t):t.addEventListener("readystatechange",(function e(){n(t)&&(r||(r=!0,i(t)),t.removeEventListener("readystatechange",e))}))}(t,ct,n)}(r,t)}))).then((function(){i.LI(n)}))}var n=t.prototype;return n.zI=function(t){var n=t.sentences;if(null!=n&&n.length){var i=n.map((function(t){return"text="+encodeURIComponent(t)})).join("&");this.YI(i)}},n.YI=function(t){var n=this.vu.win.location.hash;n?this.vu.win.location.replace(n+":~:"+t):this.vu.win.location.replace("#:~:"+t)},n.FI=function(t,n){var i={"state":t};for(var r in n)i[r]=n[r];this.yh.sendMessage("highlightState",i)},n.KI=function(t){var n=this.vu.win,i=function(t,n,i){if(i=function(t){for(var n=[],i=0;i<t.length;i++){var r=yt(t[i]);r&&n.push(r)}return n}(i),i.length<=0)return null;for(var r=new Et(t,n),e=new lt(i.map((function(t){return t.length})).reduce((function(t,n){return Math.max(t,n)}))),s=[new gt(i[0],e)],o=-1;;){o++;var u=r.next();if(null==u)return null;if(!pt.test(dt(u))){e.push({pos:u,idx:o});for(var h=0;h<s.length;h++)s[h].update();if(0!=s[s.length-1].matches.length){if(s.length==i.length)break;s.push(new gt(i[s.length],e))}}}var a=[];t:for(var f=i.length-1;f>=0;f--){var c=s[f].matches;if(0!=a.length){for(var v=a[a.length-1],l=c.length-1;l>=0;l--){var d=c[l];if(v.start.idx>=d.end.idx){a.push(d);continue t}}b(!1)}else a.push(c[c.length-1])}for(var p=[],m=a.length-1;m>=0;m--){var y=a[m];p.push({start:y.start.pos,end:y.end.pos})}return p}(n,this.vu.getBody(),t.sentences);if(i){var r=function(t,n){n=function(t){for(var n=[],i=null,r=0;r<t.length;r++){var e=t[r];i&&i.end.node==e.start.node&&i.end.offset==e.start.offset?i.end=e.end:(i=e,n.push(e))}return n}(n);for(var i=[],r=0;r<n.length;r++){var e=n[r];bt(t,e.start,e.end,n,r,i)}return i}(n,i);r&&0!=r.length&&(this.qI=r)}},n.onVisibleOnce=function(t){var n,i,r,e=this;n=!1,i=null,r=t,t=function(){if(!n){for(var t=arguments.length,e=new Array(t),s=0;s<t;s++)e[s]=arguments[s];i=r.apply(self,e),n=!0,r=null}return i},this.vu.onVisibilityChanged((function(){"visible"==e.vu.getVisibilityState()&&t()}))},n.LI=function(t){var n=this;if(this.vu.win.document.querySelector('script[id="amp-access"]'))this.FI("has_amp_access");else if(this.KI(t),this.qI){var i=this.XI();if(this.FI("found",{"scroll":i}),!t.skipRendering){for(var r=0;r<this.qI.length;r++)L(this.qI[r],{backgroundColor:"#fcff00",color:"#000"});var e=this.vu.getVisibilityState();t.skipScrollAnimation?"visible"==e?this.DI(i):(this.Th.setScrollTop(i),this.onVisibleOnce((function(){n.DI(n.XI())}))):"visible"==e?this.VI(i):(this.HI(i),this.onVisibleOnce((function(){n.VI(n.XI())}))),at(this.vu.getBody(),"click",this.JI.bind(this))}}else this.FI("not_found")},n.XI=function(){var t=this.qI;if(!t)return 0;for(var n=this.Th,i=Number.MAX_VALUE,r=0,e=n.getPaddingTop(),s=0;s<t.length;s++){var o=vt(n.getLayoutRect(t[s]),0,-e),u=o.bottom,h=o.top;i=Math.min(i,h),r=Math.max(r,u)}if(i>=r)return 0;var a=(r+i-(n.getHeight()-e))/2;return a>i-80&&(a=i-80),a>0?a:0},n.DI=function(t){this.FI("auto_scroll"),this.Th.setScrollTop(t),this.FI("shown")},n.HI=function(t){var n=Math.max(0,t-500);this.Th.setScrollTop(n)},n.BI=function(t){var n=this.XI(),i=this.Th.getScrollTop();if(i==n&&i==t)return null;var r={};return i!=n&&(this.Th.setScrollTop(n),r.nd=i-n),i!=t&&(r.od=i-t),r},n.VI=function(t){var n=this;this.HI(t);var i=this.vu.win.document.createElement("div");Y(i,"block"),L(i,{"position":"absolute","top":Math.floor(t)+"px","height":"1px","left":"0","width":"1px","pointer-events":"none"});var r=this.vu.getBody();r.appendChild(i),this.FI("auto_scroll"),this.Th.animateScrollIntoView(i).then((function(){r.removeChild(i),n.FI("shown",n.BI(t))}))},n.setupMessaging=function(t){t.registerHandler("highlightDismiss",this.JI.bind(this))},n.JI=function(){if(this.qI)for(var t=0;t<this.qI.length;t++)K(this.qI[t],["backgroundColor","color"])},t}(),At=["key","code","location","ctrlKey","shiftKey","altKey","metaKey","repeat","isComposing","charCode","keyCode","which"],It=function(){function t(t,n){this.win=t,this.H=n,this.GI()}var n=t.prototype;return n.GI=function(){var t=this.WI.bind(this);ut(this.win,"keydown",t),ut(this.win,"keypress",t),ut(this.win,"keyup",t)},n.WI=function(t){(function(t){if(t.defaultPrevented)return!0;if("Escape"==t.key)return!1;switch(t.target.nodeName){case"INPUT":return"checkbox"!=t.target.type||" "==t.key;case"TEXTAREA":case"BUTTON":case"SELECT":case"OPTION":return!0}return t.target.hasAttribute&&t.target.hasAttribute("contenteditable")})(t)||this.AI(t)},n.AI=function(t){this.H.sendRequest(t.type,function(t){var n={};return At.forEach((function(i){void 0!==t[i]&&(n[i]=t[i])})),n}(t),!1)},t}(),_t="amp-viewer-messaging",Mt="channelOpen",Ot="__AMPHTML__";function Ct(t){if("string"!=typeof t)return t;if("{"!=t.charAt(0))return null;try{return JSON.parse(t)}catch(t){return null}}var Pt,Tt,Nt=function(){function t(t,n,i){this.t=t,this.i=n,this.h=i}var n=t.prototype;return n.addEventListener=function(t,n){var i=this;this.t.addEventListener("message",(function(t){t.origin==i.i&&t.source==i.h&&n(t)}))},n.postMessage=function(t){var n="null"===this.i?"*":this.i;this.h.postMessage(t,n)},n.start=function(){},t}(),Rt=function(){function t(t,n,i,r,e){this.t=t,this.o=n,this.u=!!i,this.l=r||null,this.v=!!e,this.p=0,this.g={},this.m={},this.q=null,this.o.addEventListener("message",this._.bind(this)),this.o.start()}t.initiateHandshakeWithDocument=function(n,i){return new Promise((function(r){var e=setInterval((function(){var s=new MessageChannel,o={app:Ot,name:"handshake-poll"};n.postMessage(o,"*",[s.port2]);var u=s.port1;u.addEventListener("message",(function n(s){var o=Ct(s.data);if(o&&o.app===Ot&&o.name===Mt){clearInterval(e),u.removeEventListener("message",n);var h=new t(null,u,!1,i,!0);h.M(o.requestid,Mt,null),r(h)}})),u.start()}),1e3)}))},t.waitForHandshakeFromDocument=function(n,i,r,e,s){return new Promise((function(o){n.addEventListener("message",(function u(h){var a=Ct(h.data);if(a&&(h.origin==r||s&&s.test(h.origin))&&(!h.source||h.source==i)&&a.app===Ot&&a.name===Mt){n.removeEventListener("message",u);var f=new t(null,new Nt(n,h.origin,i),!1,e,!0);f.M(a.requestid,Mt,null),o(f)}}))}))};var n=t.prototype;return n.registerHandler=function(t,n){this.m[t]=n},n.unregisterHandler=function(t){delete this.m[t]},n.setDefaultHandler=function(t){this.q=t},n._=function(t){var n=Ct(t.data);n&&n.app===Ot&&(this.l&&this.v&&n.messagingToken!==this.l?this.O(_t+": handleMessage_ error: ","invalid token"):"q"===n.type?this.P(n):"s"===n.type&&this.R(n))},n.sendRequest=function(t,n,i){var r=this,e=++this.p,s=void 0;return i&&(s=new Promise((function(t,n){r.g[e]={resolve:t,reject:n}}))),this.S({app:Ot,requestid:e,type:"q",name:t,data:n,rsvp:i}),s},n.M=function(t,n,i){this.S({app:Ot,requestid:t,type:"s",name:n,data:i})},n.k=function(t,n,i){var r=this.j(i);this.O(_t+": sendResponseError_, message name: "+n,r),this.S({app:Ot,requestid:t,type:"s",name:n,data:null,error:r})},n.S=function(t){var n=Object.assign(t,{});this.l&&!this.v&&(n.messagingToken=this.l),this.o.postMessage(this.u?JSON.stringify(n):n)},n.P=function(t){var n=this,i=this.m[t.name];if(i||(i=this.q),!i){var r=new Error("Cannot handle request because no default handler is set!");throw r.args=t.name,r}var e=i(t.name,t.data,!!t.rsvp);if(t.rsvp){var s=t.requestid;if(!e)throw this.k(s,t.name,new Error("no response")),new Error("expected response but none given: "+t.name);e.then((function(i){n.M(s,t.name,i)}),(function(i){n.k(s,t.name,i)}))}},n.R=function(t){var n=t.requestid,i=this.g[n];i&&(delete this.g[n],t.error?(this.O(_t+": handleResponse_ error: ",t.error),i.reject(new Error("Request ".concat(t.name," failed: ").concat(t.error)))):i.resolve(t.data))},n.O=function(t,n){if(this.t){var i="amp-messaging-error-logger: "+t;i+=" data: "+this.j(n),this.t.viewerState=i}},n.j=function(t){return t?t.message?t.message:String(t):"unknown error"},t}(),Ut=["altKey","charCode","ctrlKey","detail","eventPhase","key","layerX","layerY","metaKey","pageX","pageY","returnValue","shiftKey","timeStamp","type","which"],jt=["clientX","clientY","force","identifier","pageX","pageY","radiusX","radiusY","screenX","screenY"],qt=function(){function t(t,n){this.win=t,this.H=n,this.ZI=!1,this.$I=[],n.registerHandler("scrollLock",this.QI.bind(this)),this.E_()}var n=t.prototype;return n.E_=function(){var t=this.WI.bind(this),n=this.win.document,i={capture:!1,passive:!this.ZI};this.$I.push(ut(n,"touchstart",t,i),ut(n,"touchend",t,i),ut(n,"touchmove",t,i))},n.rg=function(){this.$I.forEach((function(t){return t()})),this.$I.length=0},n.WI=function(t){switch(t.type){case"touchstart":case"touchend":case"touchmove":this.I_(t);break;default:return}},n.I_=function(t){if(null!=t&&t.shouldViewerCancelPropagation)t.stopImmediatePropagation();else{if(t&&t.type){var n=this.__(t);this.H.sendRequest(t.type,n,!1)}this.ZI&&t.cancelable&&t.preventDefault()}},n.__=function(t){var n=this.M_(t,Ut);return t.touches&&(n.touches=this.O_(t.touches)),t.changedTouches&&(n.changedTouches=this.O_(t.changedTouches)),n},n.O_=function(t){for(var n=[],i=0;i<t.length;i++)n.push(this.M_(t[i],jt));return n},n.M_=function(t,n){for(var i={},r=0;r<n.length;r++){var e=n[r];void 0!==t[e]&&(i[e]=t[e])}return i},n.QI=function(t,n,i){return this.ZI=!!n,this.rg(),this.E_(),i?Promise.resolve({}):void 0},t}(),zt=function(){function t(t){this.zt=t,this.It=0,this.Ct=0,this.Ot=h()}var n=t.prototype;return n.has=function(t){return!!this.Ot[t]},n.get=function(t){var n=this.Ot[t];if(n)return n.access=++this.Ct,n.payload},n.put=function(t,n){this.has(t)||this.It++,this.Ot[t]={payload:n,access:this.Ct},this.qt()},n.qt=function(){if(!(this.It<=this.zt)){var t,n=this.Ot,i=this.Ct+1;for(var r in n){var e=n[r].access;e<i&&(i=e,t=r)}void 0!==t&&(delete n[t],this.It--)}},t}(),Lt=function(){return self.AMP.config.urls}(),Yt=new Set(["c","v","a","ad"]),Ft=function(t){return"string"==typeof t?function(t,n){return Pt||(Pt=self.document.createElement("a"),Tt=self.__AMP_URL_CACHE||(self.__AMP_URL_CACHE=new zt(100))),function(t,n,i){if(i&&i.has(n))return i.get(n);t.href=n,t.protocol||(t.href=t.href);var r,e={href:t.href,protocol:t.protocol,host:t.host,hostname:t.hostname,port:"0"==t.port?"":t.port,pathname:t.pathname,search:t.search,hash:t.hash,origin:null};"/"!==e.pathname[0]&&(e.pathname="/"+e.pathname),("http:"==e.protocol&&80==e.port||"https:"==e.protocol&&443==e.port)&&(e.port="",e.host=e.hostname),r=t.origin&&"null"!=t.origin?t.origin:"data:"!=e.protocol&&e.host?e.protocol+"//"+e.host:e.href,e.origin=r;var s=e;return i&&i.put(n,s),s}(Pt,t,Tt)}(t):t};var Kt="amp-viewer-integration";new(function(){function t(t){this.win=t,this.C_=!1,this.P_=!1,this.N_=null}var n=t.prototype;return n.init=function(){var t=this;w().fine(Kt,"handshake init()");var n=S(this.win.document),i=C(n);this.C_="1"==i.getParam("webview"),this.P_=i.hasCapability("handshakepoll");var r,s=i.getParam("messagingToken"),o=i.getParam("origin")||"";if(!this.C_&&!o)return e();if(P(n).createFixedLayer(et),this.C_||this.P_){var u=(r=this.win).parent&&r.parent!=r?this.win.parent:null;return this.R_(u,o).then((function(r){return t.U_(i,n,o,new Rt(t.win,r,t.C_,s))}))}var a=function(t){var n=function(t){var n,i=h();if(!t)return i;for(;n=f.exec(t);){var r=c(n[1],n[1]),e=n[2]?c(n[2].replace(/\+/g," "),n[2]):"";i[r]=e}return i}(t.win.location.hash).highlight;if(!n||n.length>102400)return null;var i,r=(i=n,JSON.parse(i)),e=r.s;if(!(e instanceof Array)||e.length>15)return null;for(var s=0,o=0;o<e.length;o++){var u=e[o];if("string"!=typeof u||!u)return null;if((s+=u.length)>1500)return null}var a=!1;r.n&&(a=!0);var v=!1;return r.na&&(v=!0),{sentences:e,skipScrollAnimation:v,skipRendering:a}}(n);a&&(this.N_=new St(n,a));var v=new Nt(this.win,o,this.win.parent);return this.U_(i,n,o,new Rt(this.win,v,this.C_,s))},n.R_=function(t,n){var i=this;return new Promise((function(r){var e=ut(i.win,"message",(function(s){w().fine(Kt,"AMPDOC got a pre-handshake message:",s.type,ht(s));var o=Ct(ht(s));if(o&&s.origin===n&&s.source===t&&"__AMPHTML__"==o.app&&"handshake-poll"==o.name){if(i.C_&&(!s.ports||!s.ports.length))throw new Error("Did not receive communication port from the Viewer!");var u=s.ports&&s.ports.length>0?s.ports[0]:new Nt(i.win,n,i.win.parent);r(u),e()}}))}))},n.U_=function(t,n,i,r){var e=this;w().fine(Kt,"Send a handshake request");var s=n.getUrl(),o=function(t){if(!function(t){return Lt.cdnProxyRegex.test(Ft(t).origin)}(t=Ft(t)))return t.href;var n=t.pathname.split("/"),i=n[1];x(Yt.has(i),"Unknown path prefix in url %s",t.href);var r=n[2],e="s"==r?"https://"+decodeURIComponent(n[3]):"http://"+decodeURIComponent(r);return x(e.indexOf(".")>0,"Expected a . in origin %s",e),n.splice(1,"s"==r?3:2),e+n.join("/")+function(t,n){if(!t||"?"==t)return"";var i=new RegExp("[?&]".concat("(amp_(js[^&=]*|gsa|r|kit)|usqp)","\\b[^&]*"),"g"),r=t.replace(i,"").replace(/^[?&]/,"");return r?"?"+r:""}(t.search)+(t.hash||"")}(s);return r.sendRequest("channelOpen",{"url":s,"sourceUrl":o},!0).then((function(){w().fine(Kt,"Channel has been opened!"),e.Am(r,t,i)}))},n.Am=function(t,n,i){t.setDefaultHandler((function(t,i,r){return n.receiveMessage(t,i,r)})),n.setMessageDeliverer(t.sendRequest.bind(t),i),at(this.win,"unload",this.j_.bind(this,t)),(n.hasCapability("swipe")||n.hasCapability("touch"))&&this.q_(t),n.hasCapability("keyboard")&&this.z_(t),n.hasCapability("focus-rect")&&this.L_(t),null!=this.N_&&this.N_.setupMessaging(t)},n.j_=function(t){return t.sendRequest("unloaded",{},!0)},n.L_=function(t){new ft(this.win,t)},n.q_=function(t){new qt(this.win,t)},n.z_=function(t){new It(this.win,t)},t}())(t.win).init()}();
/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */}});
//# sourceMappingURL=amp-viewer-integration-0.1.js.map