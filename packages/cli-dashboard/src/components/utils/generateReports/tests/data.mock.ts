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

import type { CompleteJson } from '../../../../types';

export const mockData1: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/',
  technologyData: [],
  cookieData: {
    'https://edition.cnn.com': {
      cookiesCount: 2,
      frameCookies: {
        'aniC:.aniview.com:/': {
          name: 'aniC',
          value: '1701171490978-172028097154-001000-014-006837',
          domain: '.aniview.com',
          path: '/',
          expires: '2023-12-18T04:40:15.773Z',
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: false,
        },
        '1_C_78:.aniview.com:/': {
          name: '1_C_78',
          value: 'y-VtIM9z9E2uLA7R8YJPsMjYl829FyKbka~A',
          domain: '.aniview.com',
          path: '/',
          expires: '2023-12-18T04:25:51.777Z',
          httpOnly: false,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: false,
        },
      },
    },
    'https://s.amazon-adsystem.com': {
      cookiesCount: 1,
      frameCookies: {
        'ad-id:.amazon-adsystem.com:/': {
          name: 'ad-id',
          value: 'A7I1e9XiFEw6tE_FYubHJnE|t',
          domain: '.amazon-adsystem.com',
          path: '/',
          expires: '2023-12-18T09:22:30.184Z',
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Amazon',
          category: 'Marketing',
          GDPR: 'https://amazon.com/privacy/',
          description:
            'Clickthroughs to Amazon websites: Noting how the user got to Amazon via this website',
          isFirstParty: false,
        },
      },
    },
  },
};

export const mockData2: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/',
  technologyData: [],
  cookieData: {
    'https://edition.cnn.com': {
      cookiesCount: 2,
      frameCookies: {
        'aniC:.aniview.com:/': {
          name: 'aniC',
          value: 'value',
          domain: '.aniview.com',
          path: '/',
          expires: '2023-12-18T04:40:15.773Z',
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: false,
        },
        '1_C_78:.aniview.com:/': {
          name: '1_C_78',
          value: 'value2',
          domain: '.aniview.com',
          path: '/',
          expires: '2023-12-18T04:25:51.777Z',
          httpOnly: false,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: false,
        },
        'usprivacy:.cnn.com:/': {
          name: 'usprivacy',
          value: 'val',
          domain: '.cnn.com',
          path: '/',
          expires: '2023-11-28T11:38:36.290Z',
          httpOnly: false,
          secure: true,
          sameSite: 'None',
          isBlocked: false,
          platform: 'ShareThis',
          category: 'Functional',
          GDPR: 'https://sharethis.com/privacy/',
          description:
            'ShareThis reads if the usprivacy cookie is present in the publisher domain.',
          isFirstParty: true,
        },
      },
    },
    'https://s.amazon-adsystem.com': {
      cookiesCount: 2,
      frameCookies: {
        'ad-id:.amazon-adsystem.com:/': {
          name: 'ad-id',
          value: 'value3',
          domain: '.amazon-adsystem.com',
          path: '/',
          expires: '2023-12-18T09:22:30.184Z',
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Amazon',
          category: 'Marketing',
          GDPR: 'https://amazon.com/privacy/',
          description:
            'Clickthroughs to Amazon websites: Noting how the user got to Amazon via this website',
          isFirstParty: false,
        },
        '1_C_78:.aniview.com:/': {
          name: '1_C_78',
          value: 'y-VtIM9z9E2uLA7R8YJPsMjYl829FyKbka~A',
          domain: '.aniview.com',
          path: '/',
          expires: '2023-12-18T04:25:51.777Z',
          httpOnly: false,
          secure: true,
          sameSite: 'None',
          isBlocked: true,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: false,
        },
      },
    },
  },
};
