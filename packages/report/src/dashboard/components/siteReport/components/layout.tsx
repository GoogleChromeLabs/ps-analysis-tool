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
import { I18n } from '@google-psat/i18n';
import { noop } from '@google-psat/common';
import {
  Sidebar,
  useSidebar,
  SIDEBAR_ITEMS_KEYS,
  type SidebarItems,
  CookieIcon,
  CookieIconWhite,
  SiteBoundariesIcon,
  SiteBoundariesIconWhite,
} from '@google-psat/design-system';

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
  query?: string;
  clearQuery?: () => void;
}

const Layout = ({
  selectedSite,
  setSidebarData,
  query = '',
  clearQuery = noop,
}: LayoutProps) => {
  const { technologies, completeJson } = useContentStore(({ state }) => ({
    technologies: state.technologies,
    completeJson: state.completeJson,
  }));

  const frameUrls = useMemo(() => {
    const frames = Object.keys(completeJson?.[0].cookieData ?? {});

    return frames.filter((url) => url?.includes('http'));
  }, [completeJson]);

  const { activePanel, selectedItemKey, updateSelectedItemKey } = useSidebar(
    ({ state, actions }) => ({
      activePanel: state.activePanel,
      selectedItemKey: state.selectedItemKey,
      updateSelectedItemKey: actions.updateSelectedItemKey,
    })
  );

  const { Element: PanelElement, props } = activePanel.panel;
  const _clearQuery = useMemo(
    () => (query ? clearQuery : noop),
    [query, clearQuery]
  );

  useEffect(() => {
    setSidebarData((prev) => {
      const _data = { ...prev };

      const keys = selectedItemKey?.split('#') ?? [];

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: CookiesTab,
        props: {
          selectedFrameUrl: null,
          selectedSite,
          isSiteMapLandingContainer: false,
          query,
          clearQuery: _clearQuery,
          url:
            completeJson && completeJson?.length > 1
              ? selectedSite
              : completeJson?.[0]?.pageUrl,
        },
      };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].children = frameUrls.reduce(
        (acc: SidebarItems, url: string): SidebarItems => {
          acc[url] = {
            title: url,
            panel: {
              Element: CookiesTab,
              props: {
                selectedFrameUrl: keys[keys.length - 1],
                selectedSite,
              },
            },
            children: {},
            icon: {
              //@ts-ignore
              Element: CookieIcon,
            },
            selectedIcon: {
              //@ts-ignore
              Element: CookieIconWhite,
            },
            isBlurred:
              Object.keys(
                completeJson?.[0].cookieData?.[url]?.frameCookies || {}
              ).length === 0,
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
          title: I18n.getMessage('technologies'),
          children: {},
          icon: {
            //@ts-ignore
            Element: SiteBoundariesIcon,
          },
          selectedIcon: {
            //@ts-ignore
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
  }, [
    _clearQuery,
    completeJson,
    frameUrls,
    query,
    selectedItemKey,
    selectedSite,
    setSidebarData,
    technologies,
  ]);

  useEffect(() => {
    if (selectedItemKey === null) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
    }
  }, [clearQuery, selectedItemKey, updateSelectedItemKey]);

  const lastSelectedSite = useRef<string | null>(null);

  useEffect(() => {
    if (selectedSite !== lastSelectedSite.current) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
      lastSelectedSite.current = selectedSite;
    }
  }, [selectedSite, updateSelectedItemKey]);

  return (
    <div className="w-full h-full flex dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
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
