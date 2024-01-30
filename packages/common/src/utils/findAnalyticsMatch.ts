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
import { CookieAnalytics, CookieDatabase } from '../cookies.types';

/**
 * Matches wildcard string to a provided string. For eg Foo_* matches Foo_123.
 * @param {string} wildcard  Wildcard cookie name.
 * @param {string} str cookie name to be matched.
 * @returns {boolean} Flag for match
 */
const wildTest = (wildcard: string, str: string): boolean => {
  const regExp = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
  const result = new RegExp(
    `^${regExp.replace(/\*/g, '.*').replace(/\?/g, '.')}$`,
    'i'
  );
  return result.test(str); // remove last 'i' above to have case sensitive
};

export const emptyAnalytics = {
  platform: '',
  category: 'Uncategorized',
  name: '',
  domain: '',
  description: '',
  retention: '',
  dataController: '',
  gdprUrl: '',
  wildcard: '',
};

/**
 * Finds analytics in cookie DB for a cookie name.
 * @param {string} key cookie name to be matched.
 * @param {CookieDatabase} dictionary cookieDB for finding matches.
 * @returns {boolean} Flag for match
 */
const findAnalyticsMatch = (
  key: string,
  dictionary: CookieDatabase
): CookieAnalytics => {
  let analytics: CookieAnalytics = { ...emptyAnalytics };

  Object.keys(dictionary).every((dictionaryKey) => {
    if (key === dictionaryKey) {
      analytics = dictionary[dictionaryKey][0];
      return false;
    } else if (dictionaryKey.includes('*') && wildTest(dictionaryKey, key)) {
      analytics = dictionary[dictionaryKey][0];

      return false;
    } else {
      return true;
    }
  });

  analytics.category = analytics.category || 'Uncategorized';

  return analytics;
};

export default findAnalyticsMatch;
