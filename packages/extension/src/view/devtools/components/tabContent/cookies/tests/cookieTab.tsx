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
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import CookieTab from '..';
import type { CookieStoreContext } from '../../../../stateProviders/syncCookieStore';

const uncategorised1pCookie: ParsedCookie = {
  name: '_cb',
  value: 'uncategorised1pCookie',
  domain: '.cnn.com',
};

const uncategorised3pCookie: ParsedCookie = {
  name: 'pubsyncexp',
  value: 'uncategorised3pCookie',
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

const mockResponse: {
  tabCookies: NonNullable<CookieStoreContext['state']['tabCookies']>;
  tabUrl: NonNullable<CookieStoreContext['state']['tabUrl']>;
  tabFrames: NonNullable<CookieStoreContext['state']['tabFrames']>;
  selectedFrame: NonNullable<CookieStoreContext['state']['selectedFrame']>;
} = {
  tabCookies: {
    [uncategorised1pCookie.name]: {
      parsedCookie: uncategorised1pCookie,
      analytics: null,
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
    },
    [uncategorised3pCookie.name]: {
      parsedCookie: uncategorised3pCookie,
      analytics: null,
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
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
      frameIdList: [1],
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
      frameIdList: [1],
    },
  },
  tabUrl: 'https://edition.cnn.com/',
  tabFrames: {
    'https://edition.cnn.com/': {
      frameIds: [1],
    },
  },
  selectedFrame: 'https://edition.cnn.com/',
};

jest.mock('../../../../stateProviders/syncCookieStore', () => {
  return {
    useCookieStore: () => {
      return {
        cookies: mockResponse.tabCookies,
        tabUrl: mockResponse.tabUrl,
        tabFrames: mockResponse.tabFrames,
        selectedFrame: mockResponse.selectedFrame,
      };
    },
  };
});

describe('CookieTab', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  it('should render a list of cookies with analytics', async () => {
    render(<CookieTab />);

    expect((await screen.findAllByTestId('cookie-list-item')).length).toBe(4);
    expect((await screen.findAllByText('First Party')).length).toBe(2);
    expect((await screen.findAllByText('Third Party')).length).toBe(2);

    expect((await screen.findAllByText('Uncategorised')).length).toBe(2);
    expect((await screen.findAllByText('Marketing')).length).toBe(2);
  });

  it('should show a cookie card with the information on first cookie in the list', async () => {
    render(<CookieTab />);

    const card = await screen.findByTestId('cookie-card');

    expect(card).toBeInTheDocument();

    const firstCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[0]];

    expect(
      within(card).getByText(firstCookie.parsedCookie.name)
    ).toBeInTheDocument();
  });

  it('should change the selected cookie with clicking', async () => {
    render(<CookieTab />);

    //click on the 3rd cookie in the list
    const items = await screen.findAllByTestId('cookie-list-item');
    fireEvent.click(items[2]);

    const card = await screen.findByTestId('cookie-card');
    expect(card).toBeInTheDocument();

    const thirdCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[2]];

    expect(
      within(card).getByText(`${thirdCookie.parsedCookie.name}`)
    ).toBeInTheDocument();
  });
});
