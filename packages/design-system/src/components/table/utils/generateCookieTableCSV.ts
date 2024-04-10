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
 * Internal dependencies.
 */
import {
  BLOCK_STATUS,
  CookieTableData,
  sanitizeCsvRecord,
} from '@ps-analysis-tool/common';

const COOKIES_TABLE_DATA_HEADER = [
  'Name',
  'Scope',
  'Domain',
  'Partition Key',
  'Same Site',
  'Blocking Status',
  'Category',
  'Platform',
  'Http Only',
  'Secure',
  'Value',
  'Path',
  'Expires',
  'Issues',
  'GDPRPortal',
  'Priority',
  'Size',
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
      status = 'Undetermined';
    } else if (hasValidBlockedReason) {
      status = 'Blocked';
    } else {
      status = 'Not Blocked';
    }
    //This should be in the same order as cookieDataHeader
    const recordsArray = [
      cookie.parsedCookie.name,
      cookie.isFirstParty ? 'First Party' : 'Third Party',
      cookie.parsedCookie.domain || ' ',
      cookie.parsedCookie.partitionKey || ' ',
      cookie.parsedCookie.samesite,
      status,
      cookie.analytics?.category,
      cookie.analytics?.platform,
      cookie.parsedCookie.httponly ? 'Yes' : 'No',
      cookie.parsedCookie.secure ? 'Yes' : 'No',
      cookie.parsedCookie.value,
      cookie.parsedCookie.path,
      cookie.parsedCookie.expires,
      cookie.isBlocked ? 'Yes' : 'No',
      cookie.analytics?.gdprUrl || 'NA',
      cookie.parsedCookie.priority || ' ',
      cookie.parsedCookie.size?.toString(),
    ].map(sanitizeCsvRecord);

    cookieRecords += recordsArray.join(',') + '\r\n';
  }

  return new Blob([
    COOKIES_TABLE_DATA_HEADER.join(',') + '\r\n' + cookieRecords,
  ]);
};

export default generateCookieTableCSV;
