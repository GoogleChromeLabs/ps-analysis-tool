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
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import App from '../app';
import { useCookie } from '../stateProviders';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import { I18n } from '@google-psat/i18n';

jest.mock('../stateProviders/cookie', () => ({
  useCookie: jest.fn(),
}));

const mockUseCookieStore = useCookie as jest.Mock;

describe('App', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
      });
    } as unknown as typeof fetch;

    globalThis.chrome.i18n = null;

    I18n.initMessages({
      firstPartyCookies: {
        message: '1st Party Cookies',
      },
      thirdPartyCookies: {
        message: '3rd Party Cookies',
      },
      noCookies: {
        message: 'No cookies found on this page',
      },
      tryReloading: {
        message: 'Please try reloading the page',
      },
    });
  });

  it('Should show refresh page message if cookie stats are not available', () => {
    mockUseCookieStore.mockReturnValueOnce({
      tabCookieStats: {},
      isCurrentTabBeingListenedTo: true,
    });
    act(() => {
      render(<App />);
    });

    expect(
      screen.getByText('Please try reloading the page')
    ).toBeInTheDocument();
  });

  it('Should show loader', () => {
    mockUseCookieStore.mockReturnValueOnce({
      loading: true,
    });
    act(() => {
      render(<App />);
    });

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('Should show No cookies found on this page message if no firstParty and thirdParty cookies are not available', () => {
    mockUseCookieStore.mockReturnValueOnce({
      isCurrentTabBeingListenedTo: true,
      cookieStats: {
        total: 0,
        firstParty: {
          total: 0,
        },
        thirdParty: {
          total: 0,
        },
      },
      initialProcessed: true,
      totalProcessed: 100,
    });
    act(() => {
      render(<App />);
    });

    expect(
      screen.getByText('No cookies found on this page')
    ).toBeInTheDocument();
  });

  it('Should not show No cookies found on this page message if no firstParty and thirdParty cookies are not available', () => {
    mockUseCookieStore.mockReturnValueOnce({
      isCurrentTabBeingListenedTo: true,
      cookieStats: {
        total: 6,
        blockedCookies: {
          total: 0,
        },
        exemptedCookies: {
          total: 0,
        },
        firstParty: {
          total: 3,
          analytics: 1,
          marketing: 1,
          functional: 1,
          uncategorized: 0,
        },
        thirdParty: {
          total: 3,
          analytics: 1,
          marketing: 1,
          functional: 1,
          uncategorized: 0,
        },
      },
    });
    act(() => {
      render(<App />);
    });

    expect(screen.getAllByText('3').length).toBe(2);
    expect(screen.getByText('1st Party Cookies')).toBeInTheDocument();
    expect(screen.getByText('3rd Party Cookies')).toBeInTheDocument();
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
