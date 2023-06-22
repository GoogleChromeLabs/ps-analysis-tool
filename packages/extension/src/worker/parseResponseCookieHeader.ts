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
import cookie, { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../localStore';
import type { CookieDatabase } from '../utils/fetchCookieDictionary';

/**
 * Parse response cookies header.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {string} url Cookie URL (URL of the server which is setting/updating cookies).
 * @param {string} value header value
 * @param {CookieDatabase} dict Dictionary from open cookie database
 * @returns {CookieData} Parsed cookie object.
 */
const parseResponseCookieHeader = (
  url: string,
  value: string,
  dict: CookieDatabase
): CookieData => {
  const parsedCookie: ParsedCookie = cookie.parse(value);

  let analytics = null;

  if (dict && Object.keys(dict).includes(parsedCookie.name)) {
    //@TODO Handle cases where a name has multiple entries by checking other attributes.
    analytics = dict[parsedCookie.name] ? dict[parsedCookie.name][0] : null;
  }

  return {
    parsedCookie: parsedCookie,
    analytics,
    url,
    headerType: 'response',
  };
};

export default parseResponseCookieHeader;
