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
import { COLOR_MAP } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import Legend from '..';

const meta: Meta<typeof Legend> = {
  title: 'Extension/Popup/Legend',
  component: Legend,
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    legendItemList: [
      {
        label: 'Functional',
        count: 10,
        color: COLOR_MAP.functional.color,
        countClassName: COLOR_MAP.functional.className,
      },
      {
        label: 'Marketing',
        count: 20,
        color: COLOR_MAP.marketing.color,
        countClassName: COLOR_MAP.marketing.className,
      },
      {
        label: 'Analytics',
        count: 22,
        color: COLOR_MAP.analytics.color,
        countClassName: COLOR_MAP.analytics.className,
      },
      {
        label: 'Uncategorized',
        count: 11,
        color: COLOR_MAP.uncategorized.color,
        countClassName: COLOR_MAP.uncategorized.className,
      },
    ],
  },
};
