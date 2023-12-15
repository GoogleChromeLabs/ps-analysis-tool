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
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import CirclePieChart from '..';
import { COLOR_MAP } from '../../../theme/colors';

const meta: Meta<typeof CirclePieChart> = {
  title: 'DesignSystem/CirclePieChart',
  component: CirclePieChart,
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    centerCount: 39,
    title: '1st party cookies',
    data: [
      {
        count: 5,
        color: COLOR_MAP.functional.color,
      },
      {
        count: 4,
        color: COLOR_MAP.marketing.color,
      },
      {
        count: 0,
        color: COLOR_MAP.analytics.color,
      },
      {
        count: 9,
        color: COLOR_MAP.uncategorized.color,
      },
    ],
  },
  render: (args) => (
    <div className="w-16">
      <CirclePieChart {...args} />
    </div>
  ),
};

export const Wide: StoryObj<typeof meta> = {
  args: {
    centerCount: 39,
    title: '1st party cookies',
    data: [
      {
        count: 5,
        color: COLOR_MAP.functional.color,
      },
      {
        count: 4,
        color: COLOR_MAP.marketing.color,
      },
      {
        count: 0,
        color: COLOR_MAP.analytics.color,
      },
      {
        count: 9,
        color: COLOR_MAP.uncategorized.color,
      },
    ],
  },
  render: (args) => (
    <div className="w-28 text-center">
      <CirclePieChart {...args} />
    </div>
  ),
};
