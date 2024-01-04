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

import type { CompleteJson } from '../../../../../types';

export const mockData1: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/',
  technologyData: [
    {
      slug: 'bootstrap',
      name: 'Bootstrap',
      description:
        'Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.',
      confidence: 100,
      version: null,
      icon: 'Bootstrap.svg',
      website: 'https://getbootstrap.com',
      cpe: 'cpe:2.3:a:getbootstrap:bootstrap:*:*:*:*:*:*:*:*',
      categories: [
        {
          id: 66,
          slug: 'ui-frameworks',
          name: 'UI frameworks',
        },
      ],
    },
    {
      slug: 'varnish',
      name: 'Varnish',
      description: 'Varnish is a reverse caching proxy.',
      confidence: 100,
      version: null,
      icon: 'Varnish.svg',
      website: 'https://www.varnish-cache.org',
      cpe: 'cpe:2.3:a:varnish-software:varnish_cache:*:*:*:*:*:*:*:*',
      categories: [
        {
          id: 23,
          slug: 'caching',
          name: 'Caching',
        },
      ],
    },
    {
      slug: 'styled-components',
      name: 'styled-components',
      description:
        'Styled components is a CSS-in-JS styling framework that uses tagged template literals in JavaScript.',
      confidence: 100,
      version: '4.3.2',
      icon: 'styled-components.svg',
      website: 'https://styled-components.com',
      cpe: null,
      categories: [
        {
          id: 12,
          slug: 'javascript-frameworks',
          name: 'JavaScript frameworks',
        },
        {
          id: 47,
          slug: 'development',
          name: 'Development',
        },
      ],
    },
  ],
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
