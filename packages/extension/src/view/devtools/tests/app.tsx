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
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import App from '../app';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'cookie-analysis-tool/data/PSInfo.json';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import { noop } from '../../../utils/noop';

jest.mock('../stateProviders/syncCookieStore', () => ({
  useCookieStore: jest.fn(),
}));

const mockUseCookieStore = useCookieStore as jest.Mock;

describe('App', () => {
  beforeAll(() => {
    mockUseCookieStore.mockReturnValue({
      isCurrentTabBeingListenedTo: true,
      returningToSingleTab: false,
      changeListeningToThisTab: noop,
      setSelectedFrame: noop,
      allowedNumberOfTabs: 'single-tab',
    });
    globalThis.chrome = {
      ...SinonChrome,
      devtools: {
        // @ts-ignore
        panels: {
          themeName: 'dark',
        },
      },
    };

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
      });
    } as unknown as typeof fetch;
  });

  it('Should show cookies content by default', async () => {
    await act(() => render(<App />));

    expect(screen.getByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to cookie panel when tab is clicked', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    fireEvent.click(screen.getByText('Cookies'));
    expect(await screen.findByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to Bounce Tracking Panel when clicked', async () => {
    await act(() => render(<App />));
    // Click on Bounce Tracking tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    expect(
      await screen.findByTestId('bounce-tracking-content')
    ).toBeInTheDocument();
  });

  it('should switch to FingerPrinting Panel when clicked', async () => {
    await act(() => render(<App />));
    // Click on FingerPrinting tab
    fireEvent.click(screen.getByText('Fingerprinting'));

    expect(
      await screen.findByTestId('fingerprinting-content')
    ).toBeInTheDocument();
  });

  it('should switch to Attribution Panel when clicked', async () => {
    await act(() => render(<App />));
    // Click on Attribution tab
    fireEvent.click(screen.getByText('Attribution'));

    expect(
      await screen.findByTestId('attribution-content')
    ).toBeInTheDocument();
  });

  it('should switch to Topics Panel when clicked', async () => {
    await act(() => render(<App />));

    // Click on Topics tab
    fireEvent.click(screen.getByText('Topics'));

    expect(await screen.findByTestId('topics-content')).toBeInTheDocument();
  });

  it('Down Keyboard navigation should work.', async () => {
    await act(() => render(<App />));
    // Focus on the first menu item.
    userEvent.tab();
    // Press arrow down
    userEvent.keyboard('{ArrowDown}');
    expect(await screen.findByTestId('Topics')).toHaveClass('bg-royal-blue');
  });

  it('Up Keyboard navigation should work.', async () => {
    await act(() => render(<App />));
    // Focus on the first menu item.
    userEvent.tab();
    // Press arrow down to go to next menu
    userEvent.keyboard('{ArrowDown}');
    // Press arrow down to go to previous menu
    userEvent.keyboard('{ArrowUp}');
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Up Keyboard navigation should work.', async () => {
    await act(() => render(<App />));
    // Focus on the first menu item.
    userEvent.tab();
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
    userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
