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
import LandingHeader from '..';

const meta: Meta<typeof LandingHeader> = {
  title: 'Extension/DevTools/CookiesLandingPage/Header',
  component: LandingHeader,
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    cookieStats: {
      total: 7,
      firstParty: {
        total: 6,
        functional: 0,
        marketing: 0,
        analytics: 2,
        uncategorized: 4,
      },
      thirdParty: {
        total: 1,
        functional: 1,
        marketing: 0,
        analytics: 0,
        uncategorized: 0,
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
  },
};
