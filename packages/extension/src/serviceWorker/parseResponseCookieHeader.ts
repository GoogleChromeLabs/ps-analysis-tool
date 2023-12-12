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
import cookie from 'simple-cookie';
import {
  isFirstParty,
  findAnalyticsMatch,
  type CookieData,
  type NetworkCookie,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type {
  CookieAnalytics,
  CookieDatabase,
} from '../utils/fetchCookieDictionary';
import { createCookieObject } from './createCookieObject';

/**
 * Parse response cookies header.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {string} url Cookie URL (URL of the server which is setting/updating cookies).
 * @param {string} value header value
 * @param {CookieDatabase} dictionary Dictionary from open cookie database
 * @param {string} tabUrl top url of the tab from which the request originated.
 * @param {number} frameId Id of a frame in which this cookie is used.
 * @param {NetworkCookie[]} cookiesList List cookies from the request.
 * @returns {Promise<CookieData>} Parsed cookie object.
 */
const parseResponseCookieHeader = async (
  url: string,
  value: string,
  dictionary: CookieDatabase,
  tabUrl: string,
  frameId: number,
  cookiesList: NetworkCookie[]
): Promise<CookieData> => {
  let parsedCookie: CookieData['parsedCookie'] = cookie.parse(value);

  parsedCookie = await createCookieObject(parsedCookie, url, cookiesList);

  let analytics: CookieAnalytics | null = null;
  if (dictionary) {
    analytics = findAnalyticsMatch(parsedCookie.name, dictionary);
  }

  const _isFirstParty = isFirstParty(parsedCookie.domain || '', tabUrl);
  const partitionKey =
    new URL(tabUrl).protocol +
    '//' +
    new URL(tabUrl).hostname.replace('www.', '');
  if (value.toLowerCase().includes('partitioned')) {
    parsedCookie = {
      ...parsedCookie,
      partitionKey,
    };
  }

  return {
    parsedCookie,
    analytics,
    url,
    headerType: 'response',
    isFirstParty: _isFirstParty,
    frameIdList: [frameId],
  };
};

export default parseResponseCookieHeader;
