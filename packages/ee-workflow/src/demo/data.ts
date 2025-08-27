/*
 * Copyright 2025 Google LLC
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

export const downArrowData =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNWY2MzY4Ij48cGF0aCBkPSJNNDgwLTIwMCAyNDAtNDQwbDQyLTQyIDE5OCAxOTggMTk4LTE5OCA0MiA0Mi0yNDAgMjQwWm0wLTI1M0wyNDAtNjkzbDQyLTQyIDE5OCAxOTggMTk4LTE5OCA0MiA0Mi0yNDAgMjQwWiIvPjwvc3ZnPg==';

export const upArrowData =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNWY2MzY4Ij48cGF0aCBkPSJtMjgyLTIyNS00Mi00MiAyNDAtMjQwIDI0MCAyNDAtNDIgNDItMTk4LTE5OC0xOTggMTk4Wm0wLTI1My00Mi00MiAyNDAtMjQwIDI0MCAyNDAtNDIgNDItMTk4LTE5OC0xOTggMTk4WiIvPjwvc3ZnPg==';

export const nodes = [
  {
    type: 'advertiser',
    website: 'adv1.com',
    datetime: '2023-10-01 10:00',
    igGroupsCount: 3,
    interestGroups: ['shoes', 'heels', 'phones'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv2.com',
    datetime: '2023-10-01 11:00',
    igGroupsCount: 2,
    interestGroups: ['stilletos', 'shorts'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub1.com',
    datetime: '2023-10-01 12:00',
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv3.com',
    datetime: '2023-10-01 13:00',
    igGroupsCount: 2,
    interestGroups: ['bike', 'car'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv5.com',
    datetime: '2023-10-01 13:02',
    igGroupsCount: 3,
    interestGroups: ['football', 'basketball', 'baseball'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub2.com',
    datetime: '2023-10-01 14:00',
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv6.com',
    datetime: '2023-10-01 14:01',
    igGroupsCount: 3,
    interestGroups: ['movies', 'series', 'books'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv7.com',
    datetime: '2023-10-01 15:00',
    igGroupsCount: 3,
    interestGroups: ['IGG220', 'IGG201', 'IG225'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub3.com',
    datetime: '2023-10-01 16:00',
    visited: false,
    visitedIndex: null,
  },
];
