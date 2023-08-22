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
  sameSite: {
    name: 'Same Site',
    keys: 'parsedCookie.samesite',
    order: 5,
    filters: new Set(['None', 'Lax', 'Strict']),
  },
  httpOnly: {
    name: 'HttpOnly',
    keys: 'parsedCookie.httponly',
    filters: new Set(['True', 'False']),
    order: 4,
  },
  secure: {
    name: 'Secure',
    keys: 'parsedCookie.secure',
    filters: new Set(['True', 'False']),
    order: 6,
  },
  cookieAccepted: {
    name: 'Cookie Accepted',
    keys: 'isCookieSet',
    filters: new Set(['True', 'False']),
    order: 10,
    description:
      "Whether the cookie was accepted(set) in Chrome's Cookie Store",
  },
  retentionPeriod: {
    name: 'Retention Period',
    keys: 'parsedCookie.expires',
    filters: new Set([
      'Session',
      'Short Term (< 24h)',
      'Medium Term (24h - 1 week)',
      'Long Term (1 week - 1 month)',
      'Extended Term (> 1 month)',
    ]),
    order: 8,
  },
};
