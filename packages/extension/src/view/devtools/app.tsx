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
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Resizable } from 're-resizable';
import {
  CookieIcon,
  CookieIconWhite,
  ExtensionReloadNotification,
  Sidebar,
  useSidebar,
  type SidebarItems,
  InspectButton,
} from '@ps-analysis-tool/design-system';
import {
  UNKNOWN_FRAME_KEY,
  type CookieTableData,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import TABS from './tabs';
import { useCookieStore } from './stateProviders/syncCookieStore';
import './app.css';
import { Cookies } from './components';
import useFrameOverlay from './hooks/useFrameOverlay';
import { getCurrentTabId } from '../../utils/getCurrentTabId';
import { useSettingsStore } from './stateProviders/syncSettingsStore';

const App: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [sidebarData, setSidebarData] = useState(TABS);
  const contextInvalidatedRef = useRef(null);

  const {
    contextInvalidated,
    setContextInvalidated,
    tabFrames,
    selectedFrame,
    setSelectedFrame,
    isInspecting,
    setIsInspecting,
    canStartInspecting,
    tabUrl,
    frameHasCookies,
    serviceWorkerInactive,
    sendRefreshExtensionAndPage,
  } = useCookieStore(({ state, actions }) => ({
    contextInvalidated: state.contextInvalidated,
    serviceWorkerInactive: state.serviceWorkerInactive,
    setContextInvalidated: actions.setContextInvalidated,
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    selectedFrame: state.selectedFrame,
    setSelectedFrame: actions.setSelectedFrame,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
    canStartInspecting: state.canStartInspecting,
    tabUrl: state.tabUrl,
    frameHasCookies: state.frameHasCookies,
    sendRefreshExtensionAndPage: actions.sendRefreshExtensionAndPage,
  }));

  const { allowedNumberOfTabs } = useSettingsStore(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  const listenToMouseChange = useCallback(() => {
    if (contextInvalidatedRef.current) {
      if (!chrome.runtime?.id) {
        setContextInvalidated(true);
        localStorage.setItem('contextInvalidated', 'true');
      }
    }
  }, [setContextInvalidated]);

  useEffect(() => {
    window.addEventListener('mouseover', listenToMouseChange);

    return () => {
      window.removeEventListener('mouseover', listenToMouseChange);
    };
  }, [listenToMouseChange]);

  const [defaultSelectedItemKey, setDefaultSelectedItemKey] =
    useState('privacySandbox');

  useEffect(() => {
    (async () => {
      const tabId = chrome.devtools.inspectedWindow.tabId.toString();

      const data = await chrome.storage.local.get();

      if (data?.[tabId]?.['selectedSidebarItem']) {
        setDefaultSelectedItemKey(data[tabId]['selectedSidebarItem']);
      }
    })();
  }, []);

  const {
    activePanel,
    selectedItemKey,
    currentItemKey,
    sidebarItems,
    isSidebarFocused,
    setIsSidebarFocused,
    updateSelectedItemKey,
    onKeyNavigation,
    toggleDropdown,
    isKeyAncestor,
    isKeySelected,
  } = useSidebar({
    data: sidebarData,
    defaultSelectedItemKey,
  });

  useEffect(() => {
    setSidebarData((prev) => {
      const data = { ...prev };
      const psData = data['privacySandbox'];

      psData.children['cookies'].panel = (
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
            panel: <Cookies setFilteredCookies={setFilteredCookies} />,
            icon: <CookieIcon />,
            selectedIcon: <CookieIconWhite />,
            children: {},
            isBlurred: !frameHasCookies?.[url],
          };

          return acc;
        }, {});

      const showInspectButton =
        canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

      if (showInspectButton) {
        psData.children['cookies'].extraInterfaceToTitle = (
          <InspectButton
            isInspecting={isInspecting}
            setIsInspecting={setIsInspecting}
            isTabFocused={isSidebarFocused && isKeySelected('cookies')}
          />
        );
      } else {
        psData.children['cookies'].extraInterfaceToTitle = null;
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
  }, [selectedFrame, tabUrl, updateSelectedItemKey]);

  const [filteredCookies, setFilteredCookies] = useState<CookieTableData[]>([]);

  const handleUpdate = useCallback(
    (key: string | null) => {
      updateSelectedItemKey(key || 'cookies');
    },
    [updateSelectedItemKey]
  );

  useEffect(() => {
    (async () => {
      const localStorageFlag = localStorage.getItem('contextInvalidated');

      if (
        localStorageFlag &&
        localStorageFlag === 'true' &&
        allowedNumberOfTabs === 'unlimited'
      ) {
        const tabId = await getCurrentTabId();

        if (tabId) {
          chrome.tabs.reload(Number(tabId));
          localStorage.removeItem('contextInvalidated');
        }
      }
    })();
  }, [allowedNumberOfTabs]);

  useFrameOverlay(filteredCookies, handleUpdate);

  return (
    <div
      className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black"
      ref={contextInvalidatedRef}
    >
      {contextInvalidated && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ExtensionReloadNotification
            text="Looks like extension has been updated since devtool was open."
            onClick={() => window.location.reload()}
          />
        </div>
      )}
      {serviceWorkerInactive && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ExtensionReloadNotification
            text="Looks like the service worker was put to sleep. Please click on refresh to activate the service worker."
            onClick={sendRefreshExtensionAndPage}
          />
        </div>
      )}
      {!contextInvalidated && (
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
            <Sidebar
              selectedItemKey={selectedItemKey}
              sidebarItems={sidebarItems}
              isSidebarFocused={isSidebarFocused}
              setIsSidebarFocused={setIsSidebarFocused}
              updateSelectedItemKey={updateSelectedItemKey}
              onKeyNavigation={onKeyNavigation}
              toggleDropdown={toggleDropdown}
              isKeyAncestor={isKeyAncestor}
              isKeySelected={isKeySelected}
              visibleWidth={sidebarWidth}
            />
          </Resizable>
          <main className="h-full flex-1 overflow-auto">
            <div className="min-w-[40rem] h-full">{activePanel}</div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
