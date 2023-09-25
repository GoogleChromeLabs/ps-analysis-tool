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
import Details from '../details';
import type { CookieTableData } from '@cookie-analysis-tool/common';

const meta = {
  title: 'Extension/DevTools/CookiesPanel/CookieDetails/Details',
  component: Details,
  tags: ['autodocs'],
} as Meta<typeof Details>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    selectedCookie: {
      parsedCookie: {
        name: 'test',
        value: 'v1%3A168740954476563235',
      },
      analytics: {
        description: 'A description of the cookie',
      },
    } as CookieTableData,
  },
};
