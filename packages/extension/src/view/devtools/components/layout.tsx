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
  type CookieTableData,
  ORPHANED_COOKIE_KEY,
  UNMAPPED_COOKIE_KEY,
} from '@ps-analysis-tool/common';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
  CookieIconWhite,
  CookieIcon,
  InspectButton,
  ToastMessage,
} from '@ps-analysis-tool/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Cookies from './cookies';
import useFrameOverlay from '../hooks/useFrameOverlay';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import { useSettingsStore } from '../stateProviders/syncSettingsStore';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

interface LayoutProps {
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const Layout = ({ setSidebarData }: LayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const mainRef = useRef<HTMLElement>(null);
  const toastMessageRef = useRef<HTMLDivElement>(null);

  const { settingsChanged, handleSettingsChange } = useSettingsStore(
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

  const { Element: PanelElement, props } = activePanel.panel;

  useEffect(() => {
    setSidebarData((prev) => {
      const data = { ...prev };
      const psData = data['privacySandbox'];

      psData.children['cookies'].panel = {
        Element: Cookies,
        props: { setFilteredCookies },
      };
      psData.children['cookies'].children = Object.keys(tabFrames || {})
        .filter((url) => {
          if (url === ORPHANED_COOKIE_KEY) {
            return frameHasCookies[url];
          }

          if (url === UNMAPPED_COOKIE_KEY) {
            return frameHasCookies[url];
          }

          return true;
        })
        .reduce<SidebarItems>((acc, url) => {
          let popupTitle = `Cookies used by frames from ${url}`;
          let infoIconDescription = '';

          if (url === ORPHANED_COOKIE_KEY) {
            popupTitle =
              'Frames that set these cookies were removed from the DOM, leaving these cookies orphaned.';
            infoIconDescription = popupTitle;
          }

          if (url === UNMAPPED_COOKIE_KEY) {
            popupTitle = 'Cookies that could not be mapped to any frame.';
            infoIconDescription = popupTitle;
          }

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
            infoIconDescription,
            children: {},
            isBlurred: !frameHasCookies?.[url],
          };

          return acc;
        }, {});

      const showInspectButton =
        canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

      if (showInspectButton) {
        psData.children['cookies'].extraInterfaceToTitle = {
          Element: InspectButton,
          props: {
            isInspecting,
            setIsInspecting,
            isTabFocused: isSidebarFocused && isKeySelected('cookies'),
          },
        };
      } else {
        psData.children['cookies'].extraInterfaceToTitle = {};
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
        onScroll={() => {
          if (mainRef.current && toastMessageRef.current) {
            toastMessageRef.current.style.bottom =
              '-' + mainRef.current.scrollTop + 'px';
          }
        }}
        className="h-full flex-1 overflow-auto relative"
      >
        <div className="min-w-[40rem] h-full z-1">
          {PanelElement && <PanelElement {...props} />}
        </div>
        {settingsChanged && (
          <ToastMessage
            ref={toastMessageRef}
            additionalStyles="text-sm"
            text="Settings changed, please reload all tabs."
            onClick={handleSettingsChange}
            textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
          />
        )}
      </main>
    </div>
  );
};

export default Layout;
