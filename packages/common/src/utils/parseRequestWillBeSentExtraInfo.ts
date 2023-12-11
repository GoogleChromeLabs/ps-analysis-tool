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

import { NetworkRequestExtraInfoParams } from '../cdp.types';
import { CookieData, CookieDatabase } from '../cookies.types';
import calculateEffectiveExpiryDate from './calculateEffectiveExpiryDate';
import findAnalyticsMatch from './findAnalyticsMatch';

/**
 *
 * @param {object} request Request to be parsed to get extra information about a cookie.
 * @param {object} cookieDB Cookie database to find analytics from.
 * @param {object} requestMap An object for requestId to url.
 * @returns {object} parsed cookies.
 */
export default function parseRequestWillBeSentExtraInfo(
  request: NetworkRequestExtraInfoParams,
  cookieDB: CookieDatabase,
  requestMap: { [requestId: string]: string }
) {
  const cookies: CookieData[] = [];

  request.associatedCookies.forEach(({ blockedReasons, cookie }) => {
    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      cookie.expires
    );

    let domain;
    if (cookie?.domain) {
      domain = cookie?.domain;
    } else if (!cookie?.domain && requestMap[request?.requestId]) {
      domain = new URL(requestMap[request?.requestId]).hostname;
    }

    const singleCookie = {
      isBlocked: !(blockedReasons.length === 0),
      parsedCookie: {
        ...cookie,
        expires: effectiveExpirationDate,
        samesite: cookie.sameSite ?? 'lax',
        domain,
      },
      blockedReasons,
      analytics: cookieDB ? findAnalyticsMatch(cookie.name, cookieDB) : null,
      url: requestMap[request?.requestId],
      headerType: 'request' as CookieData['headerType'],
      isFirstParty: cookie?.sameParty,
      frameIdList: [],
    };
    cookies.push(singleCookie);
  });
  return cookies;
}
