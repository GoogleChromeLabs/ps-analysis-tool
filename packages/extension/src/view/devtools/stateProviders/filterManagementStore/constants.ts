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
    order: 2,
  },
  {
    name: 'Path',
    keys: 'parsedCookie.path',
    order: 3,
  },
  {
    name: 'Same Site',
    keys: 'parsedCookie.samesite',
    order: 4,
  },
  {
    name: 'Secure',
    keys: 'parsedCookie.secure',
    type: 'boolean',
    order: 5,
  },
  {
    name: 'HttpOnly',
    keys: 'parsedCookie.httponly',
    type: 'boolean',
    order: 6,
  },
  {
    name: 'Cookie Accepted',
    keys: 'isCookieSet',
    type: 'boolean',
    order: 7,
  },
];

export const CUSTOM_FILTER_MAPPING = {
  scope: {
    name: 'Scope',
    keys: 'isFirstParty',
    filters: new Set(['First Party', 'Third Party']),
    order: 8,
  },
  retentionPeriod: {
    name: 'Retention Period',
    keys: 'retentionPeriod',
    filters: new Set([
      'Session',
      'less than a day',
      'a day to a week',
      'a week to a month',
      'more than a month',
    ]),
    order: 9,
  },
};
