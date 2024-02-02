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
import { parse } from 'simple-cookie';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies
 */
import findAnalyticsMatch from './findAnalyticsMatch';
import type { CookieData, CookieDatabase } from '../cookies.types';
import calculateEffectiveExpiryDate from './calculateEffectiveExpiryDate';
import isFirstParty from './isFirstParty';

/**
 * Parse Network.responseReceivedExtraInfo for extra information about a cookie.
 * @param {object} response Response to be parsed to get extra information about a cookie.
 * @param {object} requestMap An object for requestId to url.
 * @param {string} tabUrl - The top-level URL (URL in the tab's address bar).
 * @param {object} cookieDB Cookie database to find analytics from.
 * @returns {object} parsed cookies.
 */
export default function parseResponseReceivedExtraInfo(
  response: Protocol.Network.ResponseReceivedExtraInfoEvent,
  requestMap: { [requestId: string]: string },
  tabUrl: string,
  cookieDB: CookieDatabase
) {
  const cookies: CookieData[] = [];
  const responseToParse =
    response.headers['set-cookie'] ?? response.headers['Set-Cookie'];

  responseToParse?.split('\n').forEach((headerLine: string) => {
    let parsedCookie: CookieData['parsedCookie'] = parse(headerLine);

    const blockedCookie = response.blockedCookies.find((c) => {
      if (c.cookie) {
        return c.cookie?.name === parsedCookie.name;
      } else {
        const temporaryParsedCookie = parse(c.cookieLine);
        return temporaryParsedCookie.name === parsedCookie.name;
      }
    });

    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      parsedCookie.expires
    );

    if (headerLine.toLowerCase().includes('partitioned')) {
      parsedCookie = {
        ...parsedCookie,
        partitionKey: response?.cookiePartitionKey,
      };
    }

    let domain,
      url = '';

    if (requestMap && requestMap[response?.requestId]) {
      url = requestMap[response?.requestId] ?? '';
    }

    if (parsedCookie?.domain) {
      domain = parsedCookie?.domain;
    } else if (!parsedCookie?.domain && url) {
      domain = new URL(url).hostname;
    }

    const singleCookie = {
      isBlocked: blockedCookie ? true : false,
      blockedReasons: blockedCookie ? blockedCookie?.blockedReasons : [],
      parsedCookie: {
        ...parsedCookie,
        expires: effectiveExpirationDate,
        samesite: parsedCookie.samesite ?? '',
        domain,
      },
      analytics: cookieDB
        ? findAnalyticsMatch(parsedCookie.name, cookieDB)
        : null,
      url,
      isFirstParty: isFirstParty(domain, tabUrl),
      headerType: 'response' as CookieData['headerType'],
      frameIdList: [],
    };

    cookies.push(singleCookie);
  });

  return cookies;
}
