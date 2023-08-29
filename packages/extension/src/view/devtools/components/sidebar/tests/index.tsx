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

const tabNames = [
  'Cookies',
  'Topics',
  'Attribution',
  'Bounce Tracking',
  'Fingerprinting',
  'First Party Sets',
];
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

  it('should select another menu and unselect cookie accordion', () => {
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

  it('should close accordion and deselect the frame.', () => {
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
    const accordionOpener = screen.getByTestId('accordion-opener');
    fireEvent.click(accordionOpener);
    expect(accordionOpener).not.toHaveClass('-rotate-90');

    fireEvent.click(screen.getByTestId('https://edition.cnn.com/'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });

    fireEvent.click(accordionOpener);
    expect(accordionOpener).toHaveClass('-rotate-90');
  });

  it('Left Arrow should close accordion', async () => {
    render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on the cookie heading
    userEvent.tab();
    // Simulate right arrow key down
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Simulate left arrow key down
    userEvent.keyboard('{ArrowLeft}');
    expect(await screen.findByTestId('accordion-opener')).toHaveClass(
      '-rotate-90'
    );
  });

  it('Left Arrow should unselect selected frame and select the Cookies menu', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Should focus on cookies menu
    userEvent.tab();
    //Simulate right arrow key down
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Simulate down arrow key down
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate left arrow key down
    userEvent.keyboard('{ArrowLeft}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down Arrow should select next frame', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Focus on the cookies menu
    userEvent.tab();
    //Simulate right arrow key keydown to open accordion
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Simulate down arrow key keydown to select frame
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate down arrow key keydown to select next frame
    userEvent.keyboard('{ArrowDown}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Up Arrow should select previous frame', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Focus on cookie menu header
    userEvent.tab();
    //Simulate right arrow key keydown to simulate accordion opening.
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Simulate down arrow key keydown to select first frame
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate down arrow key keydown to select next frame
    userEvent.keyboard('{ArrowDown}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate up arrow key keydown to select previous frame
    userEvent.keyboard('{ArrowUp}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('https://crxt.net/')).not.toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Up Arrow should unselect selected frame and select the Cookies menu', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Focus on cookie menu header
    userEvent.tab();
    //Simulate right arrow key keydown to simulate accordion opening.
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    //Simulate down arrow key keydown to select first frame
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate up arrow key keydown to select cookie menu header
    userEvent.keyboard('{ArrowUp}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('cookies-tab-heading-wrapper')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down Arrow on last frame should select the next main menu tab.', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );

    fireEvent.click(screen.getByTestId('https://crxt.net/'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    //Simulate arrow down key to go to Topics menu
    userEvent.keyboard('{ArrowDown}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={1}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://crxt.net/')).not.toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('Topics')).toHaveClass('bg-royal-blue');
  });

  it('Up Arrow on Topics menu should select last frame in accordion.', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Click on Topics tab
    fireEvent.click(screen.getByTestId('Topics'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={1}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('Topics')).toHaveClass('bg-royal-blue');
    //Simulate arrow up to select last frame in the list.
    userEvent.keyboard('{ArrowUp}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://crxt.net/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://crxt.net/')).toHaveClass(
      'bg-royal-blue'
    );
    expect(screen.getByTestId('Topics')).not.toHaveClass('bg-royal-blue');
  });

  it('Up Arrow on Attribution menu should select Topics Menu.', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Click on Attribution tab
    fireEvent.click(screen.getByTestId('Attribution'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={2}
        setIndex={() => undefined}
      />
    );
    expect(await screen.findByTestId('Attribution')).toHaveClass(
      'bg-royal-blue'
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.keyboard('{ArrowUp}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={1}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('Topics')).toHaveClass('bg-royal-blue');
    expect(screen.getByTestId('Attribution')).not.toHaveClass('bg-royal-blue');
  });

  it('Down Arrow on cookies menu with open accordion should select first frame.', async () => {
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    //Simulate arrow down key to select first frame.
    userEvent.keyboard('{ArrowDown}');

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: 'https://edition.cnn.com/',
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('https://edition.cnn.com/')).toHaveClass(
      'bg-royal-blue'
    );
  });

  it('Down Arrow on Topics menu should select Attribution Menu.', async () => {
    const sidebarRender = render(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={0}
        setIndex={() => undefined}
      />
    );
    // Focus on cookie header menu and simulate right arrow to open accordion
    userEvent.tab();
    userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Click on Topics tab
    fireEvent.click(screen.getByTestId('Topics'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={1}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('Topics')).toHaveClass('bg-royal-blue');
    // Simulate down arrow to go to next menu.
    userEvent.keyboard('{ArrowDown}');
    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={2}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('Attribution')).toHaveClass('bg-royal-blue');
    expect(screen.getByTestId('Topics')).not.toHaveClass('bg-royal-blue');
  });

  it('Down Arrow on Topics menu should select Attribution Menu.', () => {
    const setIndexMock = jest.fn();
    const sidebarRender = render(
      <Sidebar tabsNames={tabNames} selectedIndex={0} setIndex={setIndexMock} />
    );
    // Click on accordion opener button.
    fireEvent.click(screen.getByTestId('accordion-opener'));

    expect(screen.getByTestId('accordion-opener')).not.toHaveClass(
      '-rotate-90'
    );
    // Click on Topics menu
    fireEvent.click(screen.getByTestId('Topics'));

    mockUseCookieStore.mockReturnValueOnce({
      cookies: mockResponse.tabCookies,
      tabUrl: mockResponse.tabUrl,
      tabFrames: mockResponse.tabFrames,
      selectedFrame: null,
      setSelectedFrame: mockResponse.setSelectedFrame,
    });
    sidebarRender.rerender(
      <Sidebar
        tabsNames={tabNames}
        selectedIndex={1}
        setIndex={() => undefined}
      />
    );
    expect(screen.getByTestId('Topics')).toHaveClass('bg-royal-blue');

    fireEvent.click(screen.getByTestId('https://crxt.net/'));
    // Check if setIndex was called.
    expect(setIndexMock).toHaveBeenCalled();
  });
});
