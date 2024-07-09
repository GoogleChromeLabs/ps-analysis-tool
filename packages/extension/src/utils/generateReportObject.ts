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
  DataMapping,
  CookieJsonDataType,
} from '@google-psat/common';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Utility function to generate report object.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param libraryMatches Library matches
 * @param url Top level URL.
 * @returns Report Object
 */
export async function generateReportObject(
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData,
  url: string
) {
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const frameStateCreator = prepareFrameStatsComponent(tabFrames, tabCookies);

  const cookieClassificationDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('totalCookies'),
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
    },
    {
      title: I18n.getMessage('1stPartyCookies'),
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: I18n.getMessage('3rdPartyCookies'),
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
    },
  ];

  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('blockedCookies'),
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];

  const exemptedCookiesDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('exemptedCookies'),
      count: cookieStats.exemptedCookies.total,
      data: cookiesStatsComponents.exempted,
    },
  ];

  const locale = I18n.getLocale();
  const translations = await I18n.fetchMessages(locale);

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
    exemptedCookiesDataMapping,
    showFramesSection: true,
    showBlockedCategory: false,
    url,
    translations,
    source: 'extension',
  };
}
/**
 * Utility function to generate dashboard report object.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param libraryMatches Library matches
 * @param url Top level URL.
 * @returns Dashboard Report Object
 */
export function generateDashboardObject(
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData,
  url: string
) {
  const completeJSON = {
    pageUrl: url,
    libraryMatches,
    cookieData: generateCookieDataForDashboard(tabCookies, tabFrames),
    technologyData: [],
  };

  return completeJSON;
}

const generateCookieDataForDashboard = (
  tabCookies: TabCookies,
  tabFrames: TabFrames
) => {
  const frameIdToUrlMapping: { [frameId: string]: string } = {};
  const cookieData: {
    [frame: string]: {
      frameCookies: { [cookieName: string]: CookieJsonDataType };
      frameType: string | undefined;
    };
  } = {};

  const frameUrlSet = new Set<string>();

  Object.entries(tabFrames).forEach(([key, value]) => {
    value.frameIds.forEach((frameId: string) => {
      if (key !== 'undefined') {
        frameIdToUrlMapping[frameId] = key;
        frameUrlSet.add(key);
      }
    });
  });

  Array.from(frameUrlSet).forEach((frameURL) => {
    if (frameURL === 'undefined' || !frameURL) {
      return;
    }

    cookieData[frameURL] = {
      frameCookies: {},
      frameType: tabFrames[frameURL]?.frameType ?? 'sub_frame',
    };
  });

  Object.entries(tabCookies).forEach(([cookieKey, cookie]) => {
    cookie.frameIdList?.forEach((frameId) => {
      const frameURL = frameIdToUrlMapping[frameId];

      if (frameURL === 'undefined' || !frameURL) {
        return;
      }

      if (cookieData[frameURL]?.frameCookies) {
        //@ts-ignore since the parsedCookie
        cookieData[frameURL].frameCookies[cookieKey] = cookie;
        cookieData[frameURL].frameType =
          tabFrames[frameURL]?.frameType ?? 'sub_frame';
      } else {
        cookieData[frameURL] = {
          //@ts-ignore since the parsedCookie
          frameCookies: {
            [cookieKey]: cookie,
          },
          frameType: tabFrames[frameURL]?.frameType ?? 'sub_frame',
        };
      }
    });
  });
  return cookieData;
};
