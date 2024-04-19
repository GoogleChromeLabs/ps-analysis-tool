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
import { I18n } from '@ps-analysis-tool/i18n';

interface LegendData {
  [key: string]: string;
}

export const LEGEND_DESCRIPTION: LegendData = {
  Functional:
    'Cookies necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size, etc.)',
  Marketing:
    "Cookies used to track visitors across websites, gathering information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
  Analytics:
    'Cookies used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site.',
  Uncategorized:
    'Cookies that could not be categorized. You may check sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
  SecureOnly: I18n.getFormattedMessages(['body_SecureOnly']),
  NotOnPath: I18n.getFormattedMessages(['body_NotOnPath']),
  DomainMismatch: I18n.getFormattedMessages(['body_DomainMismatch']),
  SameSiteStrict: I18n.getFormattedMessages(['body_SameSiteStrict']),
  SameSiteUnspecifiedTreatedAsLax: I18n.getFormattedMessages([
    'body_SameSiteUnspecifiedTreatedAsLax',
  ]),
  SameSiteNoneInsecure: I18n.getFormattedMessages([
    'body_SameSiteNoneInsecure',
  ]),
  UserPreferences: I18n.getFormattedMessages(['body_UserPreferences']),
  ThirdPartyPhaseout: I18n.getFormattedMessages(['body_ThirdPartyPhaseout']),
  ThirdPartyBlockedInFirstPartySet: I18n.getFormattedMessages([
    'body_ThirdPartyBlockedInFirstPartySet',
  ]),
  UnknownError: I18n.getFormattedMessages(['body_UnknownError']),
  SchemefulSameSiteStrict: I18n.getFormattedMessages([
    'body_SchemefulSameSiteStrict',
  ]),
  SchemefulSameSiteLax: I18n.getFormattedMessages([
    'body_SchemefulSameSiteLax',
  ]),
  SchemefulSameSiteUnspecifiedTreatedAsLax: I18n.getFormattedMessages([
    'body_SchemefulSameSiteUnspecifiedTreatedAsLax',
  ]),
  SamePartyFromCrossPartyContext: I18n.getFormattedMessages([
    'body_SamePartyFromCrossPartyContext',
  ]),
  NameValuePairExceedsMaxSize: I18n.getFormattedMessages([
    'body_NameValuePairExceedsMaxSize',
  ]),
  InvalidDomain: I18n.getFormattedMessages(['body_InvalidDomain']),
  ExcludeSameSiteNoneInsecure: I18n.getFormattedMessages([
    'header_ExcludeSameSiteNoneInsecure',
    'body_ExcludeSameSiteNoneInsecure',
  ]),
  ExcludeSameSiteLax: I18n.getMessage('dsSomethingWentWrong'),
  ExcludeSameSiteStrict: I18n.getMessage('dsSomethingWentWrong'),
  ExcludeInvalidSameParty: I18n.getFormattedMessages([
    'header_ExcludeInvalidSameParty',
    'body_ExcludeInvalidSameParty',
  ]),
  ExcludeSamePartyCrossPartyContext: I18n.getFormattedMessages([
    'header_ExcludeSamePartyCrossPartyContext',
    'body_ExcludeSamePartyCrossPartyContext',
  ]),
  ExcludeDomainNonASCII: I18n.getFormattedMessages([
    'header_ExcludeDomainNonASCII',
    'body_1_ExcludeDomainNonASCII',
    'body_2_ExcludeDomainNonASCII',
    'body_3_ExcludeDomainNonASCII',
  ]),
  ExcludeThirdPartyCookieBlockedInFirstPartySet: I18n.getFormattedMessages([
    'header_ExcludeThirdPartyCookieBlockedInFirstPartySet',
    'body_ExcludeThirdPartyCookieBlockedInFirstPartySet',
  ]),
  ExcludeThirdPartyPhaseout: I18n.getFormattedMessages([
    'body_ExcludeThirdPartyPhaseout',
  ]),
  'Total frames': I18n.getMessage('dsTotalFramesNote'),
  'Frames with cookies': I18n.getMessage('dsFramesWithCookiesNote'),
  'Frames with blocked cookies': I18n.getMessage(
    'dsFramesWithBlockedCookiesNote'
  ),
  'Frames with unblocked cookies': I18n.getMessage(
    'dsFramesWithUnblockedCookiesNote'
  ),
  'Fenced frames': I18n.getMessage('dsFencedFramesNote'),
  UserSetting: I18n.getMessage('exemptionReasonUserSetting'),
  TPCDMetadata: I18n.getMessage('exemptionReasonTPCDMetadata'),
  TPCDDeprecationTrial: I18n.getMessage('exemptionReasonTPCDDeprecationTrial'),
  TPCDHeuristics: I18n.getMessage('exemptionReasonTPCDHeuristics'),
  EnterprisePolicy: I18n.getMessage('exemptionReasonEnterprisePolicy'),
  StorageAccessAPI: I18n.getMessage('exemptionReasonStorageAccessAPI'),
  TopLevelStorageAccessAPI: I18n.getMessage(
    'exemptionReasonTopLevelStorageAccessAPI'
  ),
  CorsOptIn: I18n.getMessage('exemptionReasonCorsOptIn'),
};

export const EMPTY_FRAME_COUNT = [
  {
    title: I18n.getMessage('dsFrames'),
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
    label: I18n.getMessage('dsTotalFrames'),
    count: 0,
    color: '#25ACAD',
    countClassName: 'text-greenland-green',
  },
  {
    label: I18n.getMessage('dsFramesWithCookies'),
    count: 0,
    color: '#C5A06A',
    countClassName: 'text-good-life',
  },
  {
    label: I18n.getMessage('dsFramesWithBlockedCookies'),
    count: 0,
    color: '#AF7AA3',
    countClassName: 'text-victorian-violet',
  },
  {
    label: I18n.getMessage('dsFramesWithUnblockedCookies'),
    count: 0,
    color: '#F54021',
    countClassName: 'text-strawberry-spinach-red',
  },
];
