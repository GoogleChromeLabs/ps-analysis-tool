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
import {
  BLOCK_STATUS,
  CookieTableData,
  sanitizeCsvRecord,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

const COOKIES_TABLE_DATA_HEADER_EXTENSION = [
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
  () => I18n.getMessage('priority'),
  () => I18n.getMessage('size'),
  () => I18n.getMessage('blockingStatus'),
];

const generateExtensionCookieTableCSV = (cookies: CookieTableData[]): Blob => {
  let cookieRecords = '';

  for (const cookie of cookies) {
    const isInboundBlocked =
      cookie.blockingStatus?.inboundBlock !== BLOCK_STATUS.NOT_BLOCKED;
    const isOutboundBlocked =
      cookie.blockingStatus?.outboundBlock !== BLOCK_STATUS.NOT_BLOCKED;
    const hasValidBlockedReason =
      cookie?.blockedReasons && cookie.blockedReasons.length !== 0;

    let status = '';

    if ((isInboundBlocked || isOutboundBlocked) && !hasValidBlockedReason) {
      status = I18n.getMessage('undetermined');
    }

    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty
        ? I18n.getMessage('firstParty')
        : I18n.getMessage('thirdParty'),
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      cookie.parsedCookie.samesite,
      I18n.getMessage(
        cookie.analytics?.category?.toLowerCase() || 'uncategorized'
      ),
      cookie.analytics?.platform,
      cookie.parsedCookie.httponly
        ? I18n.getMessage('yes')
        : I18n.getMessage('no'),
      cookie.parsedCookie.secure
        ? I18n.getMessage('yes')
        : I18n.getMessage('no'),
      cookie.parsedCookie.value,
      cookie.parsedCookie.path,
      cookie.parsedCookie.expires,
      cookie.isBlocked ? I18n.getMessage('yes') : I18n.getMessage('no'),
      cookie.analytics?.gdprUrl || 'NA',
      cookie.parsedCookie.priority || ' ',
      cookie.parsedCookie.size?.toString(),
      status,
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return new Blob([
    COOKIES_TABLE_DATA_HEADER_EXTENSION.map((header) => header()).join(',') +
      '\r\n' +
      cookieRecords,
  ]);
};

export default generateExtensionCookieTableCSV;
