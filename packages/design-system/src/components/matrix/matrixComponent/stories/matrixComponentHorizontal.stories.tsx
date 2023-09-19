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
import MatrixComponentHorizontal from '../matrixComponentHorizontal';

const meta: Meta<typeof MatrixComponentHorizontal> = {
  title: 'DesignSystem/Matrix/ComponentHorizontal',
  component: MatrixComponentHorizontal,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    title: 'Invalid Cookies',
    description:
      'The cookies which could not be stored in the cookie jar of the browser as they were invalid.',
    count: 20,
    expand: true,
  },
};
