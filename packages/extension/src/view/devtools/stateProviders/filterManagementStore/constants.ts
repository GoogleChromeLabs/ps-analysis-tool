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
import { BLOCKED_REASON_LIST } from '../../../../constants';

export const FILTER_MAPPING = [
  {
    name: 'Category',
    keys: 'analytics.category',
    default: 'Uncategorized',
    sort: true,
    order: 1,
  },
  {
    name: 'Domain',
    keys: 'parsedCookie.domain',
    sort: true,
    order: 3,
  },
  {
    name: 'Size',
    keys: 'parsedCookie.size',
    sort: true,
    order: 13,
  },
  {
    name: 'HttpOnly',
    keys: 'parsedCookie.httponly',
    type: 'boolean',
    order: 4,
  },
  {
    name: 'Secure',
    keys: 'parsedCookie.secure',
    type: 'boolean',
    order: 6,
  },
  {
    name: 'Path',
    keys: 'parsedCookie.path',
    order: 7,
  },
  {
    name: 'Platform',
    keys: 'analytics.platform',
    sort: true,
    order: 9,
  },
];

export const CUSTOM_FILTER_MAPPING = {
  scope: {
    name: 'Scope',
    keys: 'isFirstParty',
    filters: new Set(['First Party', 'Third Party']),
    order: 2,
  },
  priority: {
    name: 'Priority',
    keys: 'parsedCookie.priority',
    filters: new Set(['Low', 'Medium', 'High']),
    order: 12,
  },
  retentionPeriod: {
    name: 'Retention Period',
    keys: 'retentionPeriod',
    filters: new Set([
      'Session',
      'Short Term (< 24h)',
      'Medium Term (24h - 1 week)',
      'Long Term (1 week - 1 month)',
      'Extended Term (> 1 month)',
    ]),
    order: 8,
  },
  cookieBlockedReasons: {
    name: 'Cookie Blocked Reasons',
    keys: 'blockedReasons',
    filters: new Set(BLOCKED_REASON_LIST),
    order: 10,
    description: 'Reason why the cookies were blocked.',
  },
  samesite: {
    name: 'SameSite',
    keys: 'samesite',
    filters: new Set(['Lax', 'None', 'Strict']),
    order: 5,
  },
  setVia: {
    name: 'Set Via',
    keys: 'headerType',
    order: 11,
    filters: new Set(['HTTP', 'JS']),
  },
};

export const MAPPING_KEYS_TO_NAME = {
  samesite: 'SameSite',
  'analytics.category': 'Category',
  'parsedCookie.domain': 'Domain',
  'parsedCookie.httponly': 'HttpOnly',
  'parsedCookie.secure': 'Secure',
  'parsedCookie.path': 'Path',
  'analytics.platform': 'Platform',
  blockedReasons: 'Cookie Blocked Reason',
  headerType: 'Set Via',
  retentionPeriod: 'Retention Period',
  isFirstParty: 'Scope',
  'parsedCookie.priority': 'Priority',
  'parsedCookie.size': 'Size',
};
