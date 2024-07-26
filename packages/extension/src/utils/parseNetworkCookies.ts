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
import type { Protocol } from 'devtools-protocol';
import {
  findAnalyticsMatch,
  calculateEffectiveExpiryDate,
  isFirstParty,
  type CookieData,
  type CookieDatabase,
} from '@google-psat/common';

/**
 * Parse Network.responseReceivedExtraInfo for extra information about a cookie.
 * @param {Protocol.Network.Cookie[]} cookies Cookies that have been extracted from the urls.
 * @param {string} tabUrl - The top-level URL (URL in the tab's address bar).
 * @param {CookieDatabase} cookieDB Cookie database to find analytics from.
 * @param {string} frameId - The frameId the following cookies are associated to.
 * @returns {CookieData[]} parsed cookies.
 */
export default function parseNetworkCookies(
  cookies: Protocol.Network.Cookie[],
  tabUrl: string,
  cookieDB: CookieDatabase,
  frameId: string
) {
  const parsedCookies: CookieData[] = [];

  cookies.forEach((cookie) => {
    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      cookie.expires
    );
    const singleCookie: CookieData = {
      isBlocked: false,
      blockedReasons: [],
      parsedCookie: {
        ...cookie,
        expires: effectiveExpirationDate,
        samesite: cookie.sameSite ?? '',
        partitionKey:
          cookie?.partitionKey && typeof cookie?.partitionKey === 'string'
            ? cookie?.partitionKey
            : //@ts-ignore This is to handle both stable and canary version of Chrome.
              cookie?.partitionKey?.topLevelSite,
      },
      networkEvents: {
        requestEvents: [],
        responseEvents: [],
      },
      analytics: cookieDB ? findAnalyticsMatch(cookie.name, cookieDB) : null,
      url: '',
      isFirstParty: isFirstParty(cookie.domain, tabUrl),
      headerType: 'response' as CookieData['headerType'],
      frameIdList: [frameId],
    };

    parsedCookies.push(singleCookie);
  });

  return parsedCookies;
}
