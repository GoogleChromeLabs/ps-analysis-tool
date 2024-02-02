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
import { noop } from '@ps-analysis-tool/common';
import { useTablePersistentSettingsStore } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import App from '../app';
import { useCookieStore } from '../stateProviders/syncCookieStore';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import data from '../../../utils/test-data/cookieMockData';
import { useSettingsStore } from '../stateProviders/syncSettingsStore';

jest.mock('../stateProviders/syncCookieStore', () => ({
  useCookieStore: jest.fn(),
}));

jest.mock('../stateProviders/syncSettingsStore', () => ({
  useSettingsStore: jest.fn(),
}));

jest.mock(
  '../../../../../design-system/src/components/table/persistentSettingsStore',
  () => ({
    useTablePersistentSettingsStore: jest.fn(),
  })
);

const mockUseCookieStore = useCookieStore as jest.Mock;
const mockUseTablePersistentSettingStore =
  useTablePersistentSettingsStore as jest.Mock;
const mockUseSettingsStore = useSettingsStore as jest.Mock;

describe('App', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.location.protocol = 'chrome-extension:';
    globalThis.chrome = {
      ...SinonChrome,
      storage: {
        //@ts-ignore
        local: {
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_, __) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<{ [key: string]: any }>((resolve) => {
              resolve({
                40245632: {
                  cookies: data.tabCookies,
                  selectedSidebarItem: 'privacySandbox#cookies',
                  tablePersistentSettingsStore: {
                    cookieListing: {
                      sortBy: 'parsedCookie.name',
                      sortOrder: 'asc',
                    },
                  },
                },
                tabToRead: '40245632',
              });
            }),
          set: () => Promise.resolve(),
          //@ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
        sync: {
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_, __) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<{ [key: string]: any }>((resolve) => {
              resolve({
                allowedNumberOfTabs: 'single',
              });
            }),
          set: () => Promise.resolve(),
          //@ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
        session: {
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_, __) => Promise.resolve(),
          set: () => Promise.resolve(),
          //@ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
      },
      devtools: {
        //@ts-ignore
        inspectedWindow: {
          tabId: 40245632,
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          eval: (_, callback: any) => {
            callback('https://edition.cnn.com');
          },
        },
      },
      tabs: {
        //@ts-ignore
        onUpdated: {
          addListener: () => undefined,
          removeListener: () => undefined,
        },
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: (_, __) => {
          return [{ id: 40245632, url: 'https://edition.cnn.com' }];
        },
        connect: () => ({
          //@ts-ignore
          onMessage: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            addListener: () => undefined,
          },
          //@ts-ignore
          onDisconnect: {
            addListener: () => undefined,
          },
        }),
      },
    };
    global.ResizeObserver = class MockedResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
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

  it('Should show cookie table if frame is selected', async () => {
    mockUseCookieStore.mockReturnValue({
      contextInvalidated: false,
      setContextInvalidated: noop,
      tabCookies: data.tabCookies,
      tabFrames: data.tabFrames,
      selectedFrame: data.selectedFrame,
      cookies: data.tabCookies,
      setSelectedFrame: noop,
      isInspecting: false,
      setIsInspecting: noop,
      canStartInspecting: true,
      tabUrl: data.tabUrl,
      isCurrentTabBeingListenedTo: true,
      tabToRead: '40245632',
    });
    mockUseTablePersistentSettingStore.mockReturnValue({
      getPreferences: () => '',
      setPreferences: noop,
    });
    mockUseSettingsStore.mockReturnValue({
      allowedNumberOfTabs: 'single',
    });

    act(() => {
      render(<App />);
    });

    expect((await screen.findAllByTestId('body-row')).length).toBe(4);
  });

  it('Should show refresh banner if context invalidated.', async () => {
    mockUseCookieStore.mockReturnValue({
      contextInvalidated: true,
      setContextInvalidated: noop,
      tabCookies: {},
      tabFrames: null,
      selectedFrame: null,
      cookies: {},
      setSelectedFrame: noop,
      isInspecting: false,
      setIsInspecting: noop,
      canStartInspecting: true,
      tabUrl: data.tabUrl,
      isCurrentTabBeingListenedTo: true,
    });
    mockUseTablePersistentSettingStore.mockReturnValue({
      getPreferences: () => '',
      setPreferences: noop,
    });
    mockUseSettingsStore.mockReturnValue({
      allowedNumberOfTabs: 'single',
    });

    act(() => {
      render(<App />);
    });

    expect(await screen.findByText('Refresh panel')).toBeInTheDocument();
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
