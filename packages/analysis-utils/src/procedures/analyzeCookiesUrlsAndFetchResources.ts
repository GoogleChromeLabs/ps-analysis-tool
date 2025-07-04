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
import {
  isFirstParty,
  findAnalyticsMatch,
  type CookieDatabase,
  deriveBlockingStatus,
  type Selectors,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { BrowserManagement } from '../browserManagement';

export const analyzeCookiesUrlsAndFetchResources = async (
  urls: string[],
  isHeadless: boolean,
  delayTime: number,
  cookieDictionary: CookieDatabase,
  shouldSkipAcceptBanner: boolean,
  verbose: boolean,
  isSitemap: boolean,
  selectors?: Selectors,
  spinnies?: Spinnies,
  indent = 4
) => {
  // eslint-disable-next-line no-useless-catch -- Because we are rethrowing the same error no need to create a new Error instance
  try {
    const browser = new BrowserManagement(
      {
        width: 1440,
        height: 790,
        deviceScaleFactor: 1,
      },
      isHeadless,
      delayTime,
      verbose,
      indent,
      isSitemap,
      spinnies,
      selectors
    );

    await browser.initializeBrowser(true);

    const { result: analysisCookieData, erroredOutUrls } =
      await browser.analyzeCookies(urls, shouldSkipAcceptBanner);

    const resources = browser.getResources(urls);

    const res = analysisCookieData.map(({ url: pageUrl, cookieData }) => {
      Object.entries(cookieData).forEach(([, frameData]) => {
        const frameCookies = frameData.frameCookies;
        Object.entries(frameCookies).forEach(([key, cookie]) => {
          const analytics = findAnalyticsMatch(
            cookie.parsedCookie.name,
            cookieDictionary
          );

          frameCookies[key.trim()].analytics = {
            platform: analytics?.platform || 'Unknown',
            category: analytics?.category || 'Uncategorized',
            gdprUrl: analytics?.gdprUrl || '',
            description: analytics?.description,
          };

          frameCookies[key.trim()].isFirstParty = isFirstParty(
            cookie.parsedCookie.domain,
            pageUrl
          );

          frameCookies[key.trim()].blockingStatus = deriveBlockingStatus(
            cookie.networkEvents
          );
        });
      });

      return {
        url: pageUrl,
        cookieData,
        resources: resources[pageUrl],
        erroredOutUrls,
      };
    });

    await browser.deinitialize();
    return res;
  } catch (error) {
    throw error;
  }
};
