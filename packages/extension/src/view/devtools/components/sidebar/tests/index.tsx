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
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import Sidebar from '..';
import {
  useCookieStore,
  type CookieStoreContext,
} from '../../../stateProviders/syncCookieStore';

const tabNames = [
  'Cookies',
  'Topics',
  'Attribution',
  'Bounce Tracking',
  'Fingerprinting',
];
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
  selectedFrame: CookieStoreContext['state']['selectedFrame'];
  setSelectedFrame: CookieStoreContext['actions']['setSelectedFrame'];
} = {
  tabCookies: {
    [uncategorised1pCookie.name]: {
      parsedCookie: uncategorised1pCookie,
      analytics: null,
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
      isFirstParty: true,
      isIbcCompliant: true,
      isCookieSet: true,
    },
    [uncategorised3pCookie.name]: {
      parsedCookie: uncategorised3pCookie,
      analytics: null,
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
      isFirstParty: false,
      isIbcCompliant: true,
      isCookieSet: true,
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
      isFirstParty: true,
      isIbcCompliant: true,
      isCookieSet: true,
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
      isFirstParty: false,
      isIbcCompliant: true,
      isCookieSet: true,
    },
  },
  tabUrl: 'https://edition.cnn.com/',
  tabFrames: {
    'https://edition.cnn.com/': {
      frameIds: [1],
    },
    'https://crxt.net/': {
      frameIds: [1],
    },
  },
  selectedFrame: null,
  setSelectedFrame: () => undefined,
};

jest.mock('../../../stateProviders/syncCookieStore', () => ({
  useCookieStore: jest.fn(),
}));

const mockUseCookieStore = useCookieStore as jest.Mock;

describe('Sidebar', () => {
  it('Should render with first menu item selected', () => {
    mockUseCookieStore.mockReturnValue({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    const container = screen.getByTestId('cookies-tab-heading-wrapper');

    expect(container).toHaveClass('bg-royal-blue');
  });

  it('should unselect cookie header and show other header as selected', () => {
    mockUseCookieStore.mockReturnValue({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRenderer = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const attributionContainer = screen.getByTestId('Attribution');

    expect(cookieHeaderContainer).toHaveClass('bg-royal-blue');
    expect(attributionContainer).not.toHaveClass('bg-royal-blue');

    fireEvent.click(attributionContainer);

    sidebarRenderer.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={2}
        setIndex={() => undefined}
      />
    );

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(attributionContainer).toHaveClass('bg-royal-blue');
  });

  it('should select cookie and show the listed frames under cookie menu.', () => {
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );

    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const mainFrame = screen.getByTestId('https://edition.cnn.com/');

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(mainFrame).toBeInTheDocument();
    expect(mainFrame).toHaveClass('bg-royal-blue');
  });

  it('should select another menu and close cookie accordion', () => {
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    const tahHeaderContainer = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );

    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const mainFrame = screen.getByTestId('https://edition.cnn.com/');
    const attributionContainer = screen.getByTestId('Attribution');

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(mainFrame).toBeInTheDocument();
    expect(mainFrame).toHaveClass('bg-royal-blue');

    fireEvent.click(attributionContainer);
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    tahHeaderContainer.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={2}
        setIndex={() => undefined}
      />
    );
    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(attributionContainer).toHaveClass('bg-royal-blue');
  });
});
