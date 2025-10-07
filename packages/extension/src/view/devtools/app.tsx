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
import React, { useRef, useEffect, useState } from 'react';
import {
  ExtensionReloadNotification,
  SIDEBAR_ITEMS_KEYS,
  SidebarProvider,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { getSessionStorage } from '@google-psat/common';
import 'github-markdown-css/github-markdown.css';
import '@google-psat/design-system/theme.css';
/**
 * Internal dependencies.
 */
import TABS, { collapsedSidebarData } from './tabs';
import './app.css';
import { Layout } from './pages';
import useContextInvalidated from './hooks/useContextInvalidated';
import {
  useProbabilisticRevealTokens,
  useScriptBlocking,
} from './stateProviders';
import { UPDATE_PRT } from '../../constants';

const setThemeMode = (isDarkMode: boolean) => {
  if (isDarkMode) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
};

// set initial theme mode based on devtools theme
const theme = chrome.devtools.panels.themeName;
setThemeMode(theme === 'dark');

const App: React.FC = () => {
  const [sidebarData, setSidebarData] = useState(TABS);
  const contextInvalidatedRef = useRef(null);

  const tabIdRef = useRef(chrome.devtools.inspectedWindow.tabId);

  const contextInvalidated = useContextInvalidated(contextInvalidatedRef);

  const [defaultSelectedItemKey, setDefaultSelectedItemKey] = useState(
    SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX
  );

  const [collapsedState, setCollapsedState] = useState<boolean | null>(null);

  const { perTokenMetadata } = useProbabilisticRevealTokens(({ state }) => ({
    perTokenMetadata: state.perTokenMetadata,
  }));

  const { scriptBlockingStatistics } = useScriptBlocking(({ state }) => ({
    scriptBlockingStatistics: state.statistics,
  }));

  const isChromeRuntimeAvailable = Boolean(chrome.runtime?.onMessage);

  const reloadTexts = useRef({
    displayText: isChromeRuntimeAvailable
      ? I18n.getMessage('extensionUpdated')
      : 'Something went wrong.',
    buttonText: I18n.getMessage('refreshPanel'),
  });

  // update theme mode when the browser theme changes
  useEffect(() => {
    const onColorSchemeChange = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery) {
      mediaQuery.addEventListener('change', onColorSchemeChange);
    }

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', onColorSchemeChange);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!chrome.devtools.inspectedWindow.tabId) {
        return;
      }

      const data = await getSessionStorage('persistentSetting');

      if (data?.selectedSidebarItem) {
        setDefaultSelectedItemKey(data?.selectedSidebarItem);
      }

      if (data?.sidebarCollapsedState) {
        setCollapsedState(data?.sidebarCollapsedState === true);
      } else {
        setCollapsedState(false);
      }

      if (data?.cookieDropdownOpen) {
        setSidebarData((prev) => {
          const newSidebarData = { ...prev };
          newSidebarData[SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX].children[
            SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES
          ].children[SIDEBAR_ITEMS_KEYS.COOKIES].dropdownOpen =
            data?.cookieDropdownOpen;
          return newSidebarData;
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (
      scriptBlockingStatistics.localView.domains !== perTokenMetadata.length
    ) {
      chrome.devtools.network.getHAR((harLog) => {
        if (!harLog) {
          return;
        }
        chrome.runtime.sendMessage({
          type: UPDATE_PRT,
          payload: {
            tabId: chrome.devtools.inspectedWindow.tabId,
            harLog,
          },
        });
      });
    }
  }, [scriptBlockingStatistics, perTokenMetadata]);

  if (collapsedState === null) {
    return null;
  }

  return (
    <SidebarProvider
      data={sidebarData}
      defaultSelectedItemKey={defaultSelectedItemKey}
      collapsedData={collapsedSidebarData}
      collapsedState={collapsedState}
    >
      <div
        className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black"
        ref={contextInvalidatedRef}
      >
        {!contextInvalidated && isChromeRuntimeAvailable ? (
          <Layout setSidebarData={setSidebarData} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <ExtensionReloadNotification
              tabId={tabIdRef.current}
              texts={reloadTexts.current}
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default App;
