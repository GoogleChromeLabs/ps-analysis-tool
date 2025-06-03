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
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
/**
 * Internal dependencies
 */
import Header from '../header';
import { PrebidEvents } from '../../../../../../../../../store';

describe('Header Component', () => {
  const mockSetSelectedDropdownValues = jest.fn();
  const mockSetSearchValue = jest.fn();
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
    render(
      <Header
        errorEvents={mockErrorEvents}
        filteredErrorEvents={mockErrorEvents}
        setSelectedDropdownValues={mockSetSelectedDropdownValues}
        setSearchValue={mockSetSearchValue}
        selectedDropDownValues={['ALL']}
        searchValue=""
      />
    );

    expect(screen.getByText('2 Issues')).toBeTruthy();
    expect(screen.getByTitle('1 warnings')).toBeTruthy(); // Errors count
    expect(screen.getByTitle('1 errors')).toBeTruthy(); // Warnings count
  });

  it('calls setSearchValue when search input changes', () => {
    render(
      <Header
        errorEvents={mockErrorEvents}
        filteredErrorEvents={mockErrorEvents}
        setSelectedDropdownValues={mockSetSelectedDropdownValues}
        setSearchValue={mockSetSearchValue}
        selectedDropDownValues={['ALL']}
        searchValue=""
      />
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockSetSearchValue).toHaveBeenCalledWith('test');
  });

  it('calls setSelectedDropdownValues when dropdown changes', () => {
    render(
      <Header
        errorEvents={mockErrorEvents}
        filteredErrorEvents={mockErrorEvents}
        setSelectedDropdownValues={mockSetSelectedDropdownValues}
        setSearchValue={mockSetSearchValue}
        selectedDropDownValues={['ALL']}
        searchValue=""
      />
    );

    const dropdown = screen.getByText('All levels');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByText('Warnings'));

    expect(mockSetSelectedDropdownValues).toHaveBeenCalled();
  });
});
