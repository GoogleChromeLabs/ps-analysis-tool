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

import { CookieStatsComponents, CookiesCount } from '../cookies.types';
import { COLOR_MAP, BLOCKED_COLOR_MAP } from '../constants';

// eslint-disable-next-line complexity
const prepareCookieStatsComponents = (
  cookieStats: CookiesCount
): CookieStatsComponents => {
  const blockedCookiesStats: CookieStatsComponents['blocked'] = [];

  Object.keys(cookieStats.blockedCookies).forEach((key) => {
    if (key === 'total') {
      return;
    }
    blockedCookiesStats.push({
      count: cookieStats.blockedCookies[key],
      //@ts-ignore
      color: BLOCKED_COLOR_MAP[key],
    });
  });

  return {
    legend: [
      {
        label: 'Functional',
        count:
          cookieStats.firstParty.functional + cookieStats.thirdParty.functional,
        color: COLOR_MAP.functional,
        countClassName: 'text-functional',
      },
      {
        label: 'Marketing',
        count:
          cookieStats.firstParty.marketing + cookieStats.thirdParty.marketing,
        color: COLOR_MAP.marketing,
        countClassName: 'text-marketing',
      },
      {
        label: 'Analytics',
        count:
          cookieStats.firstParty.analytics + cookieStats.thirdParty.analytics,
        color: COLOR_MAP.analytics,
        countClassName: 'text-analytics',
      },
      {
        label: 'Uncategorized',
        count:
          cookieStats.firstParty.uncategorized +
          cookieStats.thirdParty.uncategorized,
        color: COLOR_MAP.uncategorized,
        countClassName: 'text-uncategorized',
      },
    ],
    firstParty: [
      {
        count: cookieStats.firstParty.functional,
        color: COLOR_MAP.functional,
      },
      {
        count: cookieStats.firstParty.marketing,
        color: COLOR_MAP.marketing,
      },
      {
        count: cookieStats.firstParty.analytics,
        color: COLOR_MAP.analytics,
      },
      {
        count: cookieStats.firstParty.uncategorized,
        color: COLOR_MAP.uncategorized,
      },
    ],
    thirdParty: [
      {
        count: cookieStats.thirdParty.functional,
        color: COLOR_MAP.functional,
      },
      {
        count: cookieStats.thirdParty.marketing,
        color: COLOR_MAP.marketing,
      },
      {
        count: cookieStats.thirdParty.analytics,
        color: COLOR_MAP.analytics,
      },
      {
        count: cookieStats.thirdParty.uncategorized,
        color: COLOR_MAP.uncategorized,
      },
    ],
    blocked: blockedCookiesStats,
    blockedCookiesLegend: [
      {
        label: 'SecureOnly',
        color: '#A98307',
        countClassName: 'text-secureonly',
        count: cookieStats.blockedCookies?.SecureOnly,
      },
      {
        label: 'DomainMismatch',
        color: '#7D8471',
        countClassName: 'text-domainmismatch',
        count: cookieStats.blockedCookies?.DomainMismatch,
      },
      {
        label: 'NotOnPath',
        color: '#79553D',
        countClassName: 'text-notonpath',
        count: cookieStats.blockedCookies?.NotOnPath,
      },
      {
        label: 'SameSiteStrict',
        color: '#AF2B1E',
        countClassName: 'text-samesitestrict',
        count: cookieStats.blockedCookies?.SameSiteStrict,
      },
      {
        label: 'SameSiteLax',
        color: '#FFA420',
        countClassName: 'text-samesitelax',
        count: cookieStats.blockedCookies?.SameSiteLax,
      },
      {
        label: 'SameSiteUnspecifiedTreatedAsLax',
        color: '#FF7514',
        countClassName: 'text-samesiteunspecifiedtreatedaslax',
        count: cookieStats.blockedCookies?.SameSiteUnspecifiedTreatedAsLax,
      },
      {
        label: 'SameSiteNoneInsecure',
        color: '#924E7D',
        countClassName: 'text-samesitenoneinsecure',
        count: cookieStats.blockedCookies?.SameSiteNoneInsecure,
      },
      {
        label: 'UserPreferences',
        color: '#E63244',
        countClassName: 'text-userpreferences',
        count: cookieStats.blockedCookies?.UserPreferences,
      },
      {
        label: 'ThirdPartyPhaseout',
        count: cookieStats.blockedCookies?.ThirdPartyPhaseout,
        color: '#999950',
        countClassName: 'text-thirdpartyphaseout',
      },
      {
        label: 'ThirdPartyBlockedInFirstPartySet',
        color: '#DE4C8A',
        countClassName: 'text-thirdpartyblockedinfirstpartyset',
        count: cookieStats.blockedCookies?.ThirdPartyBlockedInFirstPartySet,
      },
      {
        label: 'UnknownError',
        color: '#DE4C8A',
        countClassName: 'text-unknownerror',
        count: cookieStats.blockedCookies?.UnknownError,
      },
      {
        label: 'SchemefulSameSiteStrict',
        color: '#763C28',
        countClassName: 'text-schemefulsamesitestrict',
        count: cookieStats.blockedCookies?.SchemefulSameSiteStrict,
      },
      {
        label: 'SchemefulSameSiteLax',
        color: '#C6A664',
        countClassName: 'text-schemefulsamesitelax',
        count: cookieStats.blockedCookies?.SchemefulSameSiteLax,
      },
      {
        label: 'SchemefulSameSiteUnspecifiedTreatedAsLax',
        color: '#E7EBDA',
        countClassName: 'text-schemefulsamesiteunspecifiedtreatedaslax',
        count:
          cookieStats.blockedCookies
            ?.SchemefulSameSiteUnspecifiedTreatedAsLax ?? 0,
      },
      {
        label: 'SamePartyFromCrossPartyContext',
        color: '#008F39',
        countClassName: 'text-samepartyfromcrosspartycontext',
        count: cookieStats.blockedCookies?.SamePartyFromCrossPartyContext,
      },
      {
        label: 'NameValuePairExceedsMaxSize',
        color: '#1C542D',
        countClassName: 'text-namevaluepairexceedsmaxsize',
        count: cookieStats.blockedCookies?.NameValuePairExceedsMaxSize,
      },
      {
        label: 'ExcludeSameSiteUnspecifiedTreatedAsLax',
        color: '#1C542D',
        countClassName: 'text-excludesamesiteunspecifiedtreatedaslax',
        count:
          cookieStats.blockedCookies?.ExcludeSameSiteUnspecifiedTreatedAsLax ??
          0,
      },
      {
        label: 'ExcludeSameSiteNoneInsecure',
        color: '#EDFF21',
        countClassName: 'text-excludesamesitenoneinsecure',
        count: cookieStats.blockedCookies?.ExcludeSameSiteNoneInsecure,
      },
      {
        label: 'ExcludeSameSiteLax',
        color: '#A5A5A5',
        countClassName: 'text-excludesamesitelax',
        count: cookieStats.blockedCookies?.ExcludeSameSiteLax,
      },
      {
        label: 'ExcludeSameSiteStrict',
        color: '#256D7B',
        countClassName: 'text-excludesamesitestrict',
        count: cookieStats.blockedCookies?.ExcludeSameSiteStrict,
      },
      {
        label: 'ExcludeInvalidSameParty',
        color: '#898176',
        countClassName: 'text-excludeinvalidsameparty',
        count: cookieStats.blockedCookies?.ExcludeInvalidSameParty,
      },
      {
        label: 'ExcludeSamePartyCrossPartyContext',
        color: '#497E76',
        countClassName: 'text-excludesamepartycrosspartycontext',
        count: cookieStats.blockedCookies?.ExcludeSamePartyCrossPartyContext,
      },
      {
        label: 'ExcludeDomainNonASCII',
        color: '#7FB5B5',
        countClassName: 'text-excludedomainnonascii',
        count: cookieStats.blockedCookies?.ExcludeDomainNonASCII,
      },
      {
        label: 'ExcludeThirdPartyCookieBlockedInFirstPartySet',
        color: '#EFA94A',
        countClassName: 'text-excludethirdpartycookieblockedinfirstpartyset',
        count:
          cookieStats.blockedCookies
            ?.ExcludeThirdPartyCookieBlockedInFirstPartySet,
      },
      {
        label: 'ExcludeThirdPartyPhaseout',
        count: cookieStats.blockedCookies?.ExcludeThirdPartyPhaseout,
        color: '#CF3476',
        countClassName: 'text-excludethirdpartyphaseout',
      },
    ],
  };
};

export default prepareCookieStatsComponents;
