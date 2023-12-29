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
 * Internal dependencies.
 */
import CookieStore from '../cookieStore';
import type { CookieData, Storage } from '../types';

const cookieArray: CookieData[] = [
  {
    parsedCookie: {
      expires: 'Session',
      httponly: false,
      secure: true,
      path: '/',
      domain: '.example1.com',
      samesite: 'None',
      name: 'countryCode1',
      value: 'IN',
      partitionKey: '',
      priority: 'Medium',
    },
    frameIdList: [1],
    analytics: null,
    url: 'https://example.com',
    headerType: 'response',
    isFirstParty: false,
    blockedReasons: [],
    warningReasons: [],
    isBlocked: false,
  },
  {
    parsedCookie: {
      expires: 'Session',
      httponly: false,
      secure: true,
      path: '/',
      domain: '.example2.com',
      samesite: 'None',
      name: 'countryCode2',
      value: 'IN',
      partitionKey: '',
      priority: 'Medium',
    },
    frameIdList: [1],
    analytics: null,
    url: 'https://example.com',
    isBlocked: false,
    headerType: 'response',
    isFirstParty: false,
    warningReasons: [],
    blockedReasons: [],
  },
];

describe('local store: CookieStore', () => {
  let storage: Storage = {};
  beforeAll(() => {
    globalThis.chrome = {
      //@ts-ignore local does not need implementations of other properties for these tests
      tabs: {
        query: () =>
          new Promise((resolve) => {
            //@ts-ignore local does not need other properties for these tests
            resolve([{ id: 123 }]);
          }),
      },
      storage: {
        //@ts-ignore local does not need implementations of other properties for these tests
        local: {
          set: (data) =>
            new Promise((resolve) => {
              storage = data;
              resolve();
            }),
          get: () =>
            new Promise((resolve) => {
              resolve(storage);
            }),
          getBytesInUse: () =>
            new Promise((resolve) => {
              resolve(new TextEncoder().encode(JSON.stringify(storage)).length);
            }),
          QUOTA_BYTES: 10485760,
          clear: () =>
            new Promise<void>((resolve) => {
              storage = {};
              resolve();
            }),
          remove: (arg) =>
            new Promise<void>((resolve) => {
              if (!Array.isArray(arg)) {
                delete storage[arg];
              } else {
                arg.forEach((key) => {
                  delete storage[key];
                });
              }
              resolve();
            }),
        },
        sync: {
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_, __) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<{ [key: string]: any }>((resolve) => {
              resolve({
                allowedNumberOfTabs: { allowedNumberOfTabs: 'single' },
              });
            }),
          //@ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
        session: {
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_, __) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<{ [key: string]: any }>((resolve) => {
              resolve({
                123: true,
              });
            }),
          set: () => Promise.resolve(),
          remove: () => Promise.resolve(),
          //@ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
      },
    };
  });

  beforeEach(() => {
    chrome.storage.local.QUOTA_BYTES = 10485760;
    chrome.storage.local.clear();

    //mock navigation to a URL
    CookieStore.addTabData('123');
  });

  it('should add/update tab data', async () => {
    await CookieStore.update('123', cookieArray);
    expect(storage['123'].cookies).toStrictEqual({
      'countryCode1.example1.com/': cookieArray[0],
      'countryCode2.example2.com/': cookieArray[1],
    });
  });

  it('should delete cookies', async () => {
    await CookieStore.update('123', cookieArray);
    await CookieStore.deleteCookie('countryCode1.example1.com/');
    expect(storage['123'].cookies).toStrictEqual({
      'countryCode2.example2.com/': cookieArray[1],
    });
  });

  it('should add/update tab data and merge frame id list', async () => {
    await CookieStore.update('123', [
      cookieArray[0],
      { ...cookieArray[0], frameIdList: [2] },
      { ...cookieArray[0], frameIdList: [2] },
    ]);
    expect(storage['123'].cookies).toStrictEqual({
      'countryCode1.example1.com/': { ...cookieArray[0], frameIdList: [2, 1] },
    });
  });

  it('should update tab foucusedAt value', async () => {
    await CookieStore.update('123', cookieArray);
    const prevFocusedAt = storage['123'].focusedAt;

    await new Promise((r) => setTimeout(r, 100));
    await CookieStore.updateTabFocus('123');

    expect(storage['123'].focusedAt).not.toBe(prevFocusedAt);
  });

  it('should remove tab data', async () => {
    await CookieStore.update('123', cookieArray);
    await CookieStore.removeTabData('123');
    expect(storage['123']).toBeUndefined();
  });

  it('should tab data in a window', async () => {
    const tmpTabRef = globalThis.chrome.tabs;

    await CookieStore.update('123', cookieArray);
    await CookieStore.removeWindowData(123);
    expect(storage['123']).toBeUndefined();
    expect(storage).toStrictEqual({ tabToRead: '123' });
    globalThis.chrome.tabs = tmpTabRef;
  });
});
