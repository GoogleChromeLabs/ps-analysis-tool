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
import userEvent from '@testing-library/user-event';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import Sidebar from '..';
import {
  useCookieStore,
  type CookieStoreContext,
} from '../../../stateProviders/syncCookieStore';
import { act } from 'react-dom/test-utils';

const uncategorized1pCookie: ParsedCookie = {
  name: '_cb',
  value: 'uncategorized1pCookie',
  domain: '.cnn.com',
};

const uncategorized3pCookie: ParsedCookie = {
  name: 'pubsyncexp',
  value: 'uncategorized3pCookie',
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
    [uncategorized1pCookie.name]: {
      parsedCookie: uncategorized1pCookie,
      analytics: null,
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
      isFirstParty: true,
      isCookieSet: true,
    },
    [uncategorized3pCookie.name]: {
      parsedCookie: uncategorized3pCookie,
      analytics: null,
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      frameIdList: [1],
      isFirstParty: false,
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

const goToCookiesMenu = () => {
  act(() => {
    //Focus on cookie menu header
    userEvent.tab();
    //Simulate right arrow key keydown to simulate accordion opening.
    userEvent.keyboard('{ArrowRight}');
    userEvent.keyboard('{ArrowDown}');
  });
  act(() => {
    userEvent.keyboard('{ArrowRight}');
  });
};
const goToFirstFrame = () => {
  act(() => {
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    userEvent.keyboard('{ArrowDown}');
  });
  act(() => {
    userEvent.keyboard('{ArrowRight}');
    userEvent.keyboard('{ArrowDown}');
  });
};

jest.mock('../../../stateProviders/syncCookieStore', () => ({
  useCookieStore: jest.fn(),
}));

const mockUseCookieStore = useCookieStore as jest.Mock;

describe('Sidebar', () => {
  it('Should render with first menu item selected', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    render(<Sidebar selectedIndex={0} setIndex={() => undefined} />);
    const container = screen.getByTestId('privacySandbox-tab-heading-wrapper');

    expect(container).toHaveClass('bg-royal-blue');
  });

  it('should unselect cookie header and show other header as selected', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRenderer = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    fireEvent.click(screen.getByTestId('privacySandbox-accordion-opener'));
    fireEvent.click(screen.getByTestId('cookies-tab-heading-wrapper'));

    sidebarRenderer.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const siteBoundariesContainer = screen.getByTestId(
      'siteBoundaries-tab-heading-wrapper'
    );

    expect(cookieHeaderContainer).toHaveClass('bg-royal-blue');
    expect(siteBoundariesContainer).not.toHaveClass('bg-royal-blue');

    fireEvent.click(siteBoundariesContainer);

    sidebarRenderer.rerender(
      <Sidebar selectedIndex={2} setIndex={() => undefined} />
    );

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(siteBoundariesContainer).toHaveClass('bg-royal-blue');
  });

  it('should select cookie and show the listed frames under cookie menu.', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    render(<Sidebar selectedIndex={0} setIndex={() => undefined} />);

    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const mainFrame = screen.getByTestId('https://edition.cnn.com/');

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(mainFrame).toBeInTheDocument();
    expect(mainFrame).toHaveClass('bg-royal-blue');
  });

  it('should select another menu and unselect cookie accordion', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    const tahHeaderContainer = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );

    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const mainFrame = screen.getByTestId('https://edition.cnn.com/');
    const siteBoundariesContainer = screen.getByTestId(
      'siteBoundaries-tab-heading-wrapper'
    );

    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(mainFrame).toBeInTheDocument();
    expect(mainFrame).toHaveClass('bg-royal-blue');

    fireEvent.click(siteBoundariesContainer);
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    tahHeaderContainer.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(cookieHeaderContainer).not.toHaveClass('bg-royal-blue');
    expect(siteBoundariesContainer).toHaveClass('bg-royal-blue');
  });

  it('should close accordion and deselect the frame.', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    render(<Sidebar selectedIndex={0} setIndex={() => undefined} />);
    const accordionOpener = screen.getByTestId('cookies-accordion-opener');
    fireEvent.click(accordionOpener);
    expect(accordionOpener).not.toHaveClass('-rotate-90');

    fireEvent.click(screen.getByTestId('https://edition.cnn.com/'));

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    fireEvent.click(accordionOpener);
    expect(accordionOpener).toHaveClass('-rotate-90');
  });

  it('Left Arrow should close accordion', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    render(<Sidebar selectedIndex={0} setIndex={() => undefined} />);
    // Focus on the cookie heading
    act(() => {
      userEvent.tab();
      // Simulate right arrow key down
      userEvent.keyboard('{ArrowRight}');
    });
    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    // Simulate left arrow key down
    act(() => {
      userEvent.keyboard('{ArrowLeft}');
    });
    expect(await screen.findByTestId('cookies-accordion-opener')).toHaveClass(
      '-rotate-90'
    );
  });

  it('Left Arrow should unselect selected frame and select the Cookies menu', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    //Should focus on cookies menu
    goToFirstFrame();
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate left arrow key down
    userEvent.keyboard('{ArrowLeft}');
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down Arrow should select next frame', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToCookiesMenu();

    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    //Simulate down arrow key keydown to select frame
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate down arrow key keydown to select next frame
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Up Arrow should select previous frame', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToCookiesMenu();

    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    act(() => {
      //Simulate down arrow key keydown to select first frame
      userEvent.keyboard('{ArrowDown}');
    });
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    act(() => {
      //Simulate down arrow key keydown to select next frame
      userEvent.keyboard('{ArrowDown}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    act(() => {
      //Simulate up arrow key keydown to select previous frame
      userEvent.keyboard('{ArrowUp}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).not.toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Up Arrow should unselect selected frame and select the Cookies menu', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToFirstFrame();

    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    act(() => {
      //Simulate down arrow key keydown to select first frame
      userEvent.keyboard('{ArrowDown}');
    });
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    act(() => {
      //Simulate up arrow key keydown to select cookie menu header
      userEvent.keyboard('{ArrowUp}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down Arrow on last frame should select the next main menu tab.', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToFirstFrame();
    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={2} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://crxt.net/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });

  it('Up Arrow on Site Boundaries menu should select last frame in accordion.', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToFirstFrame();

    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    // Click on Topics tab
    fireEvent.click(screen.getByTestId('siteBoundaries-tab-heading-wrapper'));

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
    act(() => {
      //Simulate arrow up to select last frame in the list.
      userEvent.keyboard('{ArrowUp}');
    });
    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).not.toHaveClass('bg-royal-blue');
  });

  it('Up Arrow on Private Advertising menu should select Site Boundaries Menu.', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    act(() => {
      // Focus on cookie header menu and simulate right arrow to open accordion
      userEvent.tab();
      userEvent.keyboard('{ArrowRight}');
      userEvent.keyboard('{ArrowDown}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={2} setIndex={() => undefined} />
    );
    act(() => {
      userEvent.keyboard('{ArrowDown}');
      userEvent.keyboard('{ArrowDown}');
    });
    expect(
      await screen.findByTestId('privacySandbox-accordion-opener')
    ).not.toHaveClass('-rotate-90');

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={5} setIndex={() => undefined} />
    );
    expect(
      await screen.findByTestId('privateAdvertising-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
    act(() => {
      // Focus on cookie header menu and simulate right arrow to open accordion
      userEvent.keyboard('{ArrowUp}');
    });
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={2} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
    expect(
      screen.getByTestId('privateAdvertising-tab-heading-wrapper')
    ).not.toHaveClass('bg-royal-blue');
  });

  it('Down Arrow on cookies menu with open accordion should select first frame.', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToCookiesMenu();
    act(() => {
      //Simulate arrow down key to select first frame.
      userEvent.keyboard('{ArrowRight}');
    });
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    act(() => {
      //Simulate arrow down key to select first frame.
      userEvent.keyboard('{ArrowDown}');
    });

    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down SiteBoundaries on Topics menu should select Private Advertising Menu.', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    act(() => {
      //Focus on cookie menu header
      userEvent.tab();
      //Simulate right arrow key keydown to simulate accordion opening.
      userEvent.keyboard('{ArrowRight}');
      userEvent.keyboard('{ArrowDown}');
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    expect(await screen.findByTestId('cookies-accordion-opener')).toHaveClass(
      '-rotate-90'
    );

    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={2} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
    act(() => {
      userEvent.keyboard('{ArrowDown}');
    });
    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={5} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('privateAdvertising-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).not.toHaveClass('bg-royal-blue');
  });

  it('Check if clicking on frame calls setIndex function', () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const setIndexMock = jest.fn();
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={setIndexMock} />
    );
    // Click on accordion opener button.
    fireEvent.click(screen.getByTestId('cookies-accordion-opener'));

    expect(screen.getByTestId('cookies-accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Click on siteBoundaries menu
    fireEvent.click(screen.getByTestId('siteBoundaries-tab-heading-wrapper'));

    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('siteBoundaries-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');

    fireEvent.click(screen.getByTestId('https://crxt.net/'));
    // Check if setIndex was called.
    expect(setIndexMock).toHaveBeenCalled();
  });

  it('3 left arrow from first frame should close the main accordion', async () => {
    mockUseCookieStore.mockReturnValue({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    goToFirstFrame();
    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    expect(
      await screen.findByTestId('cookies-accordion-opener')
    ).not.toHaveClass('-rotate-90');
    expect(await screen.findByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );

    act(() => {
      userEvent.keyboard('{ArrowLeft}');
    });
    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={1} setIndex={() => undefined} />
    );
    act(() => {
      userEvent.keyboard('{ArrowLeft}');
    });
    act(() => {
      userEvent.keyboard('{ArrowLeft}');
    });

    mockUseCookieStore.mockReturnValueOnce({
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar selectedIndex={0} setIndex={() => undefined} />
    );
    expect(
      screen.getByTestId('privacySandbox-tab-heading-wrapper')
    ).toHaveClass('bg-royal-blue');
  });
});
