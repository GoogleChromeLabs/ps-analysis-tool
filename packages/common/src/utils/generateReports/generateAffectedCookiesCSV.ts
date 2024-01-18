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
import { CompleteJson, CookieJsonDataType } from '../../cookies.types';
import sanitizeCsvRecord from '../sanitizeCsvRecord';

export const AFFECTED_COOKIES_DATA_HEADERS = [
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
  'GDPRPortal',
];

const generateAffectedCookiesCSV = (siteAnalysisData: CompleteJson): string => {
  const frameCookieDataMap = siteAnalysisData.cookieData;

  const affectedCookieMap: Map<string, CookieJsonDataType> = new Map();

  // More than one frame can use one cookie, need to make a map for getting unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      if (cookieData.isBlocked) {
        affectedCookieMap.set(cookieKey, cookieData);
      }
    });
  });

  let cookieRecords = '';

  for (const cookie of affectedCookieMap.values()) {
    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty ? 'First Party' : 'Third Party',
      cookie.parsedCookie.domain,
      cookie.parsedCookie.value,
      cookie.parsedCookie.sameSite,
      cookie.analytics.category,
      cookie.analytics.platform,
      cookie.parsedCookie.httpOnly ? 'Yes' : 'No',
      cookie.parsedCookie.secure ? 'Yes' : 'No',
      cookie.parsedCookie.path,
      cookie.parsedCookie.expires,
      cookie.GDPR || 'NA',
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return AFFECTED_COOKIES_DATA_HEADERS.join(',') + '\r\n' + cookieRecords;
};

export default generateAffectedCookiesCSV;
