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
 * External dependencies
 */
import type { Protocol } from 'devtools-protocol';
/**
 * Internal dependencies.
 */
import {
  REQUEST_EVENT,
  type CookieData,
  type CookieDatabase,
} from '../cookies.types';
import calculateEffectiveExpiryDate from './calculateEffectiveExpiryDate';
import findAnalyticsMatch from './findAnalyticsMatch';
import isFirstParty from './isFirstParty';

/**
 * Parses Network.requestWillBeSentExtraInfo to get extra information about a cookie.
 * @param {object} request Request to be parsed to get extra information about a cookie.
 * @param {object} cookieDB Cookie database to find analytics from.
 * @param {string} requestUrl The request url.
 * @param {string} tabUrl - The top-level URL (URL in the tab's address bar).
 * @param {string} frameId The request to which the frame is associated to.
 * @returns {object} parsed cookies.
 */
export default function parseRequestWillBeSentExtraInfo(
  request: Protocol.Network.RequestWillBeSentExtraInfoEvent,
  cookieDB: CookieDatabase,
  requestUrl: string,
  tabUrl: string,
  frameId: string
) {
  const cookies: CookieData[] = [];

  request.associatedCookies.forEach(({ blockedReasons, cookie }) => {
    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      cookie.expires
    );

    let domain;

    if (cookie?.domain) {
      domain = cookie?.domain;
    } else if (!cookie?.domain && requestUrl) {
      domain = new URL(requestUrl).hostname;
    }

    const singleCookie: CookieData = {
      isBlocked: blockedReasons.length !== 0,
      parsedCookie: {
        ...cookie,
        expires: effectiveExpirationDate,
        samesite: cookie.sameSite?.toLowerCase() ?? '',
        domain,
      },
      networkEvents: {
        requestEvents: [
          {
            type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
            requestId: request.requestId,
            url: requestUrl,
            blocked: blockedReasons.length !== 0,
            timeStamp: Date.now(),
          },
        ],
        responseEvents: [],
      },
      blockedReasons,
      analytics: cookieDB ? findAnalyticsMatch(cookie.name, cookieDB) : null, // In case CDP gets cookie first.
      url: requestUrl,
      headerType: 'request' as CookieData['headerType'],
      isFirstParty: isFirstParty(domain, tabUrl),
      frameIdList: [frameId],
    };

    cookies.push(singleCookie);
  });

  return cookies;
}
