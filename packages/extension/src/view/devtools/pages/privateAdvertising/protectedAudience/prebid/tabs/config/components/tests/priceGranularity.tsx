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
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import PriceGranularity from '../priceGranularity';

global.chrome = {
  storage: {
    session: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  devtools: {
    inspectedWindow: {
      tabId: 123,
    },
  },
} as unknown as typeof chrome;

describe('PriceGranularity', () => {
  const defaultProps = {
    priceGranularity: 'medium',
    customBucket: {
      buckets: [],
    },
  };

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
    (chrome.storage.session.get as jest.Mock).mockResolvedValue({});
  });

  it('renders table with default price granularity data', () => {
    act(() => render(<PriceGranularity {...defaultProps} />));

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('medium #1')).toBeInTheDocument();
  });

  it('renders table with custom bucket data', () => {
    const customProps = {
      priceGranularity: 'custom',
      customBucket: {
        buckets: [{ precision: 2, min: 0, max: 5, increment: 0.5 }],
      },
    };

    act(() => render(<PriceGranularity {...customProps} />));

    expect(screen.getByText('custom #1')).toBeInTheDocument();
  });

  it('shows preview when row is selected', async () => {
    act(() => render(<PriceGranularity {...defaultProps} />));

    const row = screen.getByText('medium #1');
    act(() => fireEvent.click(row));

    expect(
      screen.queryByText('Select a row to preview')
    ).not.toBeInTheDocument();

    await waitFor(() => screen.getByText('bucket'));
    expect(screen.getByText('bucket')).toBeInTheDocument();
  });

  it('shows empty state when no row is selected', () => {
    render(<PriceGranularity {...defaultProps} />);

    expect(screen.getByText('Select a row to preview')).toBeInTheDocument();
  });
});
