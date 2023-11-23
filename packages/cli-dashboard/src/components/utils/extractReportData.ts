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
import type { TechnologyData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import type { CookieFrameStorageType } from '../../types';
import extractCookies from './extractCookies';

const extractReportData = (
  data: {
    cookieData: {
      frameCookies: CookieFrameStorageType;
    };
    technologyData: TechnologyData[];
    pageUrl: string;
  }[]
) => {
  const cookies: CookieFrameStorageType = {};
  const technologies: TechnologyData[] = [];
  const landingPageCookies: CookieFrameStorageType = {};

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
  store: CookieFrameStorageType
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
