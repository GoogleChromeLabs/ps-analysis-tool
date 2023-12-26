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
export const ALLOWED_NUMBER_OF_TABS = 1;
export const WEBPAGE_PORT_NAME = 'psat-webpage';
export const DEVTOOL_PORT_NAME = 'psat-devtool';
export const BLOCKED_REASON_LIST = [
  'SecureOnly',
  'DomainMismatch',
  'NotOnPath',
  'SameSiteStrict',
  'SameSiteLax',
  'SameSiteUnspecifiedTreatedAsLax',
  'SameSiteNoneInsecure',
  'UserPreferences',
  'ThirdPartyPhaseout',
  'ThirdPartyBlockedInFirstPartySet',
  'InvalidDomain',
  'UnknownError',
  'SchemefulSameSiteStrict',
  'SchemefulSameSiteLax',
  'SchemefulSameSiteUnspecifiedTreatedAsLax',
  'SamePartyFromCrossPartyContext',
  'NameValuePairExceedsMaxSize',
  'ExcludeSameSiteUnspecifiedTreatedAsLax',
  'ExcludeSameSiteNoneInsecure',
  'ExcludeSameSiteLax',
  'ExcludeSameSiteStrict',
  'ExcludeInvalidSameParty',
  'ExcludeSamePartyCrossPartyContext',
  'ExcludeDomainNonASCII',
  'ExcludeThirdPartyCookieBlockedInFirstPartySet',
  'ExcludeThirdPartyPhaseout',
];
