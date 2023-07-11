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
import type { Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../localStore';
import type {
  CookieAnalytics,
  CookieDatabase,
} from '../utils/fetchCookieDictionary';
import { createCookieObject } from './createCookieObject';
import findAnalyticsMatch from './findAnalyticsMatch';

/**
 * Parse response cookies header.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {string} url Cookie URL (URL of the server which is setting/updating cookies).
 * @param {string} value header value
 * @param {CookieDatabase} dictionary Dictionary from open cookie database
 * @returns {Promise<CookieData[]>} Parsed cookie object array.
 */
const parseRequestCookieHeader = async (
  url: string,
  value: string,
  dictionary: CookieDatabase
): Promise<CookieData[]> => {
  const cookies: CookieData[] = await Promise.all(
    value?.split(';').map(async (cookieString) => {
      let [name] = cookieString.split('=');
      const [, ...rest] = cookieString.split('=');
      name = name.trim();

      let analytics: CookieAnalytics | null = null;
      if (dictionary) {
        analytics = findAnalyticsMatch(name, dictionary);
      }

      let parsedCookie = {
        name,
        value: rest.join('='),
      } as ParsedCookie;
      parsedCookie = await createCookieObject(parsedCookie, url);

      return {
        parsedCookie,
        analytics,
        headerType: 'request',
        url,
      };
    })
  );

  return cookies;
};

export default parseRequestCookieHeader;
