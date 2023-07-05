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
  },
  {
    name: 'Domain',
    keys: 'parsedCookie.domain',
  },
  {
    name: 'Path',
    keys: 'parsedCookie.path',
  },
  {
    name: 'Same Site',
    keys: 'parsedCookie.samesite',
  },
  {
    name: 'Retention Period',
    keys: 'analytics.retention',
  },
  {
    name: 'Third Party',
    keys: 'thirdParty',
    type: 'boolean',
  },
  {
    name: 'Secure',
    keys: 'parsedCookie.secure',
    type: 'boolean',
  },
  {
    name: 'HttpOnly',
    keys: 'parsedCookie.httponly',
    type: 'boolean',
  },
];
