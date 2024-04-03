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
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import TABS from './tabs';
import './app.css';
import { Layout } from './components';
import { getCurrentTabId } from '../../utils/getCurrentTabId';
import useContextInvalidated from './hooks/useContextInvalidated';

const App: React.FC = () => {
  const [sidebarData, setSidebarData] = useState(TABS);
  const contextInvalidatedRef = useRef(null);

  const contextInvalidated = useContextInvalidated(contextInvalidatedRef);

  const [defaultSelectedItemKey, setDefaultSelectedItemKey] = useState(
    SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX
  );

  useEffect(() => {
    (async () => {
      const tabId = await getCurrentTabId();

      if (!tabId) {
        return;
      }

      const data = await chrome.storage.session.get();

      if (data?.['selectedSidebarItem#' + tabId]) {
        setDefaultSelectedItemKey(data['selectedSidebarItem#' + tabId]);
      }
    })();
  }, []);

  return (
    <SidebarProvider
      data={sidebarData}
      defaultSelectedItemKey={defaultSelectedItemKey}
    >
      <div
        className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black"
        ref={contextInvalidatedRef}
      >
        {!contextInvalidated ? (
          <Layout setSidebarData={setSidebarData} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <ExtensionReloadNotification />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default App;
