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

import dummyReport from './out.json' assert { type: 'json' };
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

  const cookieDataValues = [];
  const affectedCookiesDataValues = [];
  const technologyDataValues = [];
  const summaryDataValues = [];

  let affectedCookiesCount = 0;
  let totalCookiesCount = 0;

  Object.keys(report.cookieData).forEach((frameName) => {
    newReport.affectedCookies[frameName] = {};
    Object.keys(report.cookieData[frameName].frameCookies).forEach((cookie) => {
      const unSanitisedCookie =
        report.cookieData[frameName].frameCookies[cookie];
      const sanitizedData = {
        name: unSanitisedCookie.name,
        value: unSanitisedCookie.value.includes(',')
          ? `"${unSanitisedCookie.value}"`
          : unSanitisedCookie.value,
        domain: unSanitisedCookie.domain,
        path: unSanitisedCookie.path,
        expires: unSanitisedCookie.expires,
        httpOnly: unSanitisedCookie.httpOnly,
        scope: unSanitisedCookie?.scope || 'NA',
        secure: unSanitisedCookie.secure,
        session: unSanitisedCookie.session,
        sameSite: unSanitisedCookie.sameSite,
        platform: unSanitisedCookie.platform,
        category: unSanitisedCookie.category,
        isCookieSet: !unSanitisedCookie.isBlocked,
        gdprPortal: unSanitisedCookie?.gdprPortal || 'NA',
      };

      cookieDataValues.push(Object.values(sanitizedData).join(',') + '\r\n');

      if (unSanitisedCookie.isBlocked) {
        affectedCookiesCount = affectedCookiesCount + 1;

        newReport.affectedCookies[frameName] = {
          ...newReport.affectedCookies[frameName],
          cookie: report.cookieData[frameName].frameCookies[cookie],
        };

        affectedCookiesDataValues.push(
          Object.values(sanitizedData).join(',') + '\r\n'
        );
      }
    });

    totalCookiesCount =
      totalCookiesCount + report.cookieData[frameName].cookieCount;
  });

  const cookieDataCSVContent = cookieDataHeader + '\n' + cookieDataValues;

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
    technologyDataValues.push(
      Object.values(singleTechnology).join(',') + '\r\n'
    );
  });

  const technologyDataCSVContent =
    technologyDataHeader + '\n' + technologyDataValues;

  const summaryData = {
    affectedCookies: affectedCookiesCount,
    totalCookies: totalCookiesCount,
    thirdPartyCookies: 0,
    firstPartyCookies: 0,
    functionalCookies: 0,
    marketingCookies: 0,
    uncategorisedCookies: 0,
    analyticsCookies: 0,
    affectedFunctionalCookies: 0,
    affectedMarketingCookies: 0,
    affectedUncategorisedCookies: 0,
    affectedAnalyticsCookies: 0,
  };

  Object.entries(summaryData).forEach(([key, value]) => {
    summaryDataValues.push(`${key}, ${value}\r\n`);
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
    .pipe(createWriteStream('sample.zip'))
    .on('finish', () => {
      console.log('sample.zip written.');
    });
};
reportDownloader(dummyReport);
