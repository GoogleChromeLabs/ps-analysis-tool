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
import { createWriteStream } from 'fs';

export const reportDownloader = (report) => {
  const newReport = report;
  const cookieDataHeader = [
    'name',
    'value',
    'domain',
    'path',
    'expires',
    'httpOnly',
    'scope',
    'secure',
    'session',
    'sameSite',
    'platform',
    'category',
    'isCookieSet',
    'gdprPortal',
  ];

  const technologyDataHeader = [
    'name',
    'description',
    'confidence',
    'website',
    'categories',
  ];

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

  Object.keys(report.cookieData.cookieData).forEach((frameName) => {
    newReport.affectedCookies[frameName] = {};
    Object.keys(report.cookieData.cookieData[frameName].frameCookies).forEach(
      (cookie) => {
        const unSanitisedCookie =
          report.cookieData.cookieData[frameName].frameCookies[cookie];
        const sanitizedData = {
          name: unSanitisedCookie.name,
          value: unSanitisedCookie.value.includes(',')
            ? `"${unSanitisedCookie.value}"`
            : unSanitisedCookie.value,
          domain: unSanitisedCookie.domain,
          path: unSanitisedCookie.path,
          expires: unSanitisedCookie.expires.includes(',')
            ? `"${unSanitisedCookie.expires}"`
            : unSanitisedCookie.expires,
          httpOnly: unSanitisedCookie.httpOnly,
          scope: unSanitisedCookie?.isFirstParty
            ? 'First Party'
            : 'Third Party',
          secure: unSanitisedCookie.secure,
          session: unSanitisedCookie.session,
          sameSite: unSanitisedCookie.sameSite,
          platform: unSanitisedCookie.platform,
          category: unSanitisedCookie.category,
          isCookieSet: !unSanitisedCookie.isBlocked,
          gdprPortal: unSanitisedCookie?.GDPR || 'NA',
        };

        cookieDataValues =
          cookieDataValues + Object.values(sanitizedData).join(',') + '\r\n';

        if (unSanitisedCookie?.isFirstParty) {
          firstPartyCookies++;
        } else {
          thirdPartyCookies++;
        }

        switch (unSanitisedCookie.category) {
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

        if (unSanitisedCookie.isBlocked) {
          affectedCookiesCount = affectedCookiesCount + 1;

          newReport.affectedCookies[frameName] = {
            ...newReport.affectedCookies[frameName],
            [cookie]:
              report.cookieData.cookieData[frameName].frameCookies[cookie],
          };
          switch (unSanitisedCookie.category) {
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
            affectedCookiesDataValues +
            Object.values(sanitizedData).join(',') +
            '\r\n';
        }
      }
    );

    totalCookiesCount =
      totalCookiesCount + report.cookieData.cookieData[frameName].cookiesCount;
  });

  const cookieDataCSVContent = cookieDataHeader + '\n' + cookieDataValues;

  console.log(cookieDataCSVContent);

  const affectedCookieDataCSVContent =
    cookieDataHeader + '\n' + affectedCookiesDataValues;

  report.technologyData.forEach((technology) => {
    const singleTechnology = {
      name: technology?.name,
      description: technology?.description?.replaceAll(',', ''),
      confidence: technology?.confidence,
      website: technology?.website,
      categories: [],
    };
    technology.categories.forEach((category) => {
      singleTechnology.categories.push(category.name);
    });
    singleTechnology.categories = singleTechnology.categories.join('|');
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
  zip.file('cookieData.csv', cookieDataCSVContent);
  zip.file('technologyData.csv', technologyDataCSVContent);
  zip.file('affectedCookiesData.csv', affectedCookieDataCSVContent);
  zip.file('summaryData.csv', summaryDataCSVContent);
  zip.file('completeJson.json', JSON.stringify(newReport));
  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream('data.zip'))
    .on('finish', () => {
      console.log('sample.zip written.');
    });
};
