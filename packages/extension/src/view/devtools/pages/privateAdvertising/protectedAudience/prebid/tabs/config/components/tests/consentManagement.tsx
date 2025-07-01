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
import { I18n } from '@google-psat/i18n';
import '@testing-library/jest-dom';
/**
 * Internal dependencies
 */
import ConsentManagement from '../consentManagement';

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

describe('ConsentManagement', () => {
  const mockConfig = {
    gdpr: {
      cmpApi: 'iab',
      timeout: 1000,
      allowAuctionWithoutConsent: true,
      defaultGdprScope: true,
    },
    usp: {
      cmpApi: 'static',
      timeout: 2000,
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
  });

  beforeEach(() => {
    jest.spyOn(I18n, 'getMessage').mockImplementation((key) => key);
  });

  it('renders empty state when no config provided', () => {
    render(<ConsentManagement config={undefined} />);
    expect(screen.getByText('selectRowToPreview')).toBeInTheDocument();
  });

  it('renders table with correct data when config provided', () => {
    render(<ConsentManagement config={mockConfig} />);
    expect(screen.getByText('gdpr')).toBeInTheDocument();
    expect(screen.getByText('usp')).toBeInTheDocument();
    expect(screen.getByText('iab')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  it('shows JSON view when row is clicked', async () => {
    (chrome.storage.session.get as jest.Mock).mockResolvedValue({});
    render(<ConsentManagement config={mockConfig} />);
    act(() => fireEvent.click(screen.getByText('gdpr')));
    await waitFor(() => screen.getByText('cmpApi'));

    expect(screen.getByText('cmpApi')).toBeInTheDocument();
  });
});
