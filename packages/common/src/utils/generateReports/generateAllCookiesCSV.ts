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
import { I18n } from '@ps-analysis-tool/i18n';
/**
 * Internal dependencies
 */
import {
  type CompleteJson,
  type CookieJsonDataType,
} from '../../cookies.types';
import calculateEffectiveExpiryDate from '../calculateEffectiveExpiryDate';

export const COOKIES_DATA_HEADER = [
  I18n.getMessage('cmName'),
  I18n.getMessage('cmScope'),
  I18n.getMessage('cmDomain'),
  I18n.getMessage('cmPartitionKey'),
  I18n.getMessage('cmSameSite'),
  I18n.getMessage('cmCategory'),
  I18n.getMessage('cmPlatform'),
  I18n.getMessage('cmHttpOnly'),
  I18n.getMessage('cmSecure'),
  I18n.getMessage('cmValue'),
  I18n.getMessage('cmPath'),
  I18n.getMessage('cmExpires'),
  I18n.getMessage('cmIssues'),
  I18n.getMessage('cmGDPR'),
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
      cookie.isFirstParty
        ? I18n.getMessage('cmFirstParty')
        : I18n.getMessage('cmThirdParty'),
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      cookie.parsedCookie.sameSite,
      cookie.analytics.category,
      cookie.analytics.platform,
      cookie.parsedCookie.httpOnly
        ? I18n.getMessage('cmYes')
        : I18n.getMessage('cmNo'),
      cookie.parsedCookie.secure
        ? I18n.getMessage('cmYes')
        : I18n.getMessage('cmNo'),
      cookie.parsedCookie.value,
      cookie.parsedCookie.path,
      calculateEffectiveExpiryDate(cookie.parsedCookie.expires),
      cookie.isBlocked ? I18n.getMessage('cmYes') : I18n.getMessage('cmNo'),
      cookie.analytics.GDPR || 'NA',
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return COOKIES_DATA_HEADER.join(',') + '\r\n' + cookieRecords;
};

export default generateAllCookiesCSV;
