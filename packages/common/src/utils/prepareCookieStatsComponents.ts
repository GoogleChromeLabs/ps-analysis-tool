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
import {
  COLOR_MAP,
  BLOCKED_COLOR_MAP,
  BLOCKED_REASON_LIST,
} from '../constants';

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

  const blockedCookiesLegend: CookieStatsComponents['blockedCookiesLegend'] =
    [];

  BLOCKED_REASON_LIST.forEach((reason) => {
    blockedCookiesLegend.push({
      label: reason,
      count: cookieStats.blockedCookies[reason] ?? 0,
      //@ts-ignore
      color: BLOCKED_COLOR_MAP[reason],
      countClassName: 'text-' + reason.toLowerCase(),
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
