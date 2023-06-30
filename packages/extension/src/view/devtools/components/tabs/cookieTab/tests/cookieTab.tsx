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
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * External dependencies.
 */
import { CookieTab } from '..';
import type { TabData } from '../../../../../../localStore';

const unknown1pCookie: ParsedCookie = {
  name: '_cb',
  value: 'unknown1pCookie',
  domain: '.cnn.com',
};

const unknown3pCookie: ParsedCookie = {
  name: 'pubsyncexp',
  value: 'unknown3pCookie',
  domain: '.ads.pubmatic.com',
};

const known1pCookie: ParsedCookie = {
  name: '__qca',
  value: 'known1pCookie',
  domain: '.cnn.com',
};

const known3pCookie: ParsedCookie = {
  name: 'KRTBCOOKIE_290',
  value: 'known3pCookie',
  domain: '.pubmatic.com',
};

const mockResponse: TabData = {
  cookies: {
    [unknown1pCookie.name]: {
      parsedCookie: unknown1pCookie,
      analytics: null,
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
    },
    [unknown3pCookie.name]: {
      parsedCookie: unknown3pCookie,
      analytics: null,
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
    },
    [known1pCookie.name]: {
      parsedCookie: known1pCookie,
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
    },
    [known3pCookie.name]: {
      parsedCookie: known3pCookie,
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
    },
  },
  url: 'https://edition.cnn.com/',
  focusedAt: 123,
};

jest.mock('../../../../../stateProviders/syncCookieStore', () => {
  return {
    useCookieStore: () => {
      return { cookies: mockResponse.cookies, tabUrl: mockResponse.url };
    },
  };
});

describe('CookieTab', () => {
  it('should render a list of cookies with analytics', () => {
    render(<CookieTab />);

    expect(screen.getAllByTestId('cookie-list-item').length).toBe(4);
    expect(screen.getAllByText('First Party').length).toBe(2);
    expect(screen.getAllByText('Third Party').length).toBe(2);

    expect(screen.getAllByText('Uncategorized').length).toBe(2);
    expect(screen.getAllByText('Marketing').length).toBe(2);
  });
  it('should show a cookie card with the information on first cookie in the list', () => {
    render(<CookieTab />);

    const card = screen.getByTestId('cookie-card');

    expect(card).toBeInTheDocument();

    const firstCookie =
      mockResponse.cookies[Object.keys(mockResponse.cookies)[0]];

    expect(within(card).getByText(firstCookie.parsedCookie.name));
  });

  it('should change the selected cookie with clicking', () => {
    render(<CookieTab />);

    //click on the 3rd cookie in the list
    const items = screen.getAllByTestId('cookie-list-item');
    fireEvent.click(items[2]);

    const card = screen.getByTestId('cookie-card');
    expect(card).toBeInTheDocument();

    const thirdCookie =
      mockResponse.cookies[Object.keys(mockResponse.cookies)[2]];

    expect(within(card).getByText(`${thirdCookie.parsedCookie.name}`));
  });
});
