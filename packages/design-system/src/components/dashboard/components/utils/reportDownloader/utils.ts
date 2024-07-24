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
} from '@google-psat/common';

/**
 * Internal dependencies
 */
import { TableFilter } from '../../../../table';

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

const generateHTMLFile = (
  analysisData: CompleteJson,
  appliedFilters: TableFilter
) => {
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(
    `
    <html>
    ${document.documentElement.innerHTML}
    </html>
    `,
    'text/html'
  );

  const translations =
    // @ts-ignore
    globalThis?.PSAT_DATA?.translations;

  const previousJSONDATA = reportDom.getElementById('JSONDATASCRIPT');
  const styleNodes = reportDom.querySelectorAll('style');

  if (styleNodes.length > 1) {
    styleNodes.forEach((styleNode, index) => {
      if (index !== 0) {
        reportDom.head.removeChild(styleNode);
      }
    });
  }

  if (previousJSONDATA) {
    reportDom.head.removeChild(previousJSONDATA);
  }
  // Injections
  const script = reportDom.createElement('script');

  const reportData = {
    json: [analysisData],
    type: 'url',
    // @ts-ignore -- because this data will already be injected from cli or the extension.
    selectedSite: globalThis?.PSAT_DATA?.selectedSite ?? '',
    translations,
    appliedFilters,
    // @ts-ignore -- because this data will already be injected from cli or the extension.
    dateTime: globalThis?.PSAT_DATA.dateTime,
  };

  let code = `window.PSAT_DATA = ${JSON.stringify(reportData)};`;

  // @ts-ignore -- because this data will already be injected from cli or the extension.
  if (globalThis?.PSAT_EXTENSION) {
    code += `window.PSAT_EXTENSION = true;`;
  }

  script.text = code;
  script.id = 'JSONDATASCRIPT';
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);

  return html;
};

export const generateSitemapHTMLFile = (
  analysisData: CompleteJson[],
  appliedFilters: TableFilter
) => {
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(
    `
    <html>
    ${document.documentElement.innerHTML}
    </html>
    `,
    'text/html'
  );

  const previousJSONDATA = reportDom.getElementById('JSONDATASCRIPT');
  const styleNodes = reportDom.querySelectorAll('style');

  if (styleNodes.length > 1) {
    styleNodes.forEach((styleNode, index) => {
      if (index !== 0) {
        reportDom.head.removeChild(styleNode);
      }
    });
  }

  if (previousJSONDATA) {
    reportDom.head.removeChild(previousJSONDATA);
  }

  // Injections
  const script = reportDom.createElement('script');

  const translations =
    // @ts-ignore
    globalThis?.PSAT_DATA?.translations;

  const reportData = {
    json: analysisData,
    type: 'sitemap',
    // @ts-ignore -- because this data will already be injected from cli or the extension.
    selectedSite: globalThis?.PSAT_DATA?.selectedSite ?? '',
    translations,
    appliedFilters,
  };

  const code = `window.PSAT_DATA = ${JSON.stringify(reportData)}`;

  script.text = code;
  script.id = 'JSONDATASCRIPT';
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);

  return html;
};

export const createZip = (
  analysisData: CompleteJson,
  appliedFilters: TableFilter,
  zipObject: JSZip
) => {
  const {
    allCookiesCSV,
    technologyDataCSV,
    cookiesWithIssuesDataCSV,
    summaryDataCSV,
  } = generateCSVFiles(analysisData);

  const file = generateHTMLFile(analysisData, appliedFilters);

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
