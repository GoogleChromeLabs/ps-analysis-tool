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
import { type CookieTableData } from '@ps-analysis-tool/common';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
  CookieIconWhite,
  CookieIcon,
  InspectButton,
  ToastMessage,
  SIDEBAR_ITEMS_KEYS,
} from '@ps-analysis-tool/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Cookies from './cookies';
import useFrameOverlay from '../hooks/useFrameOverlay';
import { useCookie, useSettings } from '../stateProviders';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

interface LayoutProps {
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const Layout = ({ setSidebarData }: LayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const mainRef = useRef<HTMLElement>(null);

  const { settingsChanged, handleSettingsChange } = useSettings(
    ({ state, actions }) => ({
      settingsChanged: state.settingsChanged,
      handleSettingsChange: actions.handleSettingsChange,
    })
  );

  const {
    tabFrames,
    frameHasCookies,
    canStartInspecting,
    tabUrl,
    isInspecting,
    setIsInspecting,
    selectedFrame,
    setSelectedFrame,
  } = useCookie(({ state, actions }) => ({
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

  const { Element: PanelElement, props } = activePanel.panel;

  useEffect(() => {
    setSidebarData((prev) => {
      const data = { ...prev };
      const psData = data[SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX];

      psData.children[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: Cookies,
        props: { setFilteredCookies },
      };
      psData.children[SIDEBAR_ITEMS_KEYS.COOKIES].children = Object.keys(
        tabFrames || {}
      ).reduce<SidebarItems>((acc, url) => {
        const popupTitle = `Cookies used by frames from ${url}`;

        acc[url] = {
          title: url,
          popupTitle,
          panel: {
            Element: Cookies,
            props: { setFilteredCookies },
          },
          icon: {
            Element: CookieIcon,
          },
          selectedIcon: {
            Element: CookieIconWhite,
          },
          children: {},
          isBlurred: !frameHasCookies?.[url],
        };

        return acc;
      }, {});

      const showInspectButton =
        canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

      if (showInspectButton) {
        psData.children[SIDEBAR_ITEMS_KEYS.COOKIES].extraInterfaceToTitle = {
          Element: InspectButton,
          props: {
            isInspecting,
            setIsInspecting,
            isTabFocused:
              isSidebarFocused && isKeySelected(SIDEBAR_ITEMS_KEYS.COOKIES),
          },
        };
      } else {
        psData.children[SIDEBAR_ITEMS_KEYS.COOKIES].extraInterfaceToTitle = {};
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
      const tabId = await getCurrentTabId();

      if (!tabId) {
        return;
      }

      let data = await chrome.storage.session.get();

      if (!data) {
        data = {};
      }

      data['selectedSidebarItem#' + tabId] = selectedItemKey;

      await chrome.storage.session.set(data);
    })();
  }, [selectedItemKey]);

  const lastUrl = useRef(tabUrl);

  useEffect(() => {
    if (lastUrl.current === tabUrl || lastUrl.current === null) {
      lastUrl.current = tabUrl;
      return;
    }

    lastUrl.current = tabUrl;

    updateSelectedItemKey(selectedFrame || SIDEBAR_ITEMS_KEYS.COOKIES);
  }, [selectedFrame, setSelectedFrame, tabUrl, updateSelectedItemKey]);

  const [filteredCookies, setFilteredCookies] = useState<CookieTableData[]>([]);

  const handleUpdate = useCallback(
    (key: string | null) => {
      updateSelectedItemKey(key || SIDEBAR_ITEMS_KEYS.COOKIES);
    },
    [updateSelectedItemKey]
  );

  useFrameOverlay(filteredCookies, handleUpdate);

  return (
    <div className="w-full h-full flex flex-row z-1">
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
      <main
        ref={mainRef}
        className="h-full flex-1 relative overflow-hidden flex flex-col"
      >
        <div
          className="w-full h-full overflow-auto"
          id="cookies-landing-scroll-container"
        >
          <div className="min-w-[40rem] h-full z-1">
            {PanelElement && <PanelElement {...props} />}
          </div>
        </div>
        <div className="h-fit">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text="Settings changed, please reload all tabs."
              onClick={handleSettingsChange}
              textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
