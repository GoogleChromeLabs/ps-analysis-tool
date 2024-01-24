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
import type {
  CompleteJson,
  CookieFrameStorageType,
  TechnologyData,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import extractCookies from './extractCookies';

const extractReportData = (data: CompleteJson[]) => {
  const cookies = {};
  const technologies: TechnologyData[] = [];
  const landingPageCookies = {};

  data.forEach(({ cookieData, technologyData, pageUrl }) => {
    formatCookieData(extractCookies(cookieData, pageUrl), cookies);

    formatCookieData(
      extractCookies(cookieData, pageUrl, true),
      landingPageCookies
    );

    technologies.push(
      ...technologyData.map((technology) => ({
        ...technology,
        pageUrl,
      }))
    );
  });

  return {
    cookies,
    technologies,
    landingPageCookies,
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
      store[frame][key] = cookie;
    });
  });
};

export default extractReportData;
