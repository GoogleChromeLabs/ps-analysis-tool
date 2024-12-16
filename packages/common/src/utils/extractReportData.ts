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
 * Internal dependencies
 */
import {
  CompleteJson,
  CookieFrameStorageType,
  ErroredOutUrlsData,
} from '../cookies.types';
import { LibraryData } from '../libraryDetection.types';
import extractCookies from './extractCookies';

const extractReportData = (data: CompleteJson[]) => {
  const landingPageCookies = {};
  const consolidatedLibraryMatches: { [url: string]: LibraryData } = {};
  const erroredOutUrlsData: ErroredOutUrlsData[] = [];

  data.forEach(({ cookieData, pageUrl, libraryMatches, erroredOutUrls }) => {
    erroredOutUrlsData.push(...(erroredOutUrls ?? []));

    if (
      erroredOutUrls &&
      erroredOutUrls.filter(({ url }) => url === pageUrl).length > 0
    ) {
      return;
    }

    formatCookieData(
      extractCookies(cookieData, pageUrl, true),
      landingPageCookies
    );

    consolidatedLibraryMatches[pageUrl] = libraryMatches;
  });

  return {
    landingPageCookies,
    consolidatedLibraryMatches,
    erroredOutUrlsData,
  };
};

const formatCookieData = (
  cookieData: CookieFrameStorageType,
  store: Record<string, any>
) => {
  Object.entries(cookieData).forEach(([frame, _cData]) => {
    if (!store[frame]) {
      store[frame] = {};
    }

    Object.entries(_cData).forEach(([key, cookie]) => {
      store[frame][key] = {
        ...cookie,
        isBlocked: store[frame][key]?.isBlocked || cookie.isBlocked,
        blockedReasons: [
          ...new Set([
            ...(store[frame][key]?.blockedReasons || []),
            ...(cookie.blockedReasons || []),
          ]),
        ],
      };
    });
  });
};

export default extractReportData;
