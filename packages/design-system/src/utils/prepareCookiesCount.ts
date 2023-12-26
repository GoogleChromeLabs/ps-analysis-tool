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
import type { CookieData, CookiesCount } from '@ps-analysis-tool/common';

/**
 * Categorize cookies count into 1st party and 3rd party cookies and then into functional, marketing, analytics and uncategorized.
 * @param {{ [key: string]: CookieData }} cookies Cookies of a tab.
 * @returns CookiesCount object with the categorized cookies count.
 */
const prepareCookiesCount = (cookies: { [key: string]: CookieData } | null) => {
  const cookiesCount: CookiesCount = {
    total: 0,
    blockedCookies: {
      total: 0,
    },
    firstParty: {
      total: 0,
      functional: 0,
      marketing: 0,
      analytics: 0,
      uncategorized: 0,
    },
    thirdParty: {
      total: 0,
      functional: 0,
      marketing: 0,
      analytics: 0,
      uncategorized: 0,
    },
  };

  if (!cookies) {
    return cookiesCount;
  }

  const cookieList = Object.values(cookies).filter(
    (cookie) => cookie.parsedCookie && cookie.frameIdList?.length >= 1
  );

  cookiesCount.total = Object.keys(cookies).filter(
    (cookieKey) =>
      cookies[cookieKey].parsedCookie &&
      cookies[cookieKey].frameIdList?.length >= 1
  ).length;

  cookiesCount.blockedCookies.total = cookieList.filter(
    (cookie) =>
      cookie.isBlocked ||
      (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
  ).length;

  cookieList.forEach((cookie) => {
    if (cookie.blockedReasons && cookie.blockedReasons?.length > 0) {
      cookie.blockedReasons?.forEach((reason) => {
        if (!cookiesCount.blockedCookies[reason]) {
          cookiesCount.blockedCookies[reason] = 1;
        } else {
          cookiesCount.blockedCookies[reason]++;
        }
      });
    }
  });

  for (const cookie of cookieList) {
    const { analytics, isFirstParty } = cookie;
    const category = analytics?.category?.toLowerCase() as
      | keyof CookiesCount['firstParty']
      | keyof CookiesCount['thirdParty']
      | undefined;

    if (isFirstParty) {
      cookiesCount.firstParty.total++;
      cookiesCount.firstParty[category ? category : 'uncategorized']++;
    } else {
      cookiesCount.thirdParty.total++;
      cookiesCount.thirdParty[category ? category : 'uncategorized']++;
    }
  }
  return cookiesCount;
};

export default prepareCookiesCount;
