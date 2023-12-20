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
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import App from '../app';
import { Provider as ExternalStoreProvider } from '../stateProviders/syncCookieStore';

const tabCookies = {
  _cb: {
    parsedCookie: '_cb',
    analytics: null,
    url: 'https://edition.cnn.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: true,
    isBlocked: true,
  },
  pubsyncexp: {
    parsedCookie: 'pubsyncexp',
    analytics: null,
    url: 'https://api.pubmatic.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: false,
    isBlocked: true,
  },
  __qca: {
    parsedCookie: '__qca',
    analytics: {
      platform: 'Quantcast',
      category: 'Marketing',
      name: '__qca',
      domain: "Advertiser's website domain",
      description:
        'This cookie is set by Quantcast, who present targeted advertising. Stores browser and HTTP request information.',
      retention: '1 year',
      dataController: 'Quantcast',
      gdprUrl: 'https://www.quantcast.com/privacy/',
      wildcard: '0',
    },
    url: 'https://edition.cnn.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: true,
    isBlocked: true,
  },
  KRTBCOOKIE_290: {
    parsedCookie: 'KRTBCOOKIE_290',
    analytics: {
      platform: 'PubMatic',
      category: 'Marketing',
      name: 'KRTBCOOKIE_*',
      domain: 'pubmatic.com',
      description:
        "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
      retention: '29 days',
      dataController: 'Pubmatic',
      gdprUrl: 'N/A',
      wildcard: '1',
    },
    url: 'https://api.pubmatic.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: false,
    isBlocked: true,
  },
};

describe('App', () => {
  describe('Single tab is open, but the tabToRead doesnt exists', () => {
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
                  40245632: { cookies: tabCookies },
                  tabToRead: '40245632',
                });
              }),
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
        },
      };
    });

    it('ExternalStoreProvider should be added to DOM', async () => {
      act(() =>
        render(
          <ExternalStoreProvider>
            <App />
          </ExternalStoreProvider>
        )
      );
      expect(await screen.findByText('1st Party Cookies')).toBeInTheDocument();
      expect(await screen.findByText('3rd Party Cookies')).toBeInTheDocument();
    });

    it('Initial render will show please refresh page to see cookies', () => {
      render(
        <ExternalStoreProvider>
          <App />
        </ExternalStoreProvider>
      );
      waitFor(
        () =>
          expect(
            screen.getByText('Please refresh this page to view cookies')
          ).toBeInTheDocument(),
        {
          timeout: 11000,
        }
      );
    });
  });

  describe('Single tab is open, but the tabToRead doesnt exist', () => {
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
                  40245632: { cookies: tabCookies },
                  tabToRead: '4024632',
                });
              }),
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
        },
      };
    });

    it('Popup should display message analyze this tab', async () => {
      act(() =>
        render(
          <ExternalStoreProvider>
            <App />
          </ExternalStoreProvider>
        )
      );
      expect(await screen.findByText('Analyze this tab')).toBeInTheDocument();
      expect(
        screen.queryByText(
          'This tool works best with a single tab for cookie analysis.'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('Multiple tabs are open, but the tabToRead doesnt exist', () => {
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
                  40245632: { cookies: tabCookies },
                  tabToRead: '4024632',
                });
              }),
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
            return [
              { id: 40245632, url: 'https://edition.cnn.com' },
              { id: 4045632, url: 'https://bbc.com' },
            ];
          },
        },
      };
    });

    it('Popup should display message analyze this tab', async () => {
      act(() =>
        render(
          <ExternalStoreProvider>
            <App />
          </ExternalStoreProvider>
        )
      );
      expect(await screen.findByText('Analyze this tab')).toBeInTheDocument();
      expect(
        await screen.findByText(
          'This tool works best with a single tab for cookie analysis.'
        )
      ).toBeInTheDocument();
    });
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
