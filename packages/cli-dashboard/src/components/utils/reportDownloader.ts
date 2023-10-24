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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies
 */
import type { CompleteJson, CookieFrameStorageType } from '../../types';

interface NewReport extends CompleteJson {
  affectedCookies: CookieFrameStorageType;
  cookieAnalysisSummary: Record<string, number>;
}

type SanitisedCookieType = ParsedCookie & {
  category: string;
  scope: string;
};
interface SingleTechnology {
  name: string;
  description: string;
  confidence: number;
  website: string;
  categories: string;
}

export const reportDownloader = (
  jsonToBeConverted: CompleteJson[],
  selectedPageUrl?: string | null
) => {
  if (!jsonToBeConverted) {
    return;
  }

  let report: CompleteJson = jsonToBeConverted[0];

  if (selectedPageUrl) {
    report = jsonToBeConverted.find(
      ({ pageUrl }) => pageUrl === selectedPageUrl
    ) as CompleteJson;
  } else {
    report = jsonToBeConverted[0];
  }

  const newReport: NewReport = {
    ...report,
    affectedCookies: {},
    cookieAnalysisSummary: {},
  };

  const cookieDataHeader = [
    'Name',
    'Value',
    'Domain',
    'Path',
    'Expires',
    'Http Only',
    'Scope',
    'Secure',
    'Same Site',
    'Platform',
    'Category',
    'Cookie Affected',
    'GDPRPortal',
  ];

  const technologyDataHeader = [
    'Name',
    'Description',
    'Confidence',
    'Website',
    'Categories',
  ];

  const cookieDataToBeProcessed = report.cookieData;
  const technologyDataToBeProcessed = report.technologyData;

  const summaryDataHeader = ['type', 'value'];

  let cookieDataValues = '';
  let affectedCookiesDataValues = '';
  let technologyDataValues = '';
  let summaryDataValues = '';

  let affectedCookiesCount = 0;
  let totalCookiesCount = 0;
  let thirdPartyCookies = 0;
  let firstPartyCookies = 0;
  let functionalCookies = 0;
  let marketingCookies = 0;
  let uncategorisedCookies = 0;
  let analyticsCookies = 0;
  let affectedFunctionalCookies = 0;
  let affectedMarketingCookies = 0;
  let affectedUncategorisedCookies = 0;
  let affectedAnalyticsCookies = 0;

  newReport.affectedCookies = {};

  const cookiesSet: { [key: string]: SanitisedCookieType } = {};
  const affectedCookiesSet: { [key: string]: SanitisedCookieType } = {};
  Object.keys(cookieDataToBeProcessed).forEach((frameName) => {
    newReport.affectedCookies[frameName] = {};
    Object.keys(cookieDataToBeProcessed[frameName].frameCookies).forEach(
      (cookie) => {
        const unSanitisedCookie =
          cookieDataToBeProcessed[frameName].frameCookies[cookie];
        const sanitizedData = {
          name: unSanitisedCookie.name,
          value: unSanitisedCookie.value.includes(',')
            ? `"${unSanitisedCookie.value}"`
            : unSanitisedCookie.value,
          domain: unSanitisedCookie.domain,
          path: unSanitisedCookie.path,
          expires: unSanitisedCookie.expires,
          httpOnly: unSanitisedCookie.httpOnly,
          scope: unSanitisedCookie?.isFirstParty
            ? 'First Party'
            : 'Third Party',
          secure: unSanitisedCookie.secure,
          sameSite: unSanitisedCookie.sameSite,
          platform: unSanitisedCookie.platform,
          category: unSanitisedCookie.category,
          isCookieSet: !unSanitisedCookie.isBlocked,
          gdprPortal: unSanitisedCookie?.GDPR || 'NA',
        };

        cookiesSet[
          `${sanitizedData.name}:${sanitizedData.domain}:${sanitizedData.path}`
        ] = sanitizedData;

        if (unSanitisedCookie.isBlocked) {
          affectedCookiesSet[
            `${sanitizedData.name}:${sanitizedData.domain}:${sanitizedData.path}`
          ] = sanitizedData;
          newReport.affectedCookies[frameName] = {
            ...newReport.affectedCookies[frameName],
            [cookie]: cookieDataToBeProcessed[frameName].frameCookies[cookie],
          };
        }
      }
    );

    totalCookiesCount =
      totalCookiesCount + report.cookieData[frameName].cookiesCount;
  });

  Object.keys(cookiesSet).map((cookieName: string) => {
    const cookie = cookiesSet[cookieName];
    cookieDataValues =
      cookieDataValues + Object.values(cookie).join(',') + '\r\n';

    if (cookie?.scope === 'First Party') {
      firstPartyCookies++;
    } else {
      thirdPartyCookies++;
    }

    switch (cookie.category) {
      case 'Marketing':
        marketingCookies++;
        break;
      case 'Analytics':
        analyticsCookies++;
        break;
      case 'Uncategorized':
        uncategorisedCookies++;
        break;
      case 'Functional':
        functionalCookies++;
        break;
      default:
        break;
    }
    return cookieName;
  });

  Object.keys(affectedCookiesSet).map((cookieName) => {
    const cookie = affectedCookiesSet[cookieName];

    affectedCookiesCount = affectedCookiesCount + 1;

    switch (cookie.category) {
      case 'Marketing':
        affectedMarketingCookies++;
        break;
      case 'Analytics':
        affectedAnalyticsCookies++;
        break;
      case 'Uncategorized':
        affectedUncategorisedCookies++;
        break;
      case 'Functional':
        affectedFunctionalCookies++;
        break;
      default:
        break;
    }
    affectedCookiesDataValues =
      affectedCookiesDataValues + Object.values(cookie).join(',') + '\r\n';
    return cookieName;
  });

  const cookieDataCSVContent = cookieDataHeader + '\n' + cookieDataValues;

  const affectedCookieDataCSVContent =
    cookieDataHeader + '\n' + affectedCookiesDataValues;

  technologyDataToBeProcessed.forEach((technology) => {
    const singleTechnology: SingleTechnology = {
      name: technology?.name,
      description: technology?.description?.replaceAll(',', ''),
      confidence: technology?.confidence,
      website: technology?.website,
      categories: '',
    };
    const collectedCategories: string[] = [];
    technology.categories.forEach(
      (category: { id: number; name: string; slug: string }) => {
        collectedCategories.push(category.name);
      }
    );
    singleTechnology.categories = collectedCategories.join('|');
    technologyDataValues =
      technologyDataValues + Object.values(singleTechnology).join(',') + '\r\n';
  });

  const technologyDataCSVContent =
    technologyDataHeader + '\n' + technologyDataValues;

  const summaryData = {
    affectedCookies: affectedCookiesCount,
    totalCookies: totalCookiesCount,
    thirdPartyCookies,
    firstPartyCookies,
    functionalCookies,
    marketingCookies,
    uncategorisedCookies,
    analyticsCookies,
    affectedFunctionalCookies,
    affectedMarketingCookies,
    affectedUncategorisedCookies,
    affectedAnalyticsCookies,
  };

  Object.entries(summaryData).forEach(([key, value]) => {
    summaryDataValues = summaryDataValues + `${key}, ${value}\r\n`;
  });

  const summaryDataCSVContent = summaryDataHeader + '\n' + summaryDataValues;

  newReport.cookieAnalysisSummary = summaryData;

  const zip = new JSZip();
  zip.file('cookies.csv', cookieDataCSVContent);
  zip.file('technologies.csv', technologyDataCSVContent);
  zip.file('affected-cookies.csv', affectedCookieDataCSVContent);
  zip.file('report.csv', summaryDataCSVContent);
  zip.file('report.json', JSON.stringify(newReport));
  zip.generateAsync({ type: 'blob' }).then((content) => {
    // see FileSaver.js
    saveAs(content, 'report.zip');
  });
};
