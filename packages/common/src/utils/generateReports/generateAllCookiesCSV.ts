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
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import {
  CookieTableData,
  type CompleteJson,
  type CookieJsonDataType,
} from '../../cookies.types';
import generateExtensionCookieTableCSV from './generateExtensionCookietableCSV';
import generateCLICookieTableCSV from './generateCLICookieTableCSV';

export const COOKIES_DATA_HEADER = [
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
  () => I18n.getMessage('issues'),
  () => I18n.getMessage('gdpr'),
];

const generateAllCookiesCSV = (siteAnalysisData: CompleteJson): string => {
  const frameCookieDataMap = siteAnalysisData.cookieData;

  const cookieMap: Map<string, CookieJsonDataType> = new Map();
  //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
  const isExtension = Boolean(globalThis?.PSAT_EXTENSION);

  // More than one frame can use one cookie, need to make a map for gettig unique entries.
  Object.entries(frameCookieDataMap).forEach(([, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([cookieKey, cookieData]) => {
      cookieMap.set(cookieKey, cookieData);
    });
  });

  const cookieRecords: CookieTableData[] = [];

  for (const cookie of cookieMap.values()) {
    //@ts-ignore
    cookieRecords.push(cookie);
  }
  if (isExtension) {
    return generateExtensionCookieTableCSV(cookieRecords, true) as string;
  } else {
    return generateCLICookieTableCSV(cookieRecords, true) as string;
  }

  return '';
};

export default generateAllCookiesCSV;
