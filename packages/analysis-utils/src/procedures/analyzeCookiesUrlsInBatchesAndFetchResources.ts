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
  type CookieData,
  type CookieDatabase,
  LibraryData,
  type LibraryMatchers,
  removeAndAddNewSpinnerText,
  type SingleURLError,
  type Selectors,
  type SingleURLError,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { analyzeCookiesUrlsAndFetchResources } from './analyzeCookiesUrlsAndFetchResources';

export const analyzeCookiesUrlsInBatchesAndFetchResources = async (
  urls: string[],
  Libraries: LibraryMatchers[],
  isHeadless: boolean,
  delayTime: number,
  cookieDictionary: CookieDatabase,
  batchSize = 3,
  spinnies?: Spinnies,
  shouldSkipAcceptBanner = false,
  verbose = false,
  indent = 4,
  selectors?: Selectors
) => {
  // eslint-disable-next-line no-useless-catch -- Because we are rethrowing the same error no need to create a new Error instance
  try {
    let report: {
      url: string;
      cookieData: {
        [frameUrl: string]: {
          frameCookies: {
            [key: string]: CookieData;
          };
        };
      };
      resources: {
        origin: string | null;
        content: string;
        type?: string;
      }[];
      domQueryMatches: LibraryData;
      erroredOutUrls: Record<string, SingleURLError[]>;
    }[] = [];

    for (let i = 0; i < urls.length; i += batchSize) {
      const start = i;
      const end = Math.min(urls.length - 1, i + batchSize - 1);

      spinnies &&
        indent === 4 &&
        spinnies.add(`cookie-batch-spinner${start + 1}-${end + 1}`, {
          text: `Analyzing cookies in URLs ${start + 1} - ${end + 1}`,
          indent,
        });

      const urlsWindow = urls.slice(start, end + 1);

      const cookieAnalysisAndFetchedResources =
        await analyzeCookiesUrlsAndFetchResources(
          urlsWindow,
          Libraries,
          isHeadless,
          delayTime,
          cookieDictionary,
          shouldSkipAcceptBanner,
          verbose,
          urls.length > 1,
          selectors,
          spinnies
        );

      report = [...report, ...cookieAnalysisAndFetchedResources];

      spinnies &&
        indent === 4 &&
        removeAndAddNewSpinnerText(
          spinnies,
          `cookie-batch-spinner${start + 1}-${end + 1}`,
          `Done analyzing cookies in URLs ${start + 1} - ${end + 1}`,
          indent
        );
    }

    return report;
  } catch (error) {
    throw error;
  }
};
