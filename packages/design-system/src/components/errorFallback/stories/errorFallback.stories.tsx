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
import ErrorFallback from '..';

const meta: Meta<typeof ErrorFallback> = {
  title: 'DesignSystem/ErrorFallback',
  component: ErrorFallback,
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    error: {
      message: 'Uncaught Error: No code found in this project - Line#22',
    },
  },
};

export const ContextInvalidated: StoryObj<typeof meta> = {
  args: {
    error: {
      message: 'Extension context invalidated.',
    },
  },
};
