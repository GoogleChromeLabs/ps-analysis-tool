/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Internal dependencies.
 */
import { detectMatchingSignatures } from '..';

describe.skip('detectMatchingSignaturesv1 ', () => {
  it('should return matches', () => {
    const resource = [
      {
        origin:
          'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
        content: `e=this;google.accounts.id.prompt((function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason()||t.getSkippedReason()||t.getDismissedReason()},r=new CustomEvent(H,{detail:n});e.dispatchEvent(r),e.checkIfDesktopAndApplyClass()}))}},{key:"hideOneTap",value:function(){google.accounts.id.cancel()}},{key:"checkIfDesktopAndApplyClass",value:function(){if(!/.*(iPad|iPod|iPhone|Android|BlackBerry).*/.test(navigator.userAgent)){var e=document.getElementById("credential_picker_container");e&&e.classList.add("credential_picker_container--desktop")}}}]),i}(f(EventTarget)),K={exports:{}},G="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";function j(e){this.message=e}function V(e){var t=String(e).replace(/=+$/,"");if(t.length%4==1)throw new j("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,r,i=0,o=0,a="";r=t.charAt(o++);~r&&(n=i%4?64*n+r:r,i++%4)?a+=String.fromCharCode(255&n>>(-2*i&6)):0)r=G.indexOf(r);return a}j.prototype=new Error,j.prototype.name="InvalidCharacterError";var z="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||V;function W(e){return decodeURIComponent(z(e).replace(/(.)/g,(function(e,t){var n=t.charCodeAt(0).toString(16).toUpperCase();return n.length<2&&(n="0"+n),"%"+n})))}var J=function(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return W(t)}catch(e){return z(t)}};function Q(e){this.message=e}Q.prototype=new Error,Q.prototype.name="InvalidTokenError",K.exports=function(e,t){if("string"!=typeof e)throw new Q("Invalid token specified");var n=!0===(t=t||{}).header?0:1;try{return JSON.parse(J(e.split(".")[n]))}catch(e){throw new Q("Invalid token specified: "+e.message)}},K.exports.InvalidTokenError=Q;var Y=K.exports,X=w.GOOGLE_USER_FETCHED,Z=w.PROMPT_MOMENT,$=function(e){s(i,e);var n=v(i);function i(e){var r,o=e.autoSelect,a=void 0!==o&&o,s=e.buttonParentEl,c=e.cancelOnTapOutside,u=void 0===c||c,l=e.clientId,d=void 0===l?E:l,h=e.context,f=void 0===h?"signin":h,g=e.gsiButtonConfig,v=void 0===g?{}:g,w=e.libSrcPath,I=e.hasContentAbove,T=void 0!==I&&I,C=e.promptParentId,_=e.showOneTap,S=void 0===_||_;if(t(this,i),(r=n.call(this)).autoSelect=a,r.buttonParentEl=s,r.cancelOnTapOutside=u,r.clientId=d,r.context=f,r.gsiButtonConfig=v,r.isLibraryLoaded=b(),r.libSrcPath=w,r.hasContentAbove=T,r.promptParentId=C,r.showOneTap=S,window.google&&window.google.accounts&&window.google.accounts.id)r._onGoogleApiLoad();else{if(!w)throw TypeError("GSI lib is not already loaded on the page. libSrcPath is required to load the library");m((function(){y(w,r._onGoogleApiLoad.bind(p(r)))}))}return r}return r(i,[{key:"_onGoogleApiLoad",value:function(){var e=this;return this.isLibraryLoaded.resolve(),window.google.accounts.id.initialize({auto_select:this.autoSelect,client_id:this.clientId,prompt_parent_id:this.promptParentId,callback:this._handleCredentialResponse.bind(this),cancel_on_tap_outside:this.cancelOnTapOutside,context:P[this.context].GOT}),Promise.resolve().then((function(){return e.showGsiUI()}))}},{key:"showGsiUI",value:function(){this.buttonParentEl&&this.renderGSIButton(this.buttonParentEl,this.gsiButtonConfig),this.showOneTap&&this.promptOneTap()}},{key:"renderGSIButton",value:function(e,t){var n=this,r=t.locale,i=void 0===r?"en_US":r,o=t.logo_alignment,a=void 0===o?"center":o,s=t.shape,c=void 0===s?"pill":s,u=t.size,l=void 0===u?"large":u,d=t.text,h=t.theme,f=t.type,p=t.width,g=void 0===p?"400px":p;return this.isLibraryLoaded.then((function(){var t=d||P[n.context].GSI_BUTTON;window.google.accounts.id.renderButton(e,{locale:i,logo_alignment:a,shape:c,size:l,text:t,theme:h,type:f,width:g})}))}},{key:"promptOneTap",value:function(){var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt((function(t){var n="}]`,
      },
    ];
    expect(detectMatchingSignatures(resource)).toEqual({
      gis: {
        signatureMatches: 2,
        matches: [
          {
            feature: {
              text: 'google.accounts.id.prompt(',
              type: 'link',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              items: [
                {
                  snippet: 'e=this;google.accounts.id.prompt(',
                  sourceLocation: 'inline source',
                },
                {
                  snippet:
                    'var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt(',
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                },
              ],
              type: 'subitems',
            },
          },
          {
            feature: {
              text: 'getNotDisplayedReason(',
              type: 'link',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              items: [
                {
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                },
              ],
              type: 'subitems',
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 0,
        moduleMatch: 0,
        matches: [],
      },
    });
  });
});
