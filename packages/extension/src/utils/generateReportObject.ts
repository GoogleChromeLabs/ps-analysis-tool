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
import type {
  LibraryData,
  TabCookies,
  TabFrames,
} from '@ps-analysis-tool/common';

import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
  type DataMapping,
} from '@ps-analysis-tool/design-system';

/**
 * Utility function to generate report object.
 * @param url Top level URL.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param libraryMatches
 */
export default function generateReportObject(
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData
) {
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const frameStateCreator = prepareFrameStatsComponent(tabFrames, tabCookies);

  const cookieClassificationDataMapping: DataMapping[] = [
    {
      title: 'Total cookies',
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
    },
    {
      title: '1st party cookies',
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: '3rd party cookies',
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
    },
  ];

  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];

  return {
    cookieClassificationDataMapping,
    tabCookies,
    cookiesStatsComponents,
    tabFrames,
    showInfoIcon: true,
    showHorizontalMatrix: false,
    blockedCookieDataMapping,
    showBlockedInfoIcon: true,
    frameStateCreator,
    libraryMatches,
  };
}
