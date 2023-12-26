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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Resizable } from 're-resizable';
import {
  CookieIcon,
  CookieIconWhite,
  Sidebar,
  useSidebar,
  type SidebarItems,
  SiteBoundariesIcon,
  SiteBoundariesIconWhite,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useContentStore } from '../stateProviders/contentStore';
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';
import TABS from '../tabs';
import CookiesTab from '../tabs/cookies';
import SiteAffectedCookies from '../tabs/siteAffectedCookies';
import Technologies from '../tabs/technologies';

interface LayoutProps {
  selectedSite: string | null;
}

const Layout = ({ selectedSite }: LayoutProps) => {
  const [data, setData] = useState<SidebarItems>(TABS);
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

  const {
    activePanel,
    selectedItemKey,
    sidebarItems,
    isSidebarFocused,
    setIsSidebarFocused,
    updateSelectedItemKey,
    onKeyNavigation,
    toggleDropdown,
    isKeyAncestor,
    isKeySelected,
  } = useSidebar({ data });

  useEffect(() => {
    setData((prev) => {
      const _data = { ...prev };

      const keys = selectedItemKey?.split('#') ?? [];

      _data['cookies'].panel = (
        <CookiesTab selectedFrameUrl={null} selectedSite={selectedSite} />
      );

      const selectedFrameUrl = frameUrls.find(
        (url) => url === keys[keys.length - 1]
      );

      _data['cookies'].children = frameUrls.reduce(
        (acc: SidebarItems, url: string): SidebarItems => {
          acc[url] = {
            title: url,
            panel: (
              <CookiesTab
                selectedFrameUrl={selectedFrameUrl}
                selectedSite={selectedSite}
              />
            ),
            children: {},
            icon: <CookieIcon />,
            selectedIcon: <CookieIconWhite />,
          };

          return acc;
        },
        {}
      );

      _data['affected-cookies'].panel = (
        <SiteAffectedCookies selectedSite={selectedSite} />
      );

      if (technologies && technologies.length > 0) {
        _data['technologies'] = {
          title: 'Technologies',
          children: {},
          icon: <SiteBoundariesIcon />,
          selectedIcon: <SiteBoundariesIconWhite />,
          panel: <Technologies selectedSite={selectedSite} />,
        };
      } else {
        delete _data['technologies'];
      }

      return _data;
    });
  }, [frameUrls, selectedItemKey, selectedSite, technologies]);

  useEffect(() => {
    if (selectedItemKey === null) {
      updateSelectedItemKey('cookies');
    }
  }, [selectedItemKey, updateSelectedItemKey]);

  const lastSelectedSite = useRef<string | null>(null);

  useEffect(() => {
    if (selectedSite !== lastSelectedSite.current) {
      updateSelectedItemKey('cookies');
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
        <Sidebar
          selectedItemKey={selectedItemKey}
          sidebarItems={sidebarItems}
          isSidebarFocused={isSidebarFocused}
          setIsSidebarFocused={setIsSidebarFocused}
          onKeyNavigation={onKeyNavigation}
          updateSelectedItemKey={updateSelectedItemKey}
          toggleDropdown={toggleDropdown}
          isKeyAncestor={isKeyAncestor}
          isKeySelected={isKeySelected}
        />
      </Resizable>
      <div className="flex-1 max-h-screen overflow-auto">{activePanel}</div>
    </div>
  );
};

export default Layout;
