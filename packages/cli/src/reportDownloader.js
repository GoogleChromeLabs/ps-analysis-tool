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
import FileSaver from 'file-saver';

import dummyReport from './out.json' assert { type: 'json' };

export const reportDownloader = (report) => {
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

  const cookieDataValues = [];
  Object.keys(report.cookieData).forEach((frameName) => {
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
    });
  });

  const cookieDataCSVContent =
    'data:text/csv;charset=utf-8,' + cookieDataHeader + '\n' + cookieDataValues;

  const technologyDataValues = [];
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
    'data:text/csv;charset=utf-8,' +
    technologyDataHeader +
    '\n' +
    technologyDataValues;

  const zip = new JSZip();
  zip.file('cookieData.csv', cookieDataCSVContent);
  zip.file('technologyData.csv', technologyDataCSVContent);
  zip.file('completeJson.json', JSON.stringify(report));
  zip.generateAsync({ type: 'blob' }).then((content) => {
    FileSaver.saveAs(content, 'download.zip');
  });
};
reportDownloader(dummyReport);
