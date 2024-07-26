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
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { noop } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Insights from '..';

describe('RelatedWebsiteSets Insights', () => {
  beforeAll(() => {
    globalThis.chrome = {
      devtools: {
        inspectedWindow: {
          tabId: 1,
        },
      },
      tabs: {
        get: () => ({ url: 'https://hindustantimes.com' }),
        onUpdated: {
          addListener: () => noop,
          removeListener: () => noop,
        },
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

  test('should render insights', () => {
    render(<Insights />);

    waitFor(
      async () => {
        expect(
          await screen.findByText('This site belongs to a Related Website Sets')
        ).toBeInTheDocument();

        expect(
          await screen.findByText('https://hindustantimes.com')
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    globalThis.chrome = {
      ...globalThis.chrome,
      tabs: {
        ...globalThis.chrome.tabs,
        get: () => ({ url: 'https://indianexpress.com' }),
      },
    } as unknown as typeof chrome;

    render(<Insights />);

    waitFor(
      async () => {
        expect(
          await screen.findByText(
            'This site does not belong to a Related Website Sets'
          )
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  test('should render insights', () => {
    globalThis.chrome = {
      ...globalThis.chrome,
      tabs: {
        ...globalThis.chrome.tabs,
        get: () => ({ url: 'https://livemint.com' }),
      },
    } as unknown as typeof chrome;

    render(<Insights />);

    waitFor(
      async () => {
        expect(
          await screen.findByText('This site belongs to a Related Website Sets')
        ).toBeInTheDocument();

        expect(
          await screen.findByText('https://hindustantimes.com')
        ).toBeInTheDocument();

        expect(
          await screen.findByText('Specialized Platform for economics')
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
