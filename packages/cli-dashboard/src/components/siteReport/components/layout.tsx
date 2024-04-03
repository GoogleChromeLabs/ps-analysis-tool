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
import React, { useEffect, useMemo, useRef } from 'react';
import { Resizable } from 're-resizable';
import {
  CookieIcon,
  CookieIconWhite,
  Sidebar,
  useSidebar,
  type SidebarItems,
  SiteBoundariesIcon,
  SiteBoundariesIconWhite,
  SIDEBAR_ITEMS_KEYS,
} from '@ps-analysis-tool/design-system';
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { useContentStore } from '../stateProviders/contentStore';
import CookiesTab from '../tabs/cookies';
import SiteCookiesWithIssues from '../tabs/siteCookiesWithIssues';
import Technologies from '../tabs/technologies';

interface LayoutProps {
  selectedSite: string | null;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const Layout = ({ selectedSite, setSidebarData }: LayoutProps) => {
  const { tabCookies, technologies } = useContentStore(({ state }) => ({
    tabCookies: state.tabCookies,
    technologies: state.technologies,
  }));

  const frameUrls = useMemo(
    () => [
      ...new Set(
        Object.values(tabCookies)
          .reduce((acc, cookie) => {
            acc.push(...(cookie.frameUrls as string[]));
            return acc;
          }, [] as string[])
          .filter(
            (url) => url?.includes('http') || url === UNKNOWN_FRAME_KEY
          ) as string[]
      ),
    ],
    [tabCookies]
  );

  const { activePanel, selectedItemKey, updateSelectedItemKey } = useSidebar(
    ({ state, actions }) => ({
      activePanel: state.activePanel,
      selectedItemKey: state.selectedItemKey,
      updateSelectedItemKey: actions.updateSelectedItemKey,
    })
  );

  const { Element: PanelElement, props } = activePanel.panel;

  useEffect(() => {
    setSidebarData((prev) => {
      const _data = { ...prev };

      const keys = selectedItemKey?.split('#') ?? [];

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: CookiesTab,
        props: {
          selectedFrameUrl: null,
          selectedSite,
        },
      };

      const selectedFrameUrl = frameUrls.find(
        (url) => url === keys[keys.length - 1]
      );

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].children = frameUrls.reduce(
        (acc: SidebarItems, url: string): SidebarItems => {
          acc[url] = {
            title: url,
            panel: {
              Element: CookiesTab,
              props: {
                selectedFrameUrl,
                selectedSite,
              },
            },
            children: {},
            icon: {
              Element: CookieIcon,
            },
            selectedIcon: {
              Element: CookieIconWhite,
            },
          };

          return acc;
        },
        {}
      );

      _data[SIDEBAR_ITEMS_KEYS.COOKIES_WITH_ISSUES].panel = {
        Element: SiteCookiesWithIssues,
        props: {
          selectedSite,
        },
      };

      if (technologies && technologies.length > 0) {
        _data[SIDEBAR_ITEMS_KEYS.TECHNOLOGIES] = {
          title: 'Technologies',
          children: {},
          icon: {
            Element: SiteBoundariesIcon,
          },
          selectedIcon: {
            Element: SiteBoundariesIconWhite,
          },
          panel: {
            Element: Technologies,
            props: {
              selectedSite,
            },
          },
        };
      } else {
        delete _data[SIDEBAR_ITEMS_KEYS.TECHNOLOGIES];
      }

      return _data;
    });
  }, [frameUrls, selectedItemKey, selectedSite, setSidebarData, technologies]);

  useEffect(() => {
    if (selectedItemKey === null) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
    }
  }, [selectedItemKey, updateSelectedItemKey]);

  const lastSelectedSite = useRef<string | null>(null);

  useEffect(() => {
    if (selectedSite !== lastSelectedSite.current) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
      lastSelectedSite.current = selectedSite;
    }
  }, [selectedSite, updateSelectedItemKey]);

  return (
    <div className="w-full h-full flex">
      <Resizable
        defaultSize={{ width: '200px', height: '100%' }}
        minWidth={'150px'}
        maxWidth={'60%'}
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
