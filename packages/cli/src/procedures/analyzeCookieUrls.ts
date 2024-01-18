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
  const browser = new BrowserManagement(
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    isHeadless,
    delayTime,
    false
  );

  await browser.initializeBrowser(true);
  const analysisCookieData = await browser.analyzeCookieUrls(urls);

  return analysisCookieData.map(({ pageUrl, cookieData }) => {
    Object.entries(cookieData).forEach(([, frameData]) => {
      const frameCookies = frameData.frameCookies;
      Object.entries(frameCookies).forEach(([key, cookie]) => {
        const analytics = findAnalyticsMatch(
          cookie.parsedCookie.name,
          cookieDictionary
        );

        frameCookies[key].analytics = {
          platform: analytics?.platform || 'Unknown',
          category: analytics?.category || 'Uncategorized',
          gdprUrl: analytics?.gdprUrl || '',
          description: analytics?.description,
        };
        frameCookies[key].isFirstParty = isFirstParty(
          cookie.parsedCookie.domain,
          cookie.url
        );
      });
    });

    return {
      pageUrl,
      cookieData,
    };
  });
};
