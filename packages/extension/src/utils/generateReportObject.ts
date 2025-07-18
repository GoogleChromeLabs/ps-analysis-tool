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
  type TabCookies,
  type TabFrames,
  type DataMapping,
  type CookieJsonDataType,
  isValidURL,
} from '@google-psat/common';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
  type TableFilter,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Utility function to generate report object.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param url Top level URL.
 * @param filters Filter applied to the landing page.
 * @returns Report Object
 */
export async function generateReportObject(
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  url: string,
  filters: TableFilter
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
    exemptedCookiesDataMapping,
    showFramesSection: true,
    showBlockedCategory: false,
    url,
    translations,
    filters,
    source: 'extension',
  };
}
/**
 * Utility function to generate dashboard report object.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param url Top level URL.
 * @returns Dashboard Report Object
 */
export function generateDashboardObject(
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  url: string
) {
  const completeJSON = {
    pageUrl: isValidURL(url) ? new URL(url).origin : '',
    cookieData: generateCookieDataForDashboard(tabCookies, tabFrames),
  };

  return [completeJSON];
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
      cookieData['unknown'] = {
        frameCookies: {},
        frameType: 'sub_frame',
      };
      return;
    }

    cookieData[frameURL] = {
      frameCookies: {},
      frameType: tabFrames[frameURL]?.frameType ?? 'sub_frame',
    };
  });

  Object.entries(tabCookies).forEach(([cookieKey, cookie]) => {
    let wasCookieAdded = false;
    cookie.frameIdList?.forEach((frameId) => {
      const frameURL = frameIdToUrlMapping[frameId];

      if (frameURL === 'undefined' || !frameURL) {
        return;
      }

      if (cookieData[frameURL]?.frameCookies) {
        wasCookieAdded = true;
        //@ts-ignore since the parsedCookie
        cookieData[frameURL].frameCookies[cookieKey] = cookie;
        cookieData[frameURL].frameType =
          tabFrames[frameURL]?.frameType ?? 'sub_frame';
        return;
      } else {
        wasCookieAdded = true;
        cookieData[frameURL] = {
          //@ts-ignore since the parsedCookie
          frameCookies: {
            [cookieKey]: cookie,
          },
          frameType: tabFrames[frameURL]?.frameType ?? 'sub_frame',
        };
        return;
      }
    });

    if (!wasCookieAdded) {
      cookieData['unknown'] = {
        //@ts-ignore since the parsedCookie
        frameCookies: {
          ...(cookieData['unknown']?.frameCookies ?? {}),
          [cookieKey]: cookie,
        },
      };
    }
  });
  return cookieData;
};
