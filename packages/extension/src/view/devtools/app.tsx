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

/**
 * Internal dependencies.
 */
import TABS, { collapsedSidebarData } from './tabs';
import './app.css';
import { Layout } from './components';
import useContextInvalidated from './hooks/useContextInvalidated';

const App: React.FC = () => {
  const [sidebarData, setSidebarData] = useState(TABS);
  const contextInvalidatedRef = useRef(null);

  const tabIdRef = useRef(chrome.devtools.inspectedWindow.tabId);

  const contextInvalidated = useContextInvalidated(contextInvalidatedRef);

  const [defaultSelectedItemKey, setDefaultSelectedItemKey] = useState(
    SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX
  );

  const [collapsedState, setCollapsedState] = useState<boolean | null>(null);

  const reloadTexts = useRef({
    displayText: I18n.getMessage('extensionUpdated'),
    buttonText: I18n.getMessage('refreshPanel'),
  });

  useEffect(() => {
    (async () => {
      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (!tabId) {
        return;
      }

      const data = await chrome.storage.session.get();
      const syncData = await chrome.storage.sync.get();

      if (data?.['selectedSidebarItem#' + tabId]) {
        setDefaultSelectedItemKey(data['selectedSidebarItem#' + tabId]);
      } else if (syncData?.psLandingPageViewed) {
        setDefaultSelectedItemKey(SIDEBAR_ITEMS_KEYS.DASHBOARD);
      }

      if (data?.['sidebarCollapsedState#' + tabId]) {
        setCollapsedState(
          data?.['sidebarCollapsedState#' + tabId] === 'collapsed'
        );
      } else {
        setCollapsedState(false);
      }

      if (data?.['cookieDropdownOpen#' + tabId]) {
        setSidebarData((prev) => {
          const newSidebarData = { ...prev };
          newSidebarData[SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX].children[
            SIDEBAR_ITEMS_KEYS.COOKIES
          ].dropdownOpen = data['cookieDropdownOpen#' + tabId];
          return newSidebarData;
        });
      }
    })();
  }, []);

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
        {!contextInvalidated ? (
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
