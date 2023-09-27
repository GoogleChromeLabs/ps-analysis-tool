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
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import App from '../app';
import { Provider as ExternalStoreProvider } from '../stateProviders/syncCookieStore';
import { Provider as ContentPanelProvider } from '../stateProviders/contentPanelStore';
import { Provider as FilterManagementProvider } from '../stateProviders/filterManagementStore';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'cookie-analysis-tool/data/PSInfo.json';

const tabCookies = {
  _cb: {
    parsedCookie: '_cb',
    analytics: null,
    url: 'https://edition.cnn.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: true,
    isCookieSet: true,
  },
  pubsyncexp: {
    parsedCookie: 'pubsyncexp',
    analytics: null,
    url: 'https://api.pubmatic.com/whatever/api',
    headerType: 'response',
    frameIdList: [1],
    isFirstParty: false,
    isCookieSet: true,
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
    isCookieSet: true,
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
    isCookieSet: true,
  },
};

describe('Index', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.chrome = {
      ...SinonChrome,
      webNavigation: {
        //@ts-ignore
        getAllFrames: () => {
          return [
            {
              processId: 1,
              frameId: 0,
              url: 'https://edition.cnn.com',
              documentId: '40245632AWDER',
              documentLifecycle: 'active',
              errorOccurred: false,
              frameType: 'outermost_frame',
              parentFrameId: 0,
            },
            {
              processId: 1,
              frameId: 2,
              url: 'https://crxd.net',
              documentId: '40245632WADER',
              documentLifecycle: 'active',
              errorOccurred: false,
              frameType: 'sub_frame',
              parentFrameId: 0,
            },
            {
              processId: 1,
              frameId: 3,
              url: 'https://edition.cnn.com',
              documentId: '40245632AWDER',
              documentLifecycle: 'active',
              errorOccurred: false,
              frameType: 'sub_frame',
              parentFrameId: 0,
            },
          ];
        },
      },
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
          getBytesInUse: () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<number>((resolve) => {
              resolve(100);
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          eval: (command, callback: any) => {
            if (command === 'document.cookie.split(";")') {
              callback([
                '_ga=GA1.2.91929102.1694767081',
                ' _gid=GA1.2.626513871.1694767081',
              ]);
            } else {
              callback('https://edition.cnn.com');
            }
          },
        },
        //@ts-ignore
        panels: {
          themeName: 'dark',
        },
      },
      tabs: {
        //@ts-ignore
        onUpdated: {
          addListener: () => undefined,
          removeListener: () => undefined,
        },
        query: () => {
          return Promise.resolve([
            {
              groupId: 12,
              autoDiscardable: false,
              discarded: false,
              selected: true,
              incognito: false,
              active: true,
              windowId: 1,
              highlighted: false,
              pinned: false,
              index: 1,
              id: 40245632,
            },
          ]);
        },
        //@ts-ignore
        onRemoved: {
          addListener: () => undefined,
          removeListener: () => undefined,
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

  it('All Providers should be added to DOM', async () => {
    act(() =>
      render(
        <ExternalStoreProvider>
          <ContentPanelProvider>
            <FilterManagementProvider>
              <App />
            </FilterManagementProvider>
          </ContentPanelProvider>
        </ExternalStoreProvider>
      )
    );
    expect(
      await screen.findByTestId('privacySandbox-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('Content Panel Provider should be added to DOM', async () => {
    act(() =>
      render(
        <ExternalStoreProvider>
          <ContentPanelProvider>
            <App />
          </ContentPanelProvider>
        </ExternalStoreProvider>
      )
    );
    expect(
      await screen.findByTestId('privacySandbox-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });
  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
