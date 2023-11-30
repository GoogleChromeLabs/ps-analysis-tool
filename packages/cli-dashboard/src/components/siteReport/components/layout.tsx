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
  CookieIcon,
  CookieIconWhite,
  Sidebar,
  useSidebar,
  type SidebarItem,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useContentStore } from '../stateProviders/contentStore';
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';
import TABS from '../tabs';
import CookiesTab from '../tabs/cookies';
import AffectedCookies from '../tabs/affectedCookies';

const Layout = () => {
  const [data, setData] = useState<SidebarItem[]>(TABS);
  const { tabCookies } = useContentStore(({ state }) => ({
    tabCookies: state.tabCookies,
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
    updateSelectedItemKey,
    isKeyAncestor,
    isKeySelected,
  } = useSidebar({ data });

  useEffect(() => {
    setData((prev) => {
      const _data = [...prev];

      const keys = selectedItemKey?.split('#') ?? [];

      _data[0].panel = (
        <CookiesTab
          selectedFrameUrl={null}
          selectedSite={keys[keys.length - 2]}
        />
      );

      _data[0].children = frameUrls.map(
        (url): SidebarItem => ({
          key: url,
          title: url,
          panel: (
            <CookiesTab
              selectedFrameUrl={keys[keys.length - 1]}
              selectedSite={keys[keys.length - 2]}
            />
          ),
          children: [],
          icon: <CookieIcon />,
          selectedIcon: <CookieIconWhite />,
        })
      );

      _data[2].panel = (
        <AffectedCookies selectedFrameUrl={keys[keys.length - 1]} />
      );

      return _data;
    });
  }, [frameUrls, selectedItemKey]);

  useEffect(() => {
    if (selectedItemKey === null) {
      updateSelectedItemKey('cookies');
    }
  }, [selectedItemKey, updateSelectedItemKey]);

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
          sidebarItems={sidebarItems}
          updateSelectedItemKey={updateSelectedItemKey}
          isKeyAncestor={isKeyAncestor}
          isKeySelected={isKeySelected}
        />
      </Resizable>
      <div className="flex-1 max-h-screen overflow-auto">{activePanel}</div>
    </div>
  );
};

export default Layout;
