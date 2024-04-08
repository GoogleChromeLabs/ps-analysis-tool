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
import {
  calculateEffectiveExpiryDate,
  findAnalyticsMatch,
  type CookieData,
  type CookieDatabase,
  isFirstParty,
} from '@ps-analysis-tool/common';
import { Protocol } from 'devtools-protocol';
interface GetCookiesOutput {
  [cookies: string]: Protocol.Network.Cookie[];
}

/**
 * Chromium fetches all the resources for a paticular domain and then gets network cookies for those resources.Follow the call chain in the below link.
 * @see https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/front_end/core/sdk/CookieModel.ts;l=131
 * @param targetId The targetId on which the function should work on.
 * @param resourceURLs The resources that have been loaded using same loader Id.
 * @param cookieDB Cookie Database to find analytics match.
 * @param tabUrl The tabUrl for the specific request.
 * @param {string[]} frameIds frameId this cookie belongs to.
 * @returns {CookieData[]} The processed CookieData array.
 */
async function fetchFrameResourceAndGetCookies(
  targetId: string | undefined,
  resourceURLs: string[],
  cookieDB: CookieDatabase | null,
  tabUrl: string | null,
  frameIds: string[]
) {
  if (!targetId || !cookieDB || !tabUrl) {
    return [];
  }

  const { cookies }: GetCookiesOutput = (await chrome.debugger.sendCommand(
    { targetId },
    'Network.getCookies',
    { urls: resourceURLs }
  )) as GetCookiesOutput;

  const processedCookies: CookieData[] = [];

  cookies.forEach((cookie) => {
    const effectiveExpirationDate = calculateEffectiveExpiryDate(
      cookie.expires
    );

    const singleCookie = {
      parsedCookie: {
        ...cookie,
        expires: effectiveExpirationDate,
        samesite: cookie.sameSite?.toLowerCase() ?? '',
      },
      isBlocked: false,
      networkEvents: {
        requestEvents: [],
        responseEvents: [],
      },
      analytics: cookieDB ? findAnalyticsMatch(cookie.name, cookieDB) : null, // In case CDP gets cookie first.
      isFirstParty: isFirstParty(cookie.domain, tabUrl),
      url: '',
      frameIdList: [...(frameIds ?? [])],
    };
    processedCookies.push(singleCookie);
  });

  return processedCookies;
}

export default fetchFrameResourceAndGetCookies;
