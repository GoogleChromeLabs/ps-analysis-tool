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
import { CookieTableData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import CookieDetails from '..';

const meta = {
  title: 'DesignSystem/CookieDetails',
  component: CookieDetails,
  tags: ['autodocs'],
} as Meta<typeof CookieDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    selectedFrameCookie: {
      testFrame: {
        parsedCookie: {
          name: 'test',
          value: 'testVal',
        },
      } as CookieTableData,
    },
    isUsingCDP: false,
  },
};
