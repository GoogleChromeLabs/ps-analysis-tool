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
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
import { CookieDetails, Details } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import CookieTab from '..';
import mockResponse, {
  uncategorized1pCookie,
  known1pCookie,
  known3pCookieWithValue,
} from '../../../../../utils/test-data/cookieMockData';
import { noop } from '@ps-analysis-tool/common';

jest.mock('../../../stateProviders/syncCookieStore', () => {
  return {
    useCookieStore: () => {
      return {
        cookies: Object.values(mockResponse.tabCookies),
        tabFrames: mockResponse.tabFrames,
        selectedFrame: mockResponse.selectedFrame,
        isCurrentTabBeingListenedTo: true,
        allowedNumberOfTabs: 'single',
        loading: false,
        tabCookies: Object.values(mockResponse.tabCookies),
      };
    },
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe.skip('CookieTab', () => {
  beforeAll(() => {
    globalThis.chrome = {
      ...(SinonChrome as unknown as typeof chrome),
      storage: {
        // @ts-ignore
        session: {
          // @ts-ignore
          onChanged: {
            addListener: () => undefined,
            removeListener: () => undefined,
          },
        },
      },
    };

    globalThis.Promise = Promise;
  });

  it('should render a list of cookies with analytics', async () => {
    render(<CookieTab setFilteredCookies={noop} />);

    expect((await screen.findAllByTestId('body-row')).length).toBe(4);

    expect((await screen.findAllByText('Uncategorized')).length).toBe(2);
    expect((await screen.findAllByText('Marketing')).length).toBe(2);
  });

  it('should sort cookies by name', async () => {
    render(<CookieTab setFilteredCookies={noop} />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.mouseEnter(headerCell);
    waitFor(
      async () => {
        await new Promise((r) => setTimeout(r, 100));
      },
      { timeout: 1000 }
    );
    fireEvent.click(headerCell);

    const firstRow = (await screen.findAllByTestId('body-row'))[0];
    waitFor(
      async () => {
        expect(
          await within(firstRow).findByText('KRTBCOOKIE_290')
        ).toBeInTheDocument();
      },
      { interval: 1000 }
    );

    const lastRow = (await screen.findAllByTestId('body-row'))[3];
    waitFor(
      async () => {
        expect(
          await within(lastRow).findByText('pubsyncexp')
        ).toBeInTheDocument();
      },
      { interval: 1000 }
    );

    fireEvent.click(headerCell);

    const firstRowAfterReverse = (await screen.findAllByTestId('body-row'))[0];
    waitFor(
      async () => {
        expect(
          await within(firstRowAfterReverse).findByText('pubsyncexp')
        ).toBeInTheDocument();
      },
      { interval: 1000 }
    );

    const lastRowAfterReverse = (await screen.findAllByTestId('body-row'))[3];
    waitFor(
      async () => {
        expect(
          await within(lastRowAfterReverse).findByText('KRTBCOOKIE_290')
        ).toBeInTheDocument();
      },
      { interval: 1000 }
    );
  });

  it('should open column menu when right click on header cell', async () => {
    render(<CookieTab setFilteredCookies={noop} />);

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
    render(<CookieTab setFilteredCookies={noop} />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.contextMenu(headerCell);

    const columnMenu = await screen.findByTestId('column-menu');

    const value = await within(columnMenu).findByText('Value');
    fireEvent.click(value);

    expect(await screen.findAllByTestId('header-cell')).not.toContain(value);
  });

  it('should columnMenu close when click on outside', async () => {
    render(<CookieTab setFilteredCookies={noop} />);

    const headerCell = (await screen.findAllByTestId('header-cell'))[0];
    fireEvent.contextMenu(headerCell);

    const columnMenuOverlay = await screen.findByTestId('column-menu-overlay');
    fireEvent.click(columnMenuOverlay);

    setTimeout(() => {
      expect(screen.queryByTestId('column-menu')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should render a cookie card with placeholder text when no cookie is selected', async () => {
    render(<CookieDetails selectedFrameCookie={null} />);

    expect(
      await screen.findByText('Select cookies to preview its value')
    ).toBeInTheDocument();
  });

  it('should decode cookie value when input show URI decoded is checked', async () => {
    render(
      <Details
        selectedCookie={mockResponse.tabCookies[uncategorized1pCookie.name]}
      />
    );

    const checkbox = screen.getByRole('checkbox', {
      checked: false,
    });
    fireEvent.click(checkbox);

    expect(
      await screen.findByText(decodeURIComponent(uncategorized1pCookie.value))
    ).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(
      await screen.findByText(uncategorized1pCookie.value)
    ).toBeInTheDocument();
  });

  it('should show a cookie card with the information on first cookie in the list', async () => {
    const firstCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[0]];

    render(<CookieDetails selectedFrameCookie={{ 1: firstCookie }} />);
    const card = await screen.findByTestId('cookie-card');

    expect(card).toBeInTheDocument();

    expect(
      await within(card).findByText(firstCookie.parsedCookie.value)
    ).toBeInTheDocument();
  });

  it('should show a cookie card with the description about cookie', async () => {
    render(
      <CookieDetails
        selectedFrameCookie={{
          1: mockResponse.tabCookies[known1pCookie.name],
        }}
      />
    );

    const card = await screen.findByTestId('cookie-card');

    const description =
      mockResponse.tabCookies?.[known1pCookie.name]?.analytics?.description ||
      'No description available.';

    expect(await within(card).findByText(description)).toBeInTheDocument();
  });

  it('should show a cookie card with no description about cookie', async () => {
    render(
      <CookieDetails
        selectedFrameCookie={{
          1: mockResponse.tabCookies[uncategorized1pCookie.name],
        }}
      />
    );

    const card = await screen.findByTestId('cookie-card');

    expect(
      await within(card).findByText('No description available.')
    ).toBeInTheDocument();
  });

  it('should get the cookie object when row is clicked or Arrow up/down pressed', async () => {
    render(<CookieTab setFilteredCookies={noop} />);

    const row = await screen.findAllByTestId('body-row');
    fireEvent.click(row[0]);

    expect(row[0]).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(row[0], { key: 'ArrowDown', code: 'ArrowDown' });

    expect(row[1]).not.toHaveClass('dark:bg-charlston-green');

    const emptyRow = await screen.findByTestId('empty-row');
    fireEvent.click(emptyRow);

    expect(emptyRow).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(emptyRow, { key: 'ArrowDown', code: 'ArrowDown' });

    expect(emptyRow).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(emptyRow, { key: 'ArrowUp', code: 'ArrowUp' });

    expect(row[row.length - 1]).not.toHaveClass('dark:bg-charlston-green');
  });

  it('should decode the cookie value on clicking checkbox', async () => {
    const lastCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[3]];

    render(
      <CookieDetails
        selectedFrameCookie={{
          1: mockResponse.tabCookies[known3pCookieWithValue.name],
        }}
      />
    );
    const card = await screen.findByTestId('cookie-card');

    expect(card).toBeInTheDocument();
    expect(screen.getByText(lastCookie.parsedCookie.value)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('show-url-decoded-checkbox'));

    expect(
      await within(card).findByText('known3p_Cookie-with value')
    ).toBeInTheDocument();
  });
});
