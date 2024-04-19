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
import { I18n } from '@ps-analysis-tool/i18n';
import { CookieData } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import { CookieDatabase } from '../types';
import { analyzeCookiesUrls } from './analyzeCookieUrls';

export const analyzeCookiesUrlsInBatches = async (
  urls: string[],
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
    pageUrl: string;
    cookieData: {
      [frameUrl: string]: {
        cookiesCount: number;
        frameCookies: {
          [key: string]: CookieData;
        };
      };
    };
  }[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const start = i;
    const end = Math.min(urls.length - 1, i + batchSize - 1);

    spinnies &&
      spinnies.add(`cookie-batch-spinner`, {
        text: I18n.getMessage('analyzing', [
          'cookies',
          ...[start + 1, end + 1].map(String),
        ]),
        indent: 2,
      });

    const urlsWindow = urls.slice(start, end + 1);

    const cookieAnalysis = await analyzeCookiesUrls(
      urlsWindow,
      isHeadless,
      delayTime,
      cookieDictionary,
      shouldSkipAcceptBanner
    );

    report = [...report, ...cookieAnalysis];

    spinnies &&
      spinnies.succeed(`cookie-batch-spinner`, {
        text: I18n.getMessage('doneAnalyzing', [
          'cookies',
          ...[start + 1, end + 1].map(String),
        ]),
        indent: 2,
      });
  }

  return report;
};
