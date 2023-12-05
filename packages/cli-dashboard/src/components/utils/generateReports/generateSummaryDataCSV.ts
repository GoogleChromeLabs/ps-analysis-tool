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
import type { CompleteJson, CookieJsonDataType } from '../../../types';

const generateSummaryDataCSV = (siteAnalysisData: CompleteJson): string => {
  const frameCookieDataMap = siteAnalysisData.cookieData;

  const cookieMap: Map<string, CookieJsonDataType> = new Map();

  // More than one frame can use one cookie, need to make a map for gettig unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      cookieMap.set(cookieKey, cookieData);
    });
  });

  let totalFirstPartyCookies = 0;
  let totalThirdPartyCookies = 0;
  let analyticsCookies = 0;
  let functionalCookies = 0;
  let marketingCookies = 0;
  let uncategorisedCookies = 0;
  let affectedCookies = 0;
  let affectedAnalyticsCookies = 0;
  let affectedFunctionalCookies = 0;
  let affectedMarketingCookies = 0;
  let affectedUncategorisedCookies = 0;

  for (const cookie of cookieMap.values()) {
    if (cookie.isFirstParty) {
      totalFirstPartyCookies += 1;
    } else {
      totalThirdPartyCookies += 1;
    }

    if (cookie.isBlocked) {
      affectedCookies += 1;
    }

    switch (cookie.category) {
      case 'Analytics':
        analyticsCookies += 1;
        if (cookie.isBlocked) {
          affectedAnalyticsCookies += 1;
        }
        break;
      case 'Functional':
        functionalCookies += 1;
        if (cookie.isBlocked) {
          affectedFunctionalCookies += 1;
        }
        break;
      case 'Marketing':
        marketingCookies += 1;
        if (cookie.isBlocked) {
          affectedMarketingCookies += 1;
        }
        break;
      case 'Uncategorized':
        uncategorisedCookies += 1;
        if (cookie.isBlocked) {
          affectedUncategorisedCookies += 1;
        }
        break;
      default:
        break;
    }
  }

  const summary = {
    'Total Cookies': cookieMap.size,
    'Total First Party Cookies': totalFirstPartyCookies,
    'Total Third Party Cookies': totalThirdPartyCookies,
    'Analytics Cookies': analyticsCookies,
    'Functional Cookies': functionalCookies,
    'Marketing Cookies': marketingCookies,
    'Uncategorized Cookies': uncategorisedCookies,
    'Affected Cookies': affectedCookies,
    'Affected Analytics Cookies': affectedAnalyticsCookies,
    'Affected Functional Cookies': affectedFunctionalCookies,
    'Affected Marketing Cookies': affectedMarketingCookies,
    'Affected Uncategorized Cookies': affectedUncategorisedCookies,
  };

  const CSVString = Object.entries(summary).reduce(
    (acc, [key, value]) => (acc += `${key}, ${value}\r\n`),
    ''
  );

  return CSVString;
};

export default generateSummaryDataCSV;
