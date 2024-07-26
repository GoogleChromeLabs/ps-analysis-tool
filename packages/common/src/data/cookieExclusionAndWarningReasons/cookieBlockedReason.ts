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
//out/win-Debug/gen/third_party/devtools-frontend/src/front_end/core/sdk/NetworkRequest.js
const CookieBlockedReason = {
  SecureOnly: ['body_SecureOnly'],
  NotOnPath: ['body_NotOnPath'],
  DomainMismatch: ['body_DomainMismatch'],
  SameSiteStrict: ['body_SameSiteStrict'],
  SameSiteUnspecifiedTreatedAsLax: ['body_SameSiteUnspecifiedTreatedAsLax'],
  SameSiteNoneInsecure: ['body_SameSiteNoneInsecure'],
  UserPreferences: ['body_UserPreferences'],
  ThirdPartyPhaseout: ['body_ThirdPartyPhaseout'],
  ThirdPartyBlockedInFirstPartySet: ['body_ThirdPartyBlockedInFirstPartySet'],
  UnknownError: ['body_UnknownError'],
  SchemefulSameSiteStrict: ['body_SchemefulSameSiteStrict'],
  SchemefulSameSiteLax: ['body_SchemefulSameSiteLax'],
  SchemefulSameSiteUnspecifiedTreatedAsLax: [
    'body_SchemefulSameSiteUnspecifiedTreatedAsLax',
  ],
  SamePartyFromCrossPartyContext: ['body_SamePartyFromCrossPartyContext'],
  NameValuePairExceedsMaxSize: ['body_NameValuePairExceedsMaxSize'],
  InvalidDomain: ['body_InvalidDomain'],
  SameSiteLax:
    "This cookie was blocked because it had the 'SameSite=Lax' attribute and the request was made from a different site and was not initiated by a top-level navigation.",
  SyntaxError: "This 'Set-Cookie' header had invalid syntax.",
  SchemeNotSupported:
    'The scheme of this connection is not allowed to store cookies.',
  OverwriteSecure:
    "This attempt to set a cookie via a 'Set-Cookie' header was blocked because it was not sent over a secure connection and would have overwritten a cookie with the Secure attribute.",
  InvalidPrefix:
    "This attempt to set a cookie via a 'Set-Cookie' header was blocked because it used the '__Secure-' or '__Host-' prefix in its name and broke the additional rules applied to cookies with these prefixes.",
  SamePartyConflictsWithOtherAttributes:
    "This attempt to set a cookie via a 'Set-Cookie' header was blocked because it had the 'SameParty' attribute but also had other conflicting attributes. Chrome requires cookies that use the 'SameParty' attribute to also have the 'Secure' attribute, and to not be restricted to 'SameSite=Strict'.",
  DisallowedCharacter:
    "This 'Set-Cookie' header contained a disallowed character (a forbidden ASCII control character, or the tab character if it appears in the middle of the cookie name, value, an attribute name, or an attribute value).",
  NoCookieContent:
    "This attempt to set a cookie via a 'Set-Cookie' header was blocked because the header did not contain any value.",
};

export default CookieBlockedReason;
