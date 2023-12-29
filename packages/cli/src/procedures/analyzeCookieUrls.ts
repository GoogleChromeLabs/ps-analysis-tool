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
import { isFirstParty, findAnalyticsMatch } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { CookieDatabase } from '../types';
import { BrowserManagement } from '../utils/browserManagement';

export const analyzeCookiesUrls = async (
  urls: string[],
  isHeadless: boolean,
  delayTime: number,
  cookieDictionary: CookieDatabase
) => {
  const normalBrowser = new BrowserManagement(
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    isHeadless,
    delayTime,
    false
  );
  const browserWith3pCookiesBlocked = new BrowserManagement(
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    isHeadless,
    delayTime,
    false
  );

  await normalBrowser.initializeBrowser(false);
  await browserWith3pCookiesBlocked.initializeBrowser(true);

  const [normalCookieAnaysisData, blockedAnalysisData] = await Promise.all([
    normalBrowser.analyzeCookieUrls(urls),
    browserWith3pCookiesBlocked.analyzeCookieUrls(urls),
  ]);

  await normalBrowser.deinitialize();
  await browserWith3pCookiesBlocked.deinitialize();

  return urls.map((url, ind) => {
    const cookieKeysInBlockedEnv = new Set();
    Object.values(blockedAnalysisData[ind].cookieData).forEach(
      ({ frameCookies }) => {
        Object.keys(frameCookies).forEach((key) => {
          cookieKeysInBlockedEnv.add(key);
        });
      }
    );

    Object.values(normalCookieAnaysisData[ind].cookieData).forEach(
      ({ frameCookies }) => {
        Object.keys(frameCookies).forEach((key) => {
          frameCookies[key].isBlocked = !cookieKeysInBlockedEnv.has(key);

          //also add analytics form dictionary
          const name = frameCookies[key].name;
          const analytics = findAnalyticsMatch(name, cookieDictionary);

          frameCookies[key].platform = analytics?.platform || 'Unknown';
          frameCookies[key].category = analytics?.category || 'Uncategorized';
          frameCookies[key].GDPR = analytics?.gdprUrl || '';
          frameCookies[key].description = analytics?.description;

          // some cookies may have their expires value in epoch. Convert them to string
          const expires = frameCookies[key].expires;

          if (expires === '') {
            frameCookies[key].expires = 'Session';
          } else if (typeof expires === 'number') {
            frameCookies[key].expires = new Date(
              expires + Date.now()
            ).toISOString();
          }

          frameCookies[key].isFirstParty =
            isFirstParty(
              frameCookies[key].domain,
              normalCookieAnaysisData[ind].pageUrl
            ) || false;
        });
      }
    );

    return normalCookieAnaysisData[ind];
  });
};
