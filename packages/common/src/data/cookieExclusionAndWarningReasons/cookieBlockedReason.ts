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
  SameSiteLax: ['body_SameSiteLax'],
  SyntaxError: ['body_SyntaxError'],
  SchemeNotSupported: ['body_SchemeNotSupported'],
  OverwriteSecure: ['body_OverwriteSecure'],
  InvalidPrefix: ['body_InvalidPrefix'],
  SamePartyConflictsWithOtherAttributes: [
    'body_SamePartyConflictsWithOtherAttributes',
  ],
  DisallowedCharacter: ['body_DisallowedCharacter'],
  NoCookieContent: ['body_NoCookieContent'],
};

export default CookieBlockedReason;
