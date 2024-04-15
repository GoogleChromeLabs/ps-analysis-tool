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
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SinonChrome from 'sinon-chrome';
import { CookiesLanding } from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies.
 */
import AssembledCookiesLanding from '../cookieLanding';
import { useCookie, useSettings } from '../../../stateProviders';
import data from '../../../../../utils/test-data/cookieMockData';

jest.mock('../../../stateProviders', () => ({
  useCookie: jest.fn(),
  useSettings: jest.fn(),
}));
const mockUseCookieStore = useCookie as jest.Mock;
const mockUseSettingsStore = useSettings as jest.Mock;

describe('CookiesLanding', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
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
          //@ts-ignore
          onResourceAdded: {
            addListener: () => undefined,
            removeListener: () => undefined,
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
  });

  it('renders CookiesLanding with data', () => {
    mockUseCookieStore.mockReturnValue({
      tabCookies: data.tabCookies,
      tabFrames: data.tabFrames,
      frameHasCookies: {
        'https://edition.cnn.com/': true,
      },
    });
    mockUseSettingsStore.mockReturnValue({ isUsingCDP: false });
    const { getByTestId, getAllByTestId } = render(
      <CookiesLanding>
        <AssembledCookiesLanding />
      </CookiesLanding>
    );

    expect(getByTestId('cookies-landing')).toBeInTheDocument();
    expect(getAllByTestId('cookies-landing-header')[0]).toBeInTheDocument();
    expect(getByTestId('cookies-matrix-Categories')).toBeInTheDocument();
  });
});
