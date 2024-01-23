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
import sanitizeCsvRecord from '../sanitizeCsvRecord';
/**
 * Internal dependencies
 */
import type { CompleteJson, CookieJsonDataType } from '../../cookies.types';

export const COOKIES_DATA_HEADER = [
  'Name',
  'Scope',
  'Domain',
  'Partition Key',
  'Same Site',
  'Category',
  'Platform',
  'Http Only',
  'Secure',
  'Value',
  'Path',
  'Expires',
  'Cookie Affected',
  'GDPRPortal',
];

const generateAllCookiesCSV = (siteAnalysisData: CompleteJson): string => {
  const frameCookieDataMap = siteAnalysisData.cookieData;

  const cookieMap: Map<string, CookieJsonDataType> = new Map();

  // More than one frame can use one cookie, need to make a map for gettig unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      cookieMap.set(cookieKey, cookieData);
    });
  });

  let cookieRecords = '';

  for (const cookie of cookieMap.values()) {
    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty ? 'First Party' : 'Third Party',
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      cookie.parsedCookie.value,
      cookie.parsedCookie.sameSite,
      cookie.analytics.category,
      cookie.analytics.platform,
      cookie.parsedCookie.httpOnly ? 'Yes' : 'No',
      cookie.parsedCookie.secure ? 'Yes' : 'No',
      cookie.parsedCookie.path,
      cookie.parsedCookie.expires,
      cookie.isBlocked ? 'Yes' : 'No',
      cookie.analytics.GDPR || 'NA',
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return COOKIES_DATA_HEADER.join(',') + '\r\n' + cookieRecords;
};

export default generateAllCookiesCSV;
