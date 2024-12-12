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
import React, { useEffect, useMemo, useState } from 'react';
import { Resizable } from 're-resizable';
import {
  type TabFrames,
  type CookieFrameStorageType,
  type CompleteJson,
  type LibraryData,
  noop,
  type ErroredOutUrlsData,
  reshapeCookies,
  type ErroredOutUrlsData,
} from '@google-psat/common';
import {
  useSidebar,
  Sidebar,
  SIDEBAR_ITEMS_KEYS,
  type SidebarItems,
  File,
  FileWhite,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import SiteMapCookiesWithIssues from './sitemapCookiesWithIssues';
import CookiesTab from './cookies';
import ErroredOutUrls from '../urlsWithIssues';

interface LayoutProps {
  landingPageCookies: CookieFrameStorageType;
  completeJson: CompleteJson[] | null;
  sidebarData: SidebarItems;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
  path: string;
  libraryMatches: { [url: string]: LibraryData } | null;
  erroredOutUrls: ErroredOutUrlsData[];
}

const Layout = ({
  landingPageCookies,
  completeJson,
  sidebarData,
  setSidebarData,
  path,
  erroredOutUrls,
  libraryMatches,
}: LayoutProps) => {
  const [sites, setSites] = useState<string[]>([]);

  useEffect(() => {
    const _sites = new Set<string>();
    completeJson?.forEach(({ pageUrl, erroredOutUrls: _erroredOutURLs }) => {
      if (
        !_erroredOutURLs?.some(
          ({ url, errorName }) => url === pageUrl && errorName !== 'i'
        )
      ) {
        _sites.add(pageUrl);
      }
    });

    setSites(Array.from(_sites));
  }, [completeJson]);

  const reshapedCookies = useMemo(
    () => reshapeCookies(landingPageCookies),
    [landingPageCookies]
  );

  const cookiesWithIssues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(reshapedCookies).filter(
          ([, cookie]) =>
            cookie.isBlocked ||
            (cookie.blockedReasons && cookie.blockedReasons?.length > 0)
        )
      ),
    [reshapedCookies]
  );

  const { activePanel, selectedItemKey, updateSelectedItemKey, isKeySelected } =
    useSidebar(({ state, actions }) => ({
      activePanel: state.activePanel,
      selectedItemKey: state.selectedItemKey,
      updateSelectedItemKey: actions.updateSelectedItemKey,
      isKeySelected: actions.isKeySelected,
    }));

  const { Element: PanelElement, props } = activePanel.panel;
  const { query } = activePanel;
  const clearQuery = useMemo(() => {
    return query ? activePanel.clearQuery : noop;
  }, [query, activePanel.clearQuery]);

  const doesSiteHaveCookies = useMemo(() => {
    const store = {} as Record<string, boolean>;

    completeJson?.forEach((data) => {
      store[data.pageUrl] = Object.entries(data.cookieData).reduce(
        (acc, [, frameData]) => {
          return acc || Object.keys(frameData.frameCookies || {}).length > 0;
        },
        false
      );
    });

    return store;
  }, [completeJson]);

  const tabFrames = useMemo(
    () =>
      sites.reduce<TabFrames>((acc, site) => {
        acc[site] = {} as TabFrames[string];

        return acc;
      }, {}),
    [sites]
  );

  useEffect(() => {
    setSidebarData((prev) => {
      const _data = { ...prev };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: CookiesTab,
        props: {
          tabCookies: reshapedCookies,
          tabFrames,
          completeJson,
          path,
          libraryMatches,
          query,
          clearQuery,
        },
      };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].children = sites.reduce(
        (acc: SidebarItems, site: string) => {
          acc[site] = {
            title: site,
            panel: {
              Element: CookiesTab,
              props: {
                selectedSite: site,
                tabCookies: reshapedCookies,
                tabFrames,
                completeJson,
                path,
                libraryMatches,
                query,
                clearQuery,
              },
            },
            children: {},
            icon: {
              //@ts-ignore
              Element: File,
            },
            selectedIcon: {
              //@ts-ignore
              Element: FileWhite,
            },
            isBlurred: doesSiteHaveCookies[site] === false,
          };

          return acc;
        },
        {}
      );

      _data[SIDEBAR_ITEMS_KEYS.COOKIES_WITH_ISSUES].panel = {
        Element: SiteMapCookiesWithIssues,
        props: {
          cookies: Object.values(cookiesWithIssues),
          path,
        },
      };

      _data[SIDEBAR_ITEMS_KEYS.URL_WITH_ISSUES].panel = {
        Element: ErroredOutUrls,
        props: {
          erroredOutUrls,
        },
      };

      return _data;
    });
  }, [
    erroredOutUrls,
    clearQuery,
    completeJson,
    cookiesWithIssues,
    doesSiteHaveCookies,
    libraryMatches,
    path,
    query,
    reshapedCookies,
    setSidebarData,
    sites,
    tabFrames,
  ]);

  useEffect(() => {
    if (selectedItemKey === null && Object.keys(sidebarData).length > 0) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
    }
  }, [isKeySelected, selectedItemKey, sidebarData, updateSelectedItemKey]);

  return (
    <div className="w-full h-screen flex dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
      <Resizable
        defaultSize={{ width: '200px', height: '100%' }}
        minWidth={'150px'}
        maxWidth={'50%'}
        enable={{
          right: true,
        }}
      >
        <Sidebar />
      </Resizable>
      <div className="flex-1 max-h-screen overflow-auto">
        {PanelElement && <PanelElement {...props} />}
      </div>
    </div>
  );
};

export default Layout;
