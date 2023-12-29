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
import { sanitizeCsvRecord } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import type { CompleteJson, CookieJsonDataType } from '../../../types';

export const COOKIES_DATA_HEADER = [
  'Name',
  'Scope',
  'Domain',
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
      cookie.name,
      cookie.isFirstParty ? 'First Party' : 'Third Party',
      cookie.domain,
      cookie.value,
      cookie.sameSite,
      cookie.category,
      cookie.platform,
      cookie.httpOnly ? 'Yes' : 'No',
      cookie.secure ? 'Yes' : 'No',
      cookie.path,
      cookie.expires,
      cookie.isBlocked ? 'Yes' : 'No',
      cookie.GDPR || 'NA',
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return COOKIES_DATA_HEADER.join(',') + '\r\n' + cookieRecords;
};

export default generateAllCookiesCSV;
