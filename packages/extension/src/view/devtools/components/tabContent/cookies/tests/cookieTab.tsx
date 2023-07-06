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

/**
 * External dependencies.
 */
import CookieTab from '..';
import type { TabData } from '../../../../../../localStore';

const mockResponse: TabData = {
  cookies: {
    _cb: {
      parsedCookie: {
        name: '_cb',
        value: 'unknown1pCookie',
        domain: '.cnn.com',
      },
      analytics: null,
      url: 'https://edition.cnn.com/whatever/api',
      thirdParty: false,
      headerType: 'response',
    },
    pubsyncexp: {
      parsedCookie: {
        name: 'pubsyncexp',
        value: 'unknown3pCookie',
        domain: '.ads.pubmatic.com',
      },
      analytics: null,
      url: 'https://api.pubmatic.com/whatever/api',
      thirdParty: true,
      headerType: 'response',
    },
    __qca: {
      parsedCookie: {
        name: '__qca',
        value: 'known1pCookie',
        domain: '.cnn.com',
      },
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
      thirdParty: false,
      headerType: 'response',
    },
    KRTBCOOKIE_290: {
      parsedCookie: {
        name: 'KRTBCOOKIE_290',
        value: 'known3pCookie',
        domain: '.pubmatic.com',
      },
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
      thirdParty: true,
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
    // cookie-list-column
    const cookieListColumn = screen.getByTestId('cookie-list-column');

    expect(screen.getAllByTestId('cookie-list-item').length).toBe(4);
    expect(within(cookieListColumn).getAllByText('First Party').length).toBe(2);
    expect(within(cookieListColumn).getAllByText('Third Party').length).toBe(2);

    expect(within(cookieListColumn).getAllByText('Uncategorized').length).toBe(
      2
    );
    expect(within(cookieListColumn).getAllByText('Marketing').length).toBe(2);
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

    expect(
      within(card).getByText(`${thirdCookie.parsedCookie.name}`)
    ).toBeInTheDocument();
  });
});
