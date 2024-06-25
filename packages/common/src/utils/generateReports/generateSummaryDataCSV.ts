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
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import type { CompleteJson, CookieJsonDataType } from '../../cookies.types';

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
  let cookiesWithIssues = 0;
  let analyticsCookiesWithIssues = 0;
  let functionalCookiesWithIssues = 0;
  let marketingCookiesWithIssues = 0;
  let uncategorisedCookiesWithIssues = 0;

  for (const cookie of cookieMap.values()) {
    if (cookie.isFirstParty) {
      totalFirstPartyCookies += 1;
    } else {
      totalThirdPartyCookies += 1;
    }

    if (cookie.isBlocked) {
      cookiesWithIssues += 1;
    }

    switch (cookie.analytics.category) {
      case 'Analytics':
        analyticsCookies += 1;
        if (cookie.isBlocked) {
          analyticsCookiesWithIssues += 1;
        }
        break;
      case 'Functional':
        functionalCookies += 1;
        if (cookie.isBlocked) {
          functionalCookiesWithIssues += 1;
        }
        break;
      case 'Marketing':
        marketingCookies += 1;
        if (cookie.isBlocked) {
          marketingCookiesWithIssues += 1;
        }
        break;
      case 'Uncategorized':
        uncategorisedCookies += 1;
        if (cookie.isBlocked) {
          uncategorisedCookiesWithIssues += 1;
        }
        break;
      default:
        break;
    }
  }

  const summary = {
    [I18n.getMessage('totalCookies')]: cookieMap.size,
    [I18n.getMessage('totalFirstPartyCookies')]: totalFirstPartyCookies,
    [I18n.getMessage('totalThirdPartyCookies')]: totalThirdPartyCookies,
    [I18n.getMessage('analyticsCookies')]: analyticsCookies,
    [I18n.getMessage('functionalCookies')]: functionalCookies,
    [I18n.getMessage('marketingCookies')]: marketingCookies,
    [I18n.getMessage('uncategorizedCookies')]: uncategorisedCookies,
    [I18n.getMessage('cookiesWithIssues')]: cookiesWithIssues,
    [I18n.getMessage('analyticsCookiesWithIssues')]: analyticsCookiesWithIssues,
    [I18n.getMessage('functionalCookiesWithIssues')]:
      functionalCookiesWithIssues,
    [I18n.getMessage('marketingCookiesWithIssues')]: marketingCookiesWithIssues,
    [I18n.getMessage('uncategorizedCookiesWithIssues')]:
      uncategorisedCookiesWithIssues,
  };

  const CSVString = Object.entries(summary).reduce(
    (acc, [key, value]) => (acc += `${key}, ${value}\r\n`),
    ''
  );

  return CSVString;
};

export default generateSummaryDataCSV;
