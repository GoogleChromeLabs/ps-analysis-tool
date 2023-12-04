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
import type { CompleteJson, CookieJsonDataType } from '../../../types';

export const affectedCookieDataHeader = [
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
  'GDPRPortal',
];

const generateAffectedCookiesCSV = (siteAnalysisData: CompleteJson): string => {
  const frameCookieDataMap = siteAnalysisData.cookieData;

  const affectedCookieMap: Map<string, CookieJsonDataType> = new Map();

  // More than one frame can use one cookie, need to make a map for gettig unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      if (cookieData.isBlocked) {
        affectedCookieMap.set(cookieKey, cookieData);
      }
    });
  });

  let cookieRecords = '';

  for (const cookie of affectedCookieMap.values()) {
    //@TODO sanitize array elements
    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.name,
      cookie.value,
      cookie.domain,
      cookie.path,
      cookie.expires,
      cookie.httpOnly,
      cookie.isFirstParty ? 'First Party' : 'Third Party',
      cookie.secure,
      cookie.sameSite,
      cookie.platform,
      cookie.category,
      cookie.GDPR || 'NA',
    ];

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return affectedCookieDataHeader.join(',') + '\r\n' + cookieRecords;
};

export default generateAffectedCookiesCSV;
