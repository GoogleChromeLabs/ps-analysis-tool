/*
 * Copyright 2024 Google LLC
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
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies
 */
import Tabs from '..';
import { useTabs } from '../useTabs';

jest.mock('../useTabs', () => ({
  useTabs: jest.fn(),
}));
const mockUseTabs = useTabs as jest.Mock;

describe('Tabs', () => {
  it('should render', () => {
    const setActiveTab = jest.fn();

    mockUseTabs.mockReturnValue({
      activeTab: 0,
      activeGroup: 'title1',
      titles: ['title1', 'title2'],
      groupedTitles: {
        'group-1': [
          {
            title: 'title1',
            index: 0,
          },
          {
            title: 'title2',
            index: 1,
          },
        ],
      },
      setActiveTab,
      isTabHighlighted: jest.fn((tab: number) => (tab === 0 ? 1 : 99)),
      shouldAddSpacer: jest.fn(() => false),
    });

    render(<Tabs />);

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('title2'));
    expect(setActiveTab).toHaveBeenCalledWith(1);

    expect(screen.getByText('9+')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByText('title2'), { key: 'Tab' });
    expect(setActiveTab).toHaveBeenCalledWith(1);

    fireEvent.keyDown(screen.getByText('title1'), {
      key: 'Tab',
      shiftKey: true,
    });

    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  it('should handle grouped tabs', () => {
    const setActiveTab = jest.fn();

    mockUseTabs.mockReturnValue({
      activeTab: 0,
      activeGroup: 'group-1',
      titles: ['title1', 'title2', 'title3', 'title4'],
      groupedTitles: {
        'group-1': [
          {
            title: 'title1',
            index: 0,
          },
          {
            title: 'title2',
            index: 1,
          },
        ],
        'group-2': [
          {
            title: 'title3',
            index: 2,
          },
          {
            title: 'title4',
            index: 3,
          },
        ],
      },
      setActiveTab,
      shouldAddSpacer: jest.fn(() => false),
      isTabHighlighted: jest.fn(() => false),
    });

    render(<Tabs showBottomBorder={false} />);

    expect(screen.getByText('group-1')).toBeInTheDocument();
    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('group-2'));

    render(<Tabs showBottomBorder={false} />);

    expect(screen.getByText('title3')).toBeInTheDocument();
    expect(screen.getByText('title4')).toBeInTheDocument();

    fireEvent.click(screen.getByText('title3'));
    expect(setActiveTab).toHaveBeenCalledWith(2);

    mockUseTabs.mockReturnValue({
      activeTab: 2,
      activeGroup: 'group-2',
      titles: ['title1', 'title2', 'title3', 'title4'],
      groupedTitles: {
        'group-1': [
          {
            title: 'title1',
            index: 0,
          },
          {
            title: 'title2',
            index: 1,
          },
        ],
        'group-2': [
          {
            title: 'title3',
            index: 2,
          },
          {
            title: 'title4',
            index: 3,
          },
        ],
      },
      setActiveTab,
      shouldAddSpacer: jest.fn(() => false),
      isTabHighlighted: jest.fn(() => false),
    });

    render(<Tabs showBottomBorder={false} />);

    expect(screen.getAllByTestId('group-2')[2]).toHaveClass(
      'border-b-2 border-bright-navy-blue'
    );
  });
});
