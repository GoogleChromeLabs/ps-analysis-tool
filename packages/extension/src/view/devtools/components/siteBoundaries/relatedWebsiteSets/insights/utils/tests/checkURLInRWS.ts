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
import checkURLInRWS from '../checkURLInRWS';

describe('checkURLInRWS', () => {
  beforeAll(() => {
    globalThis.chrome = {
      devtools: {
        inspectedWindow: {
          tabId: 1,
        },
      },
      tabs: {
        get: () => ({ url: 'https://hindustantimes.com' }),
      },
      runtime: {
        getURL: () => 'data/related_website_sets.json',
      },
    } as unknown as typeof chrome;
    globalThis.fetch = (): Promise<Response> =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            sets: [
              {
                contact: 'prashant.tiwari@htdigital.in',
                primary: 'https://hindustantimes.com',
                associatedSites: ['https://livemint.com'],
                rationaleBySite: {
                  'https://livemint.com': 'Specialized Platform for economics',
                },
              },
            ],
          }),
      } as Response);
  });

  test('should return true if the tab domain is the same as the primary domain', async () => {
    const result = await checkURLInRWS();

    expect(result).toEqual({
      isURLInRWS: true,
      primary: true,
      domain: 'hindustantimes.com',
      relatedWebsiteSet: {
        contact: 'prashant.tiwari@htdigital.in',
        primary: 'https://hindustantimes.com',
        associatedSites: ['https://livemint.com'],
        rationaleBySite: {
          'https://livemint.com': 'Specialized Platform for economics',
        },
      },
    });
  });

  test('should return false if tab domain not present in RWS', async () => {
    globalThis.chrome = {
      ...globalThis.chrome,
      tabs: {
        get: () => ({ url: 'https://indianexpress.com' }),
      },
    } as unknown as typeof chrome;

    const result = await checkURLInRWS();

    expect(result).toEqual({
      isURLInRWS: false,
    });
  });
});
