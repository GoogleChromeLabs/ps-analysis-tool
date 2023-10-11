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
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';

/**
 * Internal dependencies.
 */
import { CookieDatabase } from '../types';
import { Cookie } from '../utils/browserManagement/types';
import { analyzeCookiesUrls } from './analyzeCookieUrls';

export const analyzeCookiesUrlsInBatches = async (
  urls: string[],
  isHeadless: boolean,
  delayTime: number,
  cookieDictionary: CookieDatabase,
  batchSize = 3
) => {
  const spinnies = new Spinnies();
  let report: {
    pageUrl: string;
    cookieData: {
      [frameUrl: string]: {
        cookiesCount: number;
        frameCookies: {
          [key: string]: Cookie;
        };
      };
    };
  }[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const start = i;
    const end = Math.min(urls.length - 1, i + batchSize - 1);

    spinnies.add(`cookies-spinner-${i}`, {
      text: `Analysing cookies in urls ${start + 1} - ${end + 1} `,
    });

    const urlsWindow = urls.slice(start, end + 1);

    const cookieAnalysis = await analyzeCookiesUrls(
      urlsWindow,
      isHeadless,
      delayTime,
      cookieDictionary
    );

    report = [...report, ...cookieAnalysis];

    spinnies.succeed(`cookies-spinner-${i}`, {
      text: `Done analysing cookies in urls ${start + 1} - ${end + 1} `,
    });
  }

  return report;
};
