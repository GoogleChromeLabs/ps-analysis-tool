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
import type { CookieData } from '../../localStore';
import isFirstParty from '../../utils/isFirstParty';
import type { CookieStats } from './app';

export const emptyStats: CookieStats = {
  total: 0,
  firstParty: {
    total: 0,
    functional: 0,
    marketing: 0,
    analytics: 0,
    unknown: 0,
  },
  thirdParty: {
    total: 0,
    functional: 0,
    marketing: 0,
    analytics: 0,
    unknown: 0,
  },
};

/**
 * Categorize cookies count into 1st party and 3rd party cookies and into functional, marketing, analytics and unknown.
 * @param {{ [key: string]: CookieData }} cookies Cookies of a tab.
 * @param {string } tabUrl Tab URL
 * @returns CookieStats object with the categorized cookies count.
 */
const countCookiesByCategory = (
  cookies: { [key: string]: CookieData },
  tabUrl: string
) => {
  const stats = structuredClone(emptyStats);

  const cookieList = Object.values(cookies);

  stats.total = cookieList.length;

  for (const {
    analytics,
    parsedCookie: { domain },
  } of cookieList) {
    const _isFirstParty = isFirstParty(domain, tabUrl);

    _isFirstParty ? stats.firstParty.total++ : stats.thirdParty.total++;

    if (analytics) {
      if (analytics.category.toLowerCase() === 'functional') {
        _isFirstParty
          ? stats.firstParty.functional++
          : stats.thirdParty.functional++;
      } else if (analytics.category.toLowerCase() === 'marketing') {
        _isFirstParty
          ? stats.firstParty.marketing++
          : stats.thirdParty.marketing++;
      } else if (analytics.category.toLowerCase() === 'analytics') {
        _isFirstParty
          ? stats.firstParty.analytics++
          : stats.thirdParty.analytics++;
      }
    } else {
      _isFirstParty ? stats.firstParty.unknown++ : stats.thirdParty.unknown++;
    }
  }

  return stats;
};

export default countCookiesByCategory;
