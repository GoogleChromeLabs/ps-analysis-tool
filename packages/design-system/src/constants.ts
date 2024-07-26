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
 * External dependencies.
 */
import { I18n } from '@google-psat/i18n';

interface LegendData {
  [key: string]: string | string[];
}

export const LEGEND_DESCRIPTION: LegendData = {
  Functional: 'functionalNote',
  Marketing: 'marketingNote',
  Analytics: 'analyticsNote',
  Uncategorized: 'uncategorizedNote',
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
  ExcludeSameSiteNoneInsecure: [
    'header_ExcludeSameSiteNoneInsecure',
    'body_ExcludeSameSiteNoneInsecure',
  ],
  ExcludeSameSiteLax: 'somethingWentWrong',
  ExcludeSameSiteStrict: 'somethingWentWrong',
  ExcludeInvalidSameParty: [
    'header_ExcludeInvalidSameParty',
    'body_ExcludeInvalidSameParty',
  ],
  ExcludeSamePartyCrossPartyContext: [
    'header_ExcludeSamePartyCrossPartyContext',
    'body_ExcludeSamePartyCrossPartyContext',
  ],
  ExcludeDomainNonASCII: [
    'header_ExcludeDomainNonASCII',
    'body_1_ExcludeDomainNonASCII',
    'body_2_ExcludeDomainNonASCII',
    'body_3_ExcludeDomainNonASCII',
  ],
  ExcludeThirdPartyCookieBlockedInFirstPartySet: [
    'header_ExcludeThirdPartyCookieBlockedInFirstPartySet',
    'body_ExcludeThirdPartyCookieBlockedInFirstPartySet',
  ],
  ExcludeThirdPartyPhaseout: ['body_ExcludeThirdPartyPhaseout'],
  'Total frames': 'totalFramesNote',
  'Frames with cookies': 'framesWithCookiesNote',
  'Frames with blocked cookies': 'framesWithBlockedCookiesNote',
  'Frames with unblocked cookies': 'framesWithUnblockedCookiesNote',
  'Fenced frames': 'fencedFramesNote',
  UserSetting: 'exemptionReasonUserSetting',
  TPCDMetadata: 'exemptionReasonTPCDMetadata',
  TPCDDeprecationTrial: 'exemptionReasonTPCDDeprecationTrial',
  TPCDHeuristics: 'exemptionReasonTPCDHeuristics',
  EnterprisePolicy: 'exemptionReasonEnterprisePolicy',
  StorageAccessAPI: 'exemptionReasonStorageAccessAPI',
  TopLevelStorageAccessAPI: 'exemptionReasonTopLevelStorageAccessAPI',
  CorsOptIn: 'exemptionReasonCorsOptIn',
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
    "This attempt to set a cookie via a 'Set-Cookie' header was blocked beacuse the header did not contain any value.",
};

export const EMPTY_FRAME_COUNT = [
  {
    title: I18n.getMessage('frames'),
    count: 0,
    data: [
      {
        count: 0,
        color: '#F54021',
      },
      {
        count: 0,
        color: '#AF7AA3',
      },
      {
        count: 0,
        color: '#C5A06A',
      },
    ],
  },
];

export const EMPTY_FRAME_LEGEND = [
  {
    label: I18n.getMessage('totalFrames'),
    descriptionKey: 'Total frames',
    count: 0,
    color: '#25ACAD',
    countClassName: 'text-greenland-green',
  },
  {
    label: I18n.getMessage('framesWithCookies'),
    descriptionKey: 'Frames with cookies',
    count: 0,
    color: '#C5A06A',
    countClassName: 'text-good-life',
  },
  {
    label: I18n.getMessage('framesWithBlockedCookies'),
    descriptionKey: 'Frames with blocked cookies',
    count: 0,
    color: '#AF7AA3',
    countClassName: 'text-victorian-violet',
  },
  {
    label: I18n.getMessage('framesWithUnblockedCookies'),
    descriptionKey: 'Frames with unblocked cookies',
    count: 0,
    color: '#F54021',
    countClassName: 'text-strawberry-spinach-red',
  },
];
