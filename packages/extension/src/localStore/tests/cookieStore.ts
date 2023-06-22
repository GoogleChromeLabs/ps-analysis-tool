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
      expires: 0,
      httponly: false,
      secure: true,
      path: '/',
      domain: '.example1.com',
      samesite: 'None',
      name: 'countryCode1',
      value: 'IN',
    },
    analytics: null,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      expires: 0,
      httponly: false,
      secure: true,
      path: '/',
      domain: '.example2.com',
      samesite: 'None',
      name: 'countryCode2',
      value: 'IN',
    },
    analytics: null,
    url: 'https://example.com',
    headerType: 'response',
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
      },
    };
  });

  beforeEach(() => {
    chrome.storage.local.QUOTA_BYTES = 10485760;
    chrome.storage.local.clear();

    //mock navigation to a URL
    CookieStore.updateTabLocation('123', 'https://example.com', Date.now());
  });

  it('should add/update tab data', async () => {
    await CookieStore.update('123', cookieArray);
    expect(storage['123'].cookies).toStrictEqual({
      'countryCode1.example1.com': cookieArray[0],
      'countryCode2.example2.com': cookieArray[1],
    });
  });

  it('should update tab location and clear cookies', async () => {
    await CookieStore.update('123', cookieArray);

    const now = Date.now();
    await CookieStore.updateTabLocation('123', 'https://new_site.com', now);

    expect(storage['123'].cookies).toStrictEqual({});
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
    expect(storage).toStrictEqual({});
    globalThis.chrome.tabs = tmpTabRef;
  });
});
