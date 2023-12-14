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
import type {
  CookieStatsComponents,
  CookiesCount,
} from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import { COLOR_MAP } from '../theme/colors';

// eslint-disable-next-line complexity
const prepareCookieStatsComponents = (
  cookieStats: CookiesCount
): CookieStatsComponents => {
  const blockedCookiesStats: CookieStatsComponents['blocked'] = [];
  const blockedCookiesLegend: CookieStatsComponents['blockedCookiesLegend'] =
    [];

  Object.keys(cookieStats.blockedCookies).forEach((key: string) => {
    if (key === 'total') {
      return;
    }

    blockedCookiesStats.push({
      count: cookieStats.blockedCookies[key],
      color: COLOR_MAP[key],
    });

    blockedCookiesLegend.push({
      label: key,
      count: cookieStats.blockedCookies[key],
      color: COLOR_MAP[key],
      countClassName: 'text-' + key.toLowerCase(),
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
    blockedCookiesLegend,
  };
};

export default prepareCookieStatsComponents;
