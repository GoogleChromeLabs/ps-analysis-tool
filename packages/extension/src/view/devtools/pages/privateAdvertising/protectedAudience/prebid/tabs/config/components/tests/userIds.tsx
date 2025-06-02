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
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import UserIds from '../userIds';

describe('UserIds', () => {
  const mockConfig = [
    {
      name: 'id1',
      storage: {
        type: 'cookie',
        expires: '30',
        name: 'test_cookie',
      },
    },
    {
      name: 'id2',
      storage: {
        type: 'html5',
        expires: '60',
        name: 'test_storage',
      },
    },
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

  it('renders table with user ID data', () => {
    render(<UserIds config={mockConfig} />);

    expect(screen.getByText('id1')).toBeInTheDocument();
    expect(screen.getByText('cookie')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('test_cookie')).toBeInTheDocument();
  });

  it('shows preview message when no row is selected', () => {
    render(<UserIds config={mockConfig} />);

    expect(screen.getByText('Select a row to preview')).toBeInTheDocument();
  });

  it('displays JSON view when row is selected', async () => {
    render(<UserIds config={mockConfig} />);

    const row = screen.getByText('id1');
    fireEvent.click(row);

    expect(
      screen.queryByText('Select a row to preview')
    ).not.toBeInTheDocument();

    await waitFor(() => screen.getByText('name'));
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('storage')).toBeInTheDocument();
  });

  it('handles empty config', () => {
    render(<UserIds config={[]} />);

    expect(screen.getByText('Select a row to preview')).toBeInTheDocument();
  });
});
