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
 * External dependencies.
 */
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import type { CompleteJson, CookieJsonDataType } from '../../cookies.types';
import calculateEffectiveExpiryDate from '../calculateEffectiveExpiryDate';
import sanitizeCsvRecord from '../sanitizeCsvRecord';

export const COOKIES_WITH_ISSUES_DATA_HEADERS = [
  () => I18n.getMessage('name'),
  () => I18n.getMessage('scope'),
  () => I18n.getMessage('domain'),
  () => I18n.getMessage('partitionKey'),
  () => I18n.getMessage('sameSite'),
  () => I18n.getMessage('category'),
  () => I18n.getMessage('platform'),
  () => I18n.getMessage('httpOnly'),
  () => I18n.getMessage('secure'),
  () => I18n.getMessage('value'),
  () => I18n.getMessage('path'),
  () => I18n.getMessage('expires'),
  () => I18n.getMessage('gdpr'),
];

const generateCookiesWithIssuesCSV = (
  siteAnalysisData: CompleteJson
): string => {
  //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
  const isExtension = Boolean(globalThis?.PSAT_EXTENSION);
  if (isExtension) {
    COOKIES_WITH_ISSUES_DATA_HEADERS.push(
      () => I18n.getMessage('priority'),
      () => I18n.getMessage('size')
    );
  }

  const frameCookieDataMap = siteAnalysisData.cookieData;

  const CookieWithIssueMap: Map<string, CookieJsonDataType> = new Map();

  // More than one frame can use one cookie, need to make a map for getting unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      if (cookieData.isBlocked) {
        CookieWithIssueMap.set(cookieKey, cookieData);
      }
    });
  });

  let cookieRecords = '';

  for (const cookie of CookieWithIssueMap.values()) {
    //This should be in the same order as cookieDataHeader
    const expires = calculateEffectiveExpiryDate(cookie.parsedCookie.expires);

    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty
        ? I18n.getMessage('firstParty')
        : I18n.getMessage('thirdParty'),
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      I18n.getMessage((cookie.parsedCookie.samesite ?? 'lax').toLowerCase()),
      I18n.getMessage(
        cookie.analytics?.category?.toLowerCase() || 'uncategorized'
      ),
      cookie.analytics.platform,
      cookie.parsedCookie.httponly
        ? I18n.getMessage('yes')
        : I18n.getMessage('no'),
      cookie.parsedCookie.secure
        ? I18n.getMessage('yes')
        : I18n.getMessage('no'),
      cookie.parsedCookie.value,
      cookie.parsedCookie.path,
      expires === 'Session' ? I18n.getMessage('session') : expires,
      cookie.analytics.GDPR || 'NA',
    ];

    if (isExtension) {
      recordsArray.push(
        I18n.getMessage((cookie.parsedCookie?.priority || ' ').toLowerCase()),
        cookie.parsedCookie?.size?.toString() ?? ' '
      );
    }

    recordsArray.map(sanitizeCsvRecord);
    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return (
    COOKIES_WITH_ISSUES_DATA_HEADERS.map((header) => header()).join(',') +
    '\r\n' +
    cookieRecords
  );
};

export default generateCookiesWithIssuesCSV;
