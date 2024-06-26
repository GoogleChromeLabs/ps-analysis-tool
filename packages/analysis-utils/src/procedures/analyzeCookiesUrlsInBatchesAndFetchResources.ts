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
  CookieData,
  CookieDatabase,
  LibraryData,
  LibraryMatchers,
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
  spinnies?: {
    add: (
      id: string,
      { text, indent }: { text: string; indent: number }
    ) => void;
    succeed: (
      id: string,
      { text, indent }: { text: string; indent: number }
    ) => void;
  },
  shouldSkipAcceptBanner = false
) => {
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
  }[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const start = i;
    const end = Math.min(urls.length - 1, i + batchSize - 1);

    spinnies &&
      spinnies.add(`cookie-batch-spinner`, {
        text: `Analyzing cookies in URLs ${start + 1} - ${end + 1}...`,
        indent: 2,
      });

    const urlsWindow = urls.slice(start, end + 1);

    const cookieAnalysisAndFetchedResources =
      await analyzeCookiesUrlsAndFetchResources(
        urlsWindow,
        Libraries,
        isHeadless,
        delayTime,
        cookieDictionary,
        shouldSkipAcceptBanner
      );

    report = [...report, ...cookieAnalysisAndFetchedResources];

    spinnies &&
      spinnies.succeed(`cookie-batch-spinner`, {
        text: `Done analyzing cookies in URLs ${start + 1} - ${end + 1}.`,
        indent: 2,
      });
  }

  return report;
};
