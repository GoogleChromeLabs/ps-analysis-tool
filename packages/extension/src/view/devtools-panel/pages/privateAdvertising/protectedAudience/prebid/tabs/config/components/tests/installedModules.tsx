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
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import InstalledModules from '../installedModules';

describe('InstalledModules', () => {
  const mockInstalledModules = [
    'mockBidAdapter',
    'mockAnalyticsAdapter',
    'mockIdSystem',
    'mockMiscModule',
  ];

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    globalThis.chrome.i18n = null;
    I18n.initMessages({
      selectRowToPreview: {
        message: 'Select a row to preview',
      },
    });
  });

  it('renders the component with table rows', () => {
    act(() =>
      render(<InstalledModules installedModules={mockInstalledModules} />)
    );

    expect(screen.getByText('Bid Adapters')).toBeInTheDocument();
    expect(screen.getByText('Analytics Adapters')).toBeInTheDocument();
    expect(screen.getByText('Identity Systems')).toBeInTheDocument();
    expect(screen.getByText('Miscellaneous')).toBeInTheDocument();
  });

  it('shows preview message when no row is selected', () => {
    act(() =>
      render(<InstalledModules installedModules={mockInstalledModules} />)
    );

    expect(screen.getByText('Select a row to preview')).toBeInTheDocument();
  });

  it('shows JsonView when row is selected', () => {
    act(() =>
      render(<InstalledModules installedModules={mockInstalledModules} />)
    );

    const bidAdaptersRow = screen.getByText('Bid Adapters');
    act(() => fireEvent.click(bidAdaptersRow));

    expect(
      screen.queryByText('Select a row to preview')
    ).not.toBeInTheDocument();
  });
});
