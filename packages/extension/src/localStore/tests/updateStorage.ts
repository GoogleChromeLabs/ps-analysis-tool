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
import updateStorage from '../updateStorage';
import { type Storage } from '../types';

describe('local store: updateStorage', () => {
  let storage: Storage = {};

  beforeAll(() => {
    globalThis.chrome = {
      //@ts-ignore local does not need implementations of other properties
      action: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setBadgeText: async () => {},
      },
      storage: {
        //@ts-ignore local does not implementations of other properties
        local: {
          set: (data) =>
            new Promise<void>((resolve) => {
              storage = data;
              resolve();
            }),
          get: () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Promise<{ [key: string]: any }>((resolve) => {
              resolve(storage);
            }),
          getBytesInUse: () =>
            new Promise<number>((resolve) => {
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
  });

  it('adds tab data for a new tab', async () => {
    const tab1 = {
      cookies: {},
      url: '',
      focusedAt: Date.now(),
    };

    await updateStorage('123', (prevTabData) => {
      return { ...prevTabData, ...tab1 };
    });

    expect(storage).toStrictEqual({
      '123': tab1,
    });

    const tab2 = {
      cookies: {},
      url: '',
      focusedAt: Date.now(),
    };

    await updateStorage('234', (prevTabData) => {
      return { ...prevTabData, ...tab2 };
    });

    expect(storage).toStrictEqual({
      '123': tab1,
      '234': tab2,
    });
  });

  it('updates tab data for a tab', async () => {
    const tab1 = {
      cookies: {},
      url: '123',
      focusedAt: Date.now(),
    };
    const tab2 = {
      cookies: {},
      url: '234',
      focusedAt: Date.now(),
    };

    await updateStorage('123', (prevTabData) => {
      return { ...prevTabData, ...tab1 };
    });
    await updateStorage('234', (prevTabData) => {
      return { ...prevTabData, ...tab2 };
    });

    const newData = {
      cookies: {},
      url: '345',
      focusedAt: Date.now(),
    };

    await updateStorage('123', (prevTabData) => {
      return { ...prevTabData, ...newData };
    });

    expect(storage).toStrictEqual({ '123': newData, '234': tab2 });
  });

  it('makes space for new updates by deleting tab data by LRU', async () => {
    const tab1 = {
      cookies: {},
      url: '123',
      focusedAt: Date.now(),
    };

    await updateStorage('123', (prevTabData) => {
      return { ...prevTabData, ...tab1 };
    });

    expect(storage).toStrictEqual({
      '123': tab1,
    });

    await new Promise((r) => setTimeout(r, 100));

    const tab2 = {
      cookies: {},
      url: '234',
      focusedAt: Date.now(),
    };

    await updateStorage('234', (prevTabData) => {
      return { ...prevTabData, ...tab2 };
    });

    //Force a deletion by reducing QUOTA_BYTES
    chrome.storage.local.QUOTA_BYTES = new TextEncoder().encode(
      JSON.stringify({ '123': tab1, '234': tab2 })
    ).length;

    await new Promise((r) => setTimeout(r, 100));

    const tab3 = {
      cookies: {},
      url: '345',
      focusedAt: Date.now(),
    };

    await updateStorage('345', (prevTabData) => {
      return { ...prevTabData, ...tab3 };
    });

    expect(storage).toStrictEqual({
      '234': tab2,
      '345': tab3,
    });
  });
});
