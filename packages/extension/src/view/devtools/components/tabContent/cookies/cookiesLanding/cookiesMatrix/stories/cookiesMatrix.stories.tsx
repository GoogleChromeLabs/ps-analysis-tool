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
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import CookiesMatrix from '..';

const meta: Meta<typeof CookiesMatrix> = {
  title: 'Extension/DevTools/CookiesLandingPage/CookiesMatrix',
  component: CookiesMatrix,
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    tabCookies: {
      _GRECAPTCHA: {
        // @ts-ignore
        analytics: {
          category: 'Functional',
        },
        isFirstParty: false,
        // @ts-ignore
        parsedCookie: {
          domain: '.google.com',
        },
        url: 'https://www.google.com/recaptcha/api2/reload?k=6Le6JpwaAAAAAFkASVap1OUThl-lQSJC0r9kLl2I',
        isCookieSet: false,
      },
      _ga: {
        // @ts-ignore
        analytics: {
          category: 'Analytics',
        },
        isFirstParty: true,
        // @ts-ignore
        parsedCookie: {
          domain: '.rtcamp.com',
        },
        url: 'https://rtcamp.com/',
        isCookieSet: true,
      },
    },
    cookiesStatsComponents: {
      legend: [
        {
          label: 'Functional',
          count: 1,
          color: '#5CC971',
          countClassName: 'text-functional',
        },
        {
          label: 'Marketing',
          count: 0,
          color: '#F3AE4E',
          countClassName: 'text-marketing',
        },
        {
          label: 'Analytics',
          count: 2,
          color: '#4C79F4',
          countClassName: 'text-analytics',
        },
        {
          label: 'Uncategorized',
          count: 4,
          color: '#EC7159',
          countClassName: 'text-uncategorized',
        },
      ],
      firstParty: [
        {
          count: 0,
          color: '#5CC971',
        },
        {
          count: 0,
          color: '#F3AE4E',
        },
        {
          count: 2,
          color: '#4C79F4',
        },
        {
          count: 4,
          color: '#EC7159',
        },
      ],
      thirdParty: [
        {
          count: 1,
          color: '#5CC971',
        },
        {
          count: 0,
          color: '#F3AE4E',
        },
        {
          count: 0,
          color: '#4C79F4',
        },
        {
          count: 0,
          color: '#EC7159',
        },
      ],
    },
    tabFrames: {
      'https://example.com': {
        frameIds: [0, 0],
      },
      'https://www.google.com': {
        frameIds: [6169, 6172, 6169, 6172],
      },
    },
  },
};
