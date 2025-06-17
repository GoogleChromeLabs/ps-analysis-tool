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
import { fireEvent, render, screen } from '@testing-library/react';
import { type PrebidEvents } from '@google-psat/common';
/**
 * Internal dependencies
 */
import Events from '..';

describe('Events Component', () => {
  const mockErrorEvents: PrebidEvents['errorEvents'] = [
    {
      type: 'ERROR',
      message: ['Error message 1'],
      time: '2025-05-22T10:00:00Z',
    },
    {
      type: 'WARNING',
      message: ['Warning message 1'],
      time: '2025-05-22T11:00:00Z',
    },
  ];

  it('renders without crashing', () => {
    act(() => {
      render(<Events errorEvents={mockErrorEvents} />);
    });

    expect(screen.getByText('2 Issues')).toBeTruthy();
    expect(screen.getByText('Error message 1')).toBeTruthy();
    expect(screen.getByText('Warning message 1')).toBeTruthy();
  });

  it('filters events based on search value', () => {
    act(() => {
      render(<Events errorEvents={mockErrorEvents} />);
    });

    const searchInput = screen.getByRole('textbox');

    if (!searchInput) {
      return;
    }

    fireEvent.change(searchInput, { target: { value: 'Error' } });

    expect(screen.getByText('Error message 1')).toBeTruthy();
    expect(screen.queryByText('Warning message 1')).toBeFalsy();
  });

  it('filters events based on dropdown selection', () => {
    act(() => {
      render(<Events errorEvents={mockErrorEvents} />);
    });

    const dropdown = screen.getByText('All levels');
    act(() => {
      dropdown.click();
    });
    fireEvent.click(screen.getByText('Warnings', { exact: true }));

    expect(screen.getByText('Error message 1', { exact: true })).toBeTruthy();
    expect(screen.queryByText('Warning message 1')).toBeFalsy();
  });
});
