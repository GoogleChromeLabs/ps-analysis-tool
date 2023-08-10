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
import type { CookieData } from '../localStore';
import type { CookieStats } from '../view/popup/types';
import isFirstParty from './isFirstParty';

/**
 * Categorize cookies count into 1st party and 3rd party cookies and into functional, marketing, analytics and Uncategorized.
 * @param {{ [key: string]: CookieData }} cookies Cookies of a tab.
 * @param {string} tabUrl Tab URL
 * @returns CookieStats object with the categorized cookies count.
 */
const PrepareCookieStatsByCategory = (
  cookies: { [key: string]: CookieData } | null,
  tabUrl: string | null
) => {
  const stats: CookieStats = {
    total: 0,
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

  if (!cookies || !tabUrl) {
    return stats;
  }

  const cookieList = Object.values(cookies);

  stats.total = cookieList.length;

  for (const cookie of cookieList) {
    const {
      analytics,
      parsedCookie: { domain },
    } = cookie;
    const isFirstPartyCookie = isFirstParty(domain, tabUrl);
    const category = analytics?.category?.toLowerCase() as
      | keyof CookieStats['firstParty']
      | keyof CookieStats['thirdParty']
      | undefined;

    if (isFirstPartyCookie) {
      stats.firstParty.total++;
      stats.firstParty[category ? category : 'uncategorized']++;
    } else {
      stats.thirdParty.total++;
      stats.thirdParty[category ? category : 'uncategorized']++;
    }
  }
  return stats;
};

export default PrepareCookieStatsByCategory;
