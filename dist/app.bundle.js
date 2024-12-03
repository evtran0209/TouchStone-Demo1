/*! For license information please see app.bundle.js.LICENSE.txt */
(()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";e=function(){return n};var r,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof w?e:w,i=Object.create(o.prototype),c=new C(n||[]);return a(i,"_invoke",{value:_(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",g="completed",m={};function w(){}function x(){}function b(){}var k={};f(k,u,(function(){return this}));var L=Object.getPrototypeOf,E=L&&L(L(G([])));E&&E!==o&&i.call(E,u)&&(k=E);var O=b.prototype=w.prototype=Object.create(k);function j(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(e,r){function n(o,a,c,u){var s=p(e[o],e,a);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==t(f)&&i.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):r.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,u)}))}u(s.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(i,i):i()}})}function _(t,e,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:r,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=N(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=p(t,e,n);if("normal"===s.type){if(o=n.done?g:v,s.arg===m)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=g,n.method="throw",n.arg=s.arg)}}}function N(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,N(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=p(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,m;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function C(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[u];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return x.prototype=b,a(O,"constructor",{value:b,configurable:!0}),a(b,"constructor",{value:x,configurable:!0}),x.displayName=f(b,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,f(t,l,"GeneratorFunction")),t.prototype=Object.create(O),t},n.awrap=function(t){return{__await:t}},j(S.prototype),f(S.prototype,s,(function(){return this})),n.AsyncIterator=S,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new S(h(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(O),f(O,l,"Generator"),f(O,u,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=G,C.prototype={constructor:C,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(T),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),s=i.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:G(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,i){var a=t.apply(e,n);function c(t){r(a,o,i,c,u,"next",t)}function u(t){r(a,o,i,c,u,"throw",t)}c(void 0)}))}}!function(){"use strict";var t=null;function r(){return o.apply(this,arguments)}function o(){return(o=n(e().mark((function r(){var o;return e().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,ZAFClient.init();case 3:return t=r.sent,console.log("Widget initialized"),t.on("ticket.conversation.changed",i),t.on("ticket.save",n(e().mark((function r(){var n;return e().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Ticket saved event triggered"),e.next=3,t.get("ticket");case 3:n=e.sent,console.log("Current ticket:",n);case 5:case"end":return e.stop()}}),r)})))),r.next=9,t.get("ticket");case 9:if(!(o=r.sent)||!o.ticket){r.next=13;break}return r.next=13,c(o.ticket);case 13:r.next=18;break;case 15:r.prev=15,r.t0=r.catch(0),console.error("Failed to initialize widget:",r.t0);case 18:case"end":return r.stop()}}),r,null,[[0,15]])})))).apply(this,arguments)}function i(){return a.apply(this,arguments)}function a(){return(a=n(e().mark((function r(){var n;return e().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.get("ticket");case 2:if(!(n=e.sent)||!n.ticket){e.next=6;break}return e.next=6,c(n.ticket);case 6:case"end":return e.stop()}}),r)})))).apply(this,arguments)}function c(t){return u.apply(this,arguments)}function u(){return(u=n(e().mark((function r(n){var o,i,a,c;return e().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.get("ticket.comments");case 3:if((o=e.sent)&&o.comments&&o.comments.length){e.next=6;break}return e.abrupt("return");case 6:return i=o.comments[o.comments.length-1],e.next=9,fetch("".concat("https://0004-168-92-227-70.ngrok-free.app","/api/analyze"),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({comment:i.body})});case 9:if((a=e.sent).ok){e.next=13;break}return console.error("Analysis failed:",a.status),e.abrupt("return",[]);case 13:return e.next=15,a.json();case 15:c=e.sent,console.log("Analysis response:",c),s(c.risks),e.next=23;break;case 20:e.prev=20,e.t0=e.catch(0),console.error("Analysis error:",e.t0);case 23:case"end":return e.stop()}}),r,null,[[0,20]])})))).apply(this,arguments)}function s(t){var e=document.getElementById("identitySection").querySelector(".bullet-points");if(e.innerHTML="",0===t.length){var r=document.createElement("li");r.textContent="No risks detected",r.className="no-triggers",e.appendChild(r)}else t.forEach((function(t){var r=document.createElement("li");r.textContent=t.message,r.className="risk-".concat(t.level),e.appendChild(r)}))}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",r):r()}()})();