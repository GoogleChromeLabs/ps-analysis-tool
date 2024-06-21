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
import type JSZip from 'jszip';
import {
  generateCookiesWithIssuesCSV,
  generateAllCookiesCSV,
  generateSummaryDataCSV,
  generateTechnologyCSV,
  type CompleteJson,
  type DataMapping,
  type TabFrames,
} from '@ps-analysis-tool/common';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
} from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies
 */
import reshapeCookies from '../reshapeCookies';
import extractCookies from '../extractCookies';
import extractReportData from '../extractReportData';

const generateCSVFiles = (data: CompleteJson) => {
  const allCookiesCSV = generateAllCookiesCSV(data);
  let technologyDataCSV = null;
  if (data.technologyData.length > 0) {
    technologyDataCSV = generateTechnologyCSV(data);
  }
  const cookiesWithIssuesDataCSV = generateCookiesWithIssuesCSV(data);
  const summaryDataCSV = generateSummaryDataCSV(data);

  return {
    allCookiesCSV,
    technologyDataCSV,
    cookiesWithIssuesDataCSV,
    summaryDataCSV,
  };
};

/**
 *
 * @param analysisData Anaylsis Data
 * @param url URL
 * @param siteURL
 * @returns Object Report object required to make HTML report
 */
function generateReportObject(analysisData: CompleteJson, siteURL: string) {
  const tabCookies = reshapeCookies(
    extractCookies(analysisData.cookieData, analysisData.pageUrl)
  );

  const tabFrames = Object.values(tabCookies).reduce((acc, cookie) => {
    (cookie.frameUrls as string[]).forEach((url) => {
      if (url?.includes('http')) {
        acc[url] = {} as TabFrames[string];
      }
    });
    return acc;
  }, {} as TabFrames);

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
      title: I18n.getMessage('firstPartyCookies'),
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: I18n.getMessage('thirdPartyCookies'),
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

  return {
    cookieClassificationDataMapping,
    tabCookies,
    cookiesStatsComponents,
    libraryMatches: analysisData.libraryMatches,
    tabFrames,
    showInfoIcon: true,
    showHorizontalMatrix: false,
    blockedCookieDataMapping,
    showBlockedInfoIcon: true,
    frameStateCreator,
    exemptedCookiesDataMapping,
    showBlockedCategory: true,
    url: siteURL,
    source: 'cli',
    // @ts-ignore
    translations: globalThis?.PSAT_DATA?.translations,
  };
}

/**
 *
 * @param analysisData Analysis Data
 * @param sitemapURL URL for the sitemap
 * @returns Object Report object required to make HTML report
 */
function generateSitemapReportObject(
  analysisData: CompleteJson[],
  sitemapURL: string
) {
  const tabCookies = reshapeCookies(
    extractReportData(analysisData).landingPageCookies
  );

  const tabFrames = Object.values(tabCookies).reduce((acc, cookie) => {
    (cookie.frameUrls as string[]).forEach((url) => {
      if (url?.includes('http')) {
        acc[url] = {} as TabFrames[string];
      }
    });
    return acc;
  }, {} as TabFrames);

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
      title: I18n.getMessage('firstPartyCookies'),
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: I18n.getMessage('thirdPartyCookies'),
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

  return {
    cookieClassificationDataMapping,
    tabCookies,
    cookiesStatsComponents,
    libraryDetection: {},
    tabFrames,
    showInfoIcon: true,
    showHorizontalMatrix: false,
    blockedCookieDataMapping,
    showBlockedInfoIcon: true,
    frameStateCreator,
    exemptedCookiesDataMapping,
    showFramesSection: false,
    showBlockedCategory: true,
    url: sitemapURL,
    // @ts-ignore - 'typeof globalThis' has no index signature
    translations: globalThis?.PSAT_DATA?.translations,
  };
}

const generateHTMLFile = (
  analysisData: CompleteJson,
  url: string,
  reportHTML: string
) => {
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(reportHTML, 'text/html');

  // Injections
  const script = reportDom.createElement('script');

  const reportData = generateReportObject(analysisData, url);

  const code = `window.PSAT_DATA = ${JSON.stringify(reportData)}`;

  script.text = code;
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);

  return html;
};

export const generateSiemapHTMLFile = (
  analysisData: CompleteJson[],
  sitemapURL: string,
  reportHTML: string
) => {
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(reportHTML, 'text/html');

  // Injections
  const script = reportDom.createElement('script');

  const reportData = generateSitemapReportObject(analysisData, sitemapURL);

  const code = `window.PSAT_DATA = ${JSON.stringify(reportData)}`;

  script.text = code;
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);

  return html;
};

export const createZip = (
  analysisData: CompleteJson,
  zipObject: JSZip,
  url: string,
  reportHTML: string
) => {
  const {
    allCookiesCSV,
    technologyDataCSV,
    cookiesWithIssuesDataCSV,
    summaryDataCSV,
  } = generateCSVFiles(analysisData);

  const file = generateHTMLFile(analysisData, url, reportHTML);

  zipObject.file('cookies.csv', allCookiesCSV);
  if (technologyDataCSV) {
    zipObject.file('technologies.csv', technologyDataCSV);
  }
  zipObject.file('cookie-issues.csv', cookiesWithIssuesDataCSV);
  zipObject.file('report.csv', summaryDataCSV);
  zipObject.file('report.json', JSON.stringify(analysisData, null, 4));
  zipObject.file('report.html', file);
};

export const getFolderName = (pageUrl: string) => {
  let folderName = pageUrl
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+/g, '-')
    .replace(/\./g, '-');

  if (folderName.endsWith('-')) {
    const lastDashIndex = folderName.lastIndexOf('-');
    folderName = folderName.substring(0, lastDashIndex);
  }

  return folderName;
};
