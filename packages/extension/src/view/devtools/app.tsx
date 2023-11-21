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
import React, { useRef, useEffect, useCallback } from 'react';
import { Resizable } from 're-resizable';
import {
  ExtensionReloadNotification,
  Sidebar,
  useSidebar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import TABS from './tabs';
import { useCookieStore } from './stateProviders/syncCookieStore';
import './app.css';

const App: React.FC = () => {
  const contextInvalidatedRef = useRef(null);

  const { contextInvalidated, setContextInvalidated } = useCookieStore(
    ({ state, actions }) => ({
      contextInvalidated: state.contextInvalidated,
      setContextInvalidated: actions.setContextInvalidated,
    })
  );

  const listenToMouseChange = useCallback(() => {
    if (contextInvalidatedRef.current) {
      if (!chrome.runtime?.id) {
        setContextInvalidated(true);
      }
    }
  }, [setContextInvalidated]);

  useEffect(() => {
    window.addEventListener('mouseover', listenToMouseChange);

    return () => {
      window.removeEventListener('mouseover', listenToMouseChange);
    };
  }, [listenToMouseChange]);

  const {
    activePanel,
    selectedItemKey,
    sidebarItems,
    updateSelectedItemKey,
    onKeyNavigation,
    toggleDropdown,
    isKeyAncestor,
    isKeySelected,
  } = useSidebar({
    data: TABS,
  });

  useEffect(() => {
    if (selectedItemKey === null) {
      updateSelectedItemKey('privacySandbox');
    }
  }, [selectedItemKey, updateSelectedItemKey]);

  return (
    <div
      className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black"
      ref={contextInvalidatedRef}
    >
      {contextInvalidated && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ExtensionReloadNotification />
        </div>
      )}
      {!contextInvalidated && (
        <div className="w-full h-full flex flex-row">
          <Resizable
            size={{ width: 200, height: '100%' }}
            minWidth={'150px'}
            maxWidth={'90%'}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            className="h-full flex flex-col border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz"
          >
            <Sidebar
              selectedItemKey={selectedItemKey}
              sidebarItems={sidebarItems}
              updateSelectedItemKey={updateSelectedItemKey}
              onKeyNavigation={onKeyNavigation}
              toggleDropdown={toggleDropdown}
              isKeyAncestor={isKeyAncestor}
              isKeySelected={isKeySelected}
            />
          </Resizable>
          <main className="h-full flex-1 overflow-auto">
            <div className="min-w-[20rem] h-full">{activePanel}</div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
