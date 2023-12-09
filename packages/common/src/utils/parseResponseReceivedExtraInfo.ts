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
/**
 * Internal dependencies
 */
import type {
  NetworkResponseReceivedExtraInfo,
  BlockedResponseCookieWithReason,
} from '../cdp.types';
import findAnalyticsMatch from './findAnalyticsMatch';
import { CookieData, CookieDatabase } from '../cookies.types';
import calculateEffectiveExpiryDate from './calculateEffectiveExpiryDate';

/**
 *
 * @param {object} response Response to be parsed to get extra information about a cookie.
 * @param {object} requestMap An object for requestId to url.
 * @param {object} cookieDB Cookie database to find analytics from.
 * @returns {object} parsed cookies.
 */
export default function parseResponseReceivedExtraInfo(
  response: NetworkResponseReceivedExtraInfo,
  requestMap: { [requestId: string]: string },
  cookieDB?: CookieDatabase
) {
  const cookies: CookieData[] = [];

  response.headers['Set-Cookie']?.split('\n').forEach((headerLine: string) => {
    let parsedCookie: CookieData['parsedCookie'] = parse(headerLine);
    const blockedCookie = response.blockedCookies.find(
      (c: BlockedResponseCookieWithReason) => {
        if (c.cookie) {
          return c.cookie?.name === parsedCookie.name;
        } else {
          const temporaryParsedCookie = parse(c.cookieLine);
          return temporaryParsedCookie.name === parsedCookie.name;
        }
      }
    );
    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      parsedCookie.expires
    );
    if (headerLine.toLowerCase().includes('partitioned')) {
      parsedCookie = {
        ...parsedCookie,
        partitionKey: response?.cookiePartitionKey,
      };
    }

    const singleCookie = {
      isBlocked: blockedCookie ? true : false,
      blockedReasons: blockedCookie ? blockedCookie?.blockedReasons : [],
      parsedCookie: {
        ...parsedCookie,
        expires: effectiveExpirationDate,
        samesite: parsedCookie.samesite ?? 'lax',
        domain:
          parsedCookie?.domain ??
          new URL(requestMap[response?.requestId]).hostname,
      },
      analytics: cookieDB
        ? findAnalyticsMatch(parsedCookie.name, cookieDB)
        : null,
      url: requestMap[response?.requestId],
      isFirstParty: null,
      headerType: 'response' as CookieData['headerType'],
      frameIdList: [],
    };
    cookies.push(singleCookie);
  });
  return cookies;
}
