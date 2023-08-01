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
import { emptyAnalytics } from '../../../../../../worker/findAnalyticsMatch';
import { CookieDetails } from '../components';
import { useContentPanelStore } from '../../../../stateProviders/contentPanelStore';

const emptyCookie = {
  name: '',
  value: '',
  domain: '',
  samesite: '',
  secure: false,
  httponly: false,
  path: '',
  expires: '',
};

const uncategorised1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '_cb',
  value: 'uncategorised1pCookie',
  domain: '.cnn.com',
};

const uncategorised3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'pubsyncexp',
  value: 'uncategorised3pCookie',
  domain: '.ads.pubmatic.com',
};

const known1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '__qca',
  value: 'known1pCookie',
  domain: '.cnn.com',
};

const known3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'KRTBCOOKIE_290',
  value: 'known3pCookie',
  domain: '.pubmatic.com',
};

const mockResponse: {
  tabCookies: NonNullable<CookieStoreContext['state']['tabCookies']>;
  tabUrl: NonNullable<CookieStoreContext['state']['tabUrl']>;
} = {
  tabCookies: {
    [uncategorised1pCookie.name]: {
      parsedCookie: uncategorised1pCookie,
      analytics: { ...emptyAnalytics },
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
    },
    [uncategorised3pCookie.name]: {
      parsedCookie: uncategorised3pCookie,
      analytics: { ...emptyAnalytics },
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
};

jest.mock('../../../../stateProviders/syncCookieStore', () => {
  return {
    useCookieStore: () => {
      return {
        cookies: Object.values(mockResponse.tabCookies),
        tabUrl: mockResponse.tabUrl,
      };
    },
  };
});

jest.mock('../../../../stateProviders/contentPanelStore');
const mockUseContentPanelStore = useContentPanelStore as jest.Mock;
mockUseContentPanelStore.mockReturnValue({
  selectedCookie: mockResponse.tabCookies[uncategorised1pCookie.name],
  tableContainerRef: { current: null },
  tableColumnSize: 100,
  setTableColumnSize: jest.fn(),
});

describe('CookieTab', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  it('should render a list of cookies with analytics', async () => {
    render(<CookieTab />);

    expect((await screen.findAllByTestId('body-row')).length).toBe(4);

    expect((await screen.findAllByText('Uncategorised')).length).toBe(2);
    expect((await screen.findAllByText('Marketing')).length).toBe(2);
  });

  it('should sort cookies by name', async () => {
    render(<CookieTab />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.click(headerCell);

    const firstRow = (await screen.findAllByTestId('body-row'))[0];

    expect(
      await within(firstRow).findByText('KRTBCOOKIE_290')
    ).toBeInTheDocument();

    const lastRow = (await screen.findAllByTestId('body-row'))[3];
    expect(await within(lastRow).findByText('pubsyncexp')).toBeInTheDocument();

    fireEvent.click(headerCell);

    const firstRowAfterReverse = (await screen.findAllByTestId('body-row'))[0];
    expect(
      await within(firstRowAfterReverse).findByText('pubsyncexp')
    ).toBeInTheDocument();

    const lastRowAfterReverse = (await screen.findAllByTestId('body-row'))[3];
    expect(
      await within(lastRowAfterReverse).findByText('KRTBCOOKIE_290')
    ).toBeInTheDocument();
  });

  it('should open column menu when right click on header cell', async () => {
    render(<CookieTab />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.contextMenu(headerCell);

    expect(await screen.findByTestId('column-menu')).toBeInTheDocument();

    const toggleAll = await screen.findByText('Toggle All');
    fireEvent.click(toggleAll);

    expect(await screen.findAllByTestId('header-cell')).toHaveLength(1);

    fireEvent.contextMenu(headerCell);
    fireEvent.click(toggleAll);
  });

  it('should remove one columne when click on column menu list item', async () => {
    render(<CookieTab />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.contextMenu(headerCell);

    const columnMenu = await screen.findByTestId('column-menu');

    const value = await within(columnMenu).findByText('Value');
    fireEvent.click(value);

    expect(await screen.findAllByTestId('header-cell')).not.toContain(value);
  });

  it('should columnMenu close when click on outside', async () => {
    render(<CookieTab />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.contextMenu(headerCell);

    const columnMenuOverlay = await screen.findByTestId('column-menu-overlay');
    fireEvent.click(columnMenuOverlay);

    setTimeout(() => {
      expect(screen.queryByTestId('column-menu')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should render a cookie card with placeholder text when no cookie is selected', async () => {
    mockUseContentPanelStore.mockReturnValue({
      selectedCookie: null,
      tableContainerRef: { current: null },
      tableColumnSize: 100,
      setTableColumnSize: jest.fn(),
    });

    render(<CookieDetails />);

    expect(
      await screen.findByText('Select a cookie to preview its value')
    ).toBeInTheDocument();
  });

  it('should show a cookie card with the information on first cookie in the list', async () => {
    const firstCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[0]];

    mockUseContentPanelStore.mockReturnValue({
      selectedCookie: firstCookie,
      tableContainerRef: { current: null },
      tableColumnSize: 100,
      setTableColumnSize: jest.fn(),
    });

    render(<CookieDetails />);
    const card = await screen.findByTestId('cookie-card');

    expect(card).toBeInTheDocument();

    expect(
      await within(card).findByText(firstCookie.parsedCookie.value)
    ).toBeInTheDocument();
  });

  it('should show a cookie card with the description about cookie', async () => {
    mockUseContentPanelStore.mockReturnValue({
      selectedCookie: mockResponse.tabCookies[known1pCookie.name],
      tableContainerRef: { current: null },
      tableColumnSize: 100,
      setTableColumnSize: jest.fn(),
    });

    render(<CookieDetails />);

    const card = await screen.findByTestId('cookie-card');

    const description =
      mockResponse.tabCookies?.[known1pCookie.name]?.analytics?.description ||
      'No description available.';

    expect(await within(card).findByText(description)).toBeInTheDocument();
  });

  it('should show a cookie card with no description about cookie', async () => {
    mockUseContentPanelStore.mockReturnValue({
      selectedCookie: mockResponse.tabCookies[uncategorised1pCookie.name],
      tableContainerRef: { current: null },
      tableColumnSize: 100,
      setTableColumnSize: jest.fn(),
    });

    render(<CookieDetails />);

    const card = await screen.findByTestId('cookie-card');

    expect(
      await within(card).findByText('No description available.')
    ).toBeInTheDocument();
  });

  it('should get the cookie object when row is clicked or Arrow up/down pressed', async () => {
    const setStateMock = jest.fn();
    mockUseContentPanelStore.mockReturnValue({
      selectedCookie: null,
      setSelectedCookie: setStateMock,
      tableContainerRef: {
        current: {
          offsetWidth: 1000,
        },
      },
      tableColumnSize: 100,
      setTableColumnSize: jest.fn(),
    });

    render(<CookieTab />);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useStateMock: any = (initState: any) => [initState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

    const row = (await screen.findAllByTestId('body-row'))[0];
    fireEvent.click(row);

    expect(setStateMock).toHaveBeenCalledWith(
      mockResponse.tabCookies[uncategorised1pCookie.name]
    );

    fireEvent.keyDown(row, { key: 'ArrowDown', code: 'ArrowDown' });

    expect(setStateMock).toHaveBeenCalledWith(
      mockResponse.tabCookies[uncategorised1pCookie.name]
    );
  });
});
