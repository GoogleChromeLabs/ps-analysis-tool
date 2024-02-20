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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  UNKNOWN_FRAME_KEY,
  type CookieTableData,
} from '@ps-analysis-tool/common';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
  CookieIconWhite,
  CookieIcon,
  InspectButton,
} from '@ps-analysis-tool/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Cookies from './cookies';
import useFrameOverlay from '../hooks/useFrameOverlay';
import { useCookieStore } from '../stateProviders/syncCookieStore';

interface LayoutProps {
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const Layout = ({ setSidebarData }: LayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const {
    tabFrames,
    frameHasCookies,
    canStartInspecting,
    tabUrl,
    isInspecting,
    setIsInspecting,
    selectedFrame,
    setSelectedFrame,
  } = useCookieStore(({ state, actions }) => ({
    tabFrames: state.tabFrames,
    frameHasCookies: state.frameHasCookies,
    canStartInspecting: state.canStartInspecting,
    tabUrl: state.tabUrl,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
    selectedFrame: state.selectedFrame,
    setSelectedFrame: actions.setSelectedFrame,
  }));

  const {
    activePanel,
    selectedItemKey,
    currentItemKey,
    isSidebarFocused,
    updateSelectedItemKey,
    isKeySelected,
  } = useSidebar(({ state, actions }) => ({
    activePanel: state.activePanel,
    selectedItemKey: state.selectedItemKey,
    currentItemKey: state.currentItemKey,
    isSidebarFocused: state.isSidebarFocused,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    isKeySelected: actions.isKeySelected,
  }));

  useEffect(() => {
    setSidebarData((prev) => {
      const data = { ...prev };
      const psData = data['privacySandbox'];

      psData.children['cookies'].panel = () => (
        <Cookies setFilteredCookies={setFilteredCookies} />
      );
      psData.children['cookies'].children = Object.keys(tabFrames || {})
        .filter((url) => {
          return url === UNKNOWN_FRAME_KEY ? frameHasCookies[url] : true;
        })
        .reduce<SidebarItems>((acc, url) => {
          acc[url] = {
            title: url,
            popupTitle: `Cookies used by frames from ${url}`,
            panel: () => <Cookies setFilteredCookies={setFilteredCookies} />,
            icon: () => <CookieIcon />,
            selectedIcon: () => <CookieIconWhite />,
            children: {},
            isBlurred: !frameHasCookies?.[url],
          };

          return acc;
        }, {});
      psData.children['cookies'].dropdownOpen =
        Object.keys(psData.children['cookies'].children).length > 0;

      const showInspectButton =
        canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

      if (showInspectButton) {
        psData.children['cookies'].extraInterfaceToTitle = () => (
          <InspectButton
            isInspecting={isInspecting}
            setIsInspecting={setIsInspecting}
            isTabFocused={isSidebarFocused && isKeySelected('cookies')}
          />
        );
      } else {
        psData.children['cookies'].extraInterfaceToTitle = () => <></>;
      }

      return data;
    });
  }, [
    canStartInspecting,
    frameHasCookies,
    isInspecting,
    isKeySelected,
    isSidebarFocused,
    setIsInspecting,
    setSidebarData,
    tabFrames,
  ]);

  useEffect(() => {
    if (Object.keys(tabFrames || {}).includes(currentItemKey || '')) {
      setSelectedFrame(currentItemKey);
    } else {
      setSelectedFrame(null);
    }
  }, [currentItemKey, setSelectedFrame, tabFrames]);

  useEffect(() => {
    (async () => {
      const tabId = chrome.devtools.inspectedWindow.tabId.toString();

      const data = await chrome.storage.local.get();

      if (!data?.[tabId]) {
        data[tabId] = {};
      }

      if (!data[tabId]?.['selectedSidebarItem']) {
        data[tabId]['selectedSidebarItem'] = 'cookies';
      }

      data[tabId]['selectedSidebarItem'] = selectedItemKey;

      await chrome.storage.local.set(data);
    })();
  }, [selectedItemKey]);

  const lastUrl = useRef(tabUrl);

  useEffect(() => {
    if (lastUrl.current === tabUrl || lastUrl.current === null) {
      lastUrl.current = tabUrl;
      return;
    }

    lastUrl.current = tabUrl;

    updateSelectedItemKey(selectedFrame || 'cookies');
  }, [selectedFrame, setSelectedFrame, tabUrl, updateSelectedItemKey]);

  const [filteredCookies, setFilteredCookies] = useState<CookieTableData[]>([]);

  const handleUpdate = useCallback(
    (key: string | null) => {
      updateSelectedItemKey(key || 'cookies');
    },
    [updateSelectedItemKey]
  );

  useFrameOverlay(filteredCookies, handleUpdate);

  return (
    <div className="w-full h-full flex flex-row">
      <Resizable
        size={{ width: sidebarWidth, height: '100%' }}
        defaultSize={{ width: '200px', height: '100%' }}
        onResizeStop={(_, __, ___, d) => {
          setSidebarWidth((prevState) => prevState + d.width);
        }}
        minWidth={'150px'}
        maxWidth={'90%'}
        enable={{
          right: true,
        }}
        className="h-full"
      >
        <Sidebar visibleWidth={sidebarWidth} />
      </Resizable>
      <main className="h-full flex-1 overflow-auto">
        <div className="min-w-[40rem] h-full">{activePanel.element?.()}</div>
      </main>
    </div>
  );
};

export default Layout;
