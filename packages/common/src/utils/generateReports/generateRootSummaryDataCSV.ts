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
import type { CompleteJson, CookieTableData } from '../../cookies.types';
import extractReportData from '../extractReportData';
import reshapeCookies from '../reshapeCookies';
import extractCookies from '../extractCookies';

const calculateCSVData = (cookies: {
  [key: string]: CookieTableData;
}): string => {
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
  let totalCookies = 0;

  // eslint-disable-next-line complexity
  Object.keys(cookies).forEach((cookieKey) => {
    const cookie = cookies[cookieKey];

    if (!cookie.analytics) {
      return;
    }
    if (cookie.isFirstParty) {
      totalFirstPartyCookies += 1;
    } else {
      totalThirdPartyCookies += 1;
    }

    if (
      cookie.isBlocked ||
      (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
    ) {
      cookiesWithIssues += 1;
    }

    switch (cookie.analytics.category) {
      case 'Analytics':
        analyticsCookies += 1;
        if (
          cookie.isBlocked ||
          (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
        ) {
          analyticsCookiesWithIssues += 1;
        }
        break;
      case 'Functional':
        functionalCookies += 1;
        if (
          cookie.isBlocked ||
          (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
        ) {
          functionalCookiesWithIssues += 1;
        }
        break;
      case 'Marketing':
        marketingCookies += 1;
        if (
          cookie.isBlocked ||
          (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
        ) {
          marketingCookiesWithIssues += 1;
        }
        break;
      case 'Uncategorized':
        uncategorisedCookies += 1;
        if (
          cookie.isBlocked ||
          (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
        ) {
          uncategorisedCookiesWithIssues += 1;
        }
        break;
      default:
        break;
    }
    totalCookies += 1;
  });

  const summary = [
    totalCookies,
    totalFirstPartyCookies,
    totalThirdPartyCookies,
    analyticsCookies,
    functionalCookies,
    marketingCookies,
    uncategorisedCookies,
    cookiesWithIssues,
    analyticsCookiesWithIssues,
    functionalCookiesWithIssues,
    marketingCookiesWithIssues,
    uncategorisedCookiesWithIssues,
  ];

  return summary.join(',').concat('\r\n');
};
export const generateRootSummaryDataCSV = (
  siteMapAnalysisData: CompleteJson[]
) => {
  const extractedData: { [key: string]: CookieTableData } = reshapeCookies(
    extractReportData(siteMapAnalysisData).landingPageCookies
  );
  const headers = [
    'URL',
    'Total Cookies',
    'First Party',
    'Third Party',
    'Analytics',
    'Functional',
    'Marketing',
    'Uncategorised',
    'Total Cookies With Issues',
    'Analytics',
    'Functional',
    'Marketing',
    'Uncategorised',
  ];

  let csvData = headers.join(',').concat('\r\n');

  csvData = csvData
    .concat('Aggregated,')
    .concat(calculateCSVData(extractedData));

  siteMapAnalysisData.forEach((singleSiteData) => {
    const urlCookies = reshapeCookies(
      extractCookies(singleSiteData.cookieData, '', false)
    );

    csvData = csvData
      .concat(`${singleSiteData.pageUrl},`)
      .concat(calculateCSVData(urlCookies));
  });

  return csvData;
};

export default generateRootSummaryDataCSV;
