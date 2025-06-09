/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
/**
 * Internal dependencies
 */
import PrebidConfig from '../prebidConfig';

describe('PrebidConfig', () => {
  const mockConfigObject = {
    testKey1: 'testValue1',
    testKey2: true,
    testKey3: 42,
  };

  it('renders table with config data', () => {
    act(() => render(<PrebidConfig configObject={mockConfigObject} />));

    expect(screen.getByText('testKey1')).toBeInTheDocument();
    expect(screen.getByText('testValue1')).toBeInTheDocument();
    expect(screen.getByText('testKey2')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('testKey3')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('handles row selection', () => {
    act(() => render(<PrebidConfig configObject={mockConfigObject} />));

    const firstRow = screen.getByText('testKey1').closest('tr');
    if (!firstRow) {
      throw Error('Cannot find first row.');
    }
    act(() => fireEvent.click(firstRow));
    expect(firstRow).toHaveClass('bg-lavender-sky dark:bg-midnight-slate');

    const secondRow = screen.getByText('testKey2').closest('tr');
    if (!secondRow) {
      throw Error('Cannot find second row.');
    }
    act(() => fireEvent.click(secondRow));
    expect(firstRow).not.toHaveClass('bg-lavender-sky dark:bg-midnight-slate');
    expect(secondRow).toHaveClass('bg-lavender-sky dark:bg-midnight-slate');
  });
});
