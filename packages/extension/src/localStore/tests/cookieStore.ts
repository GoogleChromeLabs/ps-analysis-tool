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
import type { Storage } from '../types';

xdescribe('local store: CookieStore', () => {
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
});
