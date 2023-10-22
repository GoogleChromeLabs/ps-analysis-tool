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
import { noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import App from '../app';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import globalChrome from '../../../utils/test-data/globalChrome';

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
      allowedNumberOfTabs: 'single',
      setIsInspecting: noop,
      setCanStartInspecting: noop,
    });
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    globalThis.chrome = {
      ...globalChrome,
      storage: {
        // @ts-ignore
        session: {
          // @ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
      },
    };

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('Should show cookies content by default', async () => {
    await act(() => render(<App />));

    expect(screen.getByTestId('privacy-sandbox-content')).toBeInTheDocument();
  });

  it('should switch to cookie panel when tab is clicked', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(
      screen.getByTestId('privateAdvertising-tab-heading-wrapper')
    );

    fireEvent.click(screen.getByTestId('cookies-tab-heading-wrapper'));
    expect(await screen.findByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should open bounce tracking panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('antiCovertTracking-accordion-opener'));
    fireEvent.click(screen.getByTestId('Bounce Tracking'));
    expect(
      await screen.findByTestId('bounce-tracking-content')
    ).toBeInTheDocument();
  });

  it('should open fingerprinting panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('antiCovertTracking-accordion-opener'));
    fireEvent.click(screen.getByTestId('Fingerprinting'));
    expect(
      await screen.findByTestId('fingerprinting-content')
    ).toBeInTheDocument();
  });

  it('should open attribution panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('privateAdvertising-accordion-opener'));
    fireEvent.click(screen.getByTestId('Attribution'));
    expect(
      await screen.findByTestId('attribution-content')
    ).toBeInTheDocument();
  });

  it('should open topics panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('privateAdvertising-accordion-opener'));
    fireEvent.click(screen.getByTestId('Topics'));
    expect(await screen.findByTestId('topics-content')).toBeInTheDocument();
  });

  it('should open CHIPS panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('siteBoundaries-accordion-opener'));
    fireEvent.click(screen.getByTestId('CHIPS'));
    expect(await screen.findByTestId('chips-content')).toBeInTheDocument();
  });

  it('should open Related Website Sets panel when selected from accordion.', async () => {
    await act(() => render(<App />));
    // Move to another tab
    fireEvent.click(screen.getByTestId('siteBoundaries-accordion-opener'));
    fireEvent.click(screen.getByTestId('Related Website Sets'));
    expect(
      await screen.findByTestId('related-website-sets-content')
    ).toBeInTheDocument();
  });

  it('should switch to AntiCovert Tracking Panel when clicked', async () => {
    await act(() => render(<App />));
    // Click on Bounce Tracking tab
    fireEvent.click(
      screen.getByTestId('antiCovertTracking-tab-heading-wrapper')
    );

    expect(
      await screen.findByTestId('antiCovertTracking-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('should switch to Private Advertising when clicked', async () => {
    await act(() => render(<App />));
    // Click on Attribution tab
    fireEvent.click(
      screen.getByTestId('privateAdvertising-tab-heading-wrapper')
    );

    expect(
      await screen.findByTestId('privateAdvertising-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('should switch to Site Boundaries Panel when clicked', async () => {
    await act(() => render(<App />));

    // Click on Topics tab
    fireEvent.click(screen.getByTestId('siteBoundaries-tab-heading-wrapper'));

    expect(
      await screen.findByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('Down Keyboard navigation should work.', async () => {
    await act(() => render(<App />));
    act(() => {
      // Focus on the first menu item.
      userEvent.tab();
      userEvent.keyboard('{ArrowRight}');
      userEvent.keyboard('{ArrowDown}');
    });
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    expect(
      await screen.findByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('Up Keyboard navigation should work.', async () => {
    await act(() => render(<App />));
    act(() => {
      // Focus on the first menu item.
      userEvent.tab();
      userEvent.keyboard('{ArrowRight}');
      userEvent.keyboard('{ArrowDown}');
    });
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    act(() => {
      // Press arrow down to go to previous menu
      userEvent.keyboard('{ArrowUp}');
    });
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
