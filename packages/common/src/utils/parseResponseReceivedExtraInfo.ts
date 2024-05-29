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
import {
  RESPONSE_EVENT,
  type CookieData,
  type CookieDatabase,
} from '../cookies.types';
import calculateEffectiveExpiryDate from './calculateEffectiveExpiryDate';
import isFirstParty from './isFirstParty';

/**
 * Parse Network.responseReceivedExtraInfo for extra information about a cookie.
 * @param {object} headers Headers of resonse to be parsed to get extra information about a cookie.
 * @param {object} blockedCookies Blocked Cookies associated with the response being parsed.
 * @param {object} exemptedCookies Blocked Cookies associated with the response being parsed.
 * @param {string|undefined} cookiePartitionKey Partittion key for the response.
 * @param {string} requestUrl The associated request URL.
 * @param {string} tabUrl - The top-level URL (URL in the tab's address bar).
 * @param {object} cookieDB Cookie database to find analytics from.
 * @param {string[]} frameIds - The frameId the following cookies are associated to.
 * @param {string} requestId - The requestId of the request being processed
 * @returns {object} parsed cookies.
 */
export default function parseResponseReceivedExtraInfo(
  headers: Protocol.Network.ResponseReceivedExtraInfoEvent['headers'],
  blockedCookies: Protocol.Network.ResponseReceivedExtraInfoEvent['blockedCookies'],
  exemptedCookies: Protocol.Network.ResponseReceivedExtraInfoEvent['exemptedCookies'],
  cookiePartitionKey: Protocol.Network.ResponseReceivedExtraInfoEvent['cookiePartitionKey'],
  requestUrl: string,
  tabUrl: string,
  cookieDB: CookieDatabase,
  frameIds: string[],
  requestId: string
) {
  const cookies: CookieData[] = [];
  const responseToParse = headers['set-cookie'] ?? headers['Set-Cookie'];

  responseToParse?.split('\n').forEach((headerLine: string) => {
    let parsedCookie: CookieData['parsedCookie'] = parse(headerLine);

    const blockedCookie = blockedCookies.find((c) => {
      if (c.cookie) {
        return c.cookie?.name === parsedCookie.name;
      } else {
        const temporaryParsedCookie = parse(c.cookieLine);
        return temporaryParsedCookie.name === parsedCookie.name;
      }
    });

    const exemptedCookie = exemptedCookies?.find((c) => {
      if (c.cookie) {
        return c.cookie?.name === parsedCookie.name;
      }
      return false;
    });

    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      parsedCookie.expires
    );

    if (headerLine.toLowerCase().includes('partitioned')) {
      parsedCookie = {
        ...parsedCookie,
        partitionKey: cookiePartitionKey,
      };
    }

    let domain;

    if (parsedCookie?.domain) {
      domain = parsedCookie?.domain;
    } else if (!parsedCookie?.domain && requestUrl) {
      domain = new URL(requestUrl).hostname;
    }

    const singleCookie: CookieData = {
      isBlocked: blockedCookie ? true : false,
      blockedReasons: blockedCookie ? blockedCookie?.blockedReasons : [],
      parsedCookie: {
        ...parsedCookie,
        expires: effectiveExpirationDate,
        samesite: parsedCookie.samesite ?? '',
        domain,
      },
      networkEvents: {
        requestEvents: [],
        responseEvents: [
          {
            type: RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO,
            requestId: requestId,
            url: requestUrl,
            blocked: blockedCookie ? true : false,
            timeStamp: Date.now(),
          },
        ],
      },
      analytics: cookieDB
        ? findAnalyticsMatch(parsedCookie.name, cookieDB)
        : null,
      url: requestUrl,
      isFirstParty: isFirstParty(domain, tabUrl),
      headerType: 'response' as CookieData['headerType'],
      frameIdList: [],
      exemptionReason:
        exemptedCookie?.exemptionReason &&
        exemptedCookie?.exemptionReason !== 'None'
          ? exemptedCookie?.exemptionReason
          : undefined,
    };

    //Sometimes frameId comes empty so it shows data in other frames where cookie should not be shown.
    if (frameIds.length > 0) {
      singleCookie.frameIdList = [...frameIds];
    }

    cookies.push(singleCookie);
  });

  return cookies;
}
