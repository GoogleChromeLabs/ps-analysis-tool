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
} from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

const COOKIES_TABLE_DATA_HEADER = [
  I18n.getMessage('extName'),
  I18n.getMessage('extScope'),
  I18n.getMessage('extDomain'),
  I18n.getMessage('extPartitionKey'),
  I18n.getMessage('extSameSite'),
  I18n.getMessage('extCategory'),
  I18n.getMessage('extPlatform'),
  I18n.getMessage('extHttpOnly'),
  I18n.getMessage('extSecure'),
  I18n.getMessage('extValue'),
  I18n.getMessage('extPath'),
  I18n.getMessage('extExpires'),
  I18n.getMessage('extIssues'),
  I18n.getMessage('extGDPRUrl'),
  I18n.getMessage('extPriority'),
  I18n.getMessage('extSize'),
  I18n.getMessage('extBlockingStatus'),
];

const generateCookieTableCSV = (cookies: CookieTableData[]): Blob => {
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
      status = I18n.getMessage('extUndetermined');
    }

    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty
        ? I18n.getMessage('extFirstParty')
        : I18n.getMessage('extThirdParty'),
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      cookie.parsedCookie.samesite,
      cookie.analytics?.category,
      cookie.analytics?.platform,
      cookie.parsedCookie.httponly
        ? I18n.getMessage('extYes')
        : I18n.getMessage('extNo'),
      cookie.parsedCookie.secure
        ? I18n.getMessage('extYes')
        : I18n.getMessage('extNo'),
      cookie.parsedCookie.value,
      cookie.parsedCookie.path,
      cookie.parsedCookie.expires,
      cookie.isBlocked ? I18n.getMessage('extYes') : I18n.getMessage('extNo'),
      cookie.analytics?.gdprUrl || 'NA',
      cookie.parsedCookie.priority || ' ',
      cookie.parsedCookie.size?.toString(),
      status,
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return new Blob([
    COOKIES_TABLE_DATA_HEADER.join(',') + '\r\n' + cookieRecords,
  ]);
};

export default generateCookieTableCSV;
