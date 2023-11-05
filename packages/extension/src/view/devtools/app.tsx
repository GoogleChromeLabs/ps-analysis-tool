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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Resizable } from 're-resizable';
import {
  ExtensionReloadNotification,
  ProgressBar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import TABS from './tabs';
import { Sidebar } from './components';
import { useCookieStore } from './stateProviders/syncCookieStore';
import './app.css';

const App: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [width, setWidth] = useState<number>(200);
  const contextInvalidatedRef = useRef(null);
  const TabContent = TABS[selectedTabIndex].component;

  const { contextInvalidated, setContextInvalidated, isTableLoading } =
    useCookieStore(({ state, actions }) => ({
      contextInvalidated: state.contextInvalidated,
      isTableLoading: state.isTableLoading,
      setContextInvalidated: actions.setContextInvalidated,
    }));

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
      {isTableLoading && !contextInvalidated && (
        <div className="w-full h-full flex items-center justify-center">
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
        </div>
      )}
      {!contextInvalidated && !isTableLoading && (
        <div className="w-full h-full flex flex-row">
          <Resizable
            size={{ width: width, height: '100%' }}
            defaultSize={{ width: '200px', height: '100%' }}
            onResizeStop={(_, __, ___, d) => {
              setWidth((prevState) => prevState + d.width);
            }}
            minWidth={'200px'}
            maxWidth={'98%'}
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
              width={width}
              selectedIndex={selectedTabIndex}
              setIndex={setSelectedTabIndex}
            />
          </Resizable>
          <main className="h-full flex-1 overflow-auto">
            <div className="min-w-[20rem] h-full">
              <TabContent />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
