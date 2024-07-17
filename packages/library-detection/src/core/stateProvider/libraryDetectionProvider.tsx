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
import React, {
  type PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from 'react';

/**
 * Internal dependencies.
 */
import type { LibraryData } from '../../types';
import Context, { initialLibraryMatches } from './context';

const LibraryDetectionProvider = ({ children }: PropsWithChildren) => {
  const [libraryMatches, setLibraryMatches] = useState<LibraryData>(
    initialLibraryMatches
  );

  const [isCurrentTabLoading, setIsCurrentTabLoading] =
    useState<boolean>(false); // TODO: Use first/current tab loaded state instead.
  const [isInitialDataUpdated, setIsInitialDataUpdated] = useState(false);
  const [loadedBefore, setLoadedBeforeState] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [tabId, setTabId] = useState(-1);

  useEffect(() => {
    setTabId(chrome.devtools.inspectedWindow.tabId);
    chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, (tab) => {
      if (tab.status) {
        setIsCurrentTabLoading(tab.status === 'loading');
      }
    });
  }, []);

  const onErrorOccuredListener = useCallback(
    ({
      frameId,
      error,
      tabId: _tabId,
    }: chrome.webNavigation.WebNavigationFramedErrorCallbackDetails) => {
      if (
        frameId === 0 &&
        _tabId === chrome.devtools.inspectedWindow.tabId &&
        error !== 'net::ERR_ABORTED'
      ) {
        setErrorOccured(true);
      }
    },
    []
  );

  const onCommittedListener = useCallback(
    ({
      frameId,
      frameType,
      tabId: changingTabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (frameId === 0 && frameType === 'outermost_frame') {
        if (Number(changingTabId) === Number(tabId)) {
          setIsCurrentTabLoading(false);
        }
      }
    },
    [tabId]
  );

  const onNavigatedListener = useCallback(
    ({
      frameId,
      tabId: _tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (frameId === 0 && Number(tabId) === Number(_tabId)) {
        setLibraryMatches(initialLibraryMatches);
        setIsCurrentTabLoading(true);
        setShowLoader(true);
        setLoadedBeforeState(false);
        setIsInitialDataUpdated(false);
      }
    },
    [tabId]
  );

  const onCompleted = useCallback(
    ({ frameId }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (frameId === 0) {
        setErrorOccured(false);
      }
    },
    []
  );

  useEffect(() => {
    chrome.webNavigation.onCommitted.addListener(onCommittedListener);
    chrome.webNavigation.onErrorOccurred.addListener(onErrorOccuredListener);
    chrome.webNavigation.onBeforeNavigate.addListener(onNavigatedListener);
    chrome.webNavigation.onCompleted.addListener(onCompleted);

    return () => {
      chrome.webNavigation.onCommitted.removeListener(onCommittedListener);
      chrome.webNavigation.onBeforeNavigate.removeListener(onNavigatedListener);
      chrome.webNavigation.onCompleted.removeListener(onCompleted);
    };
  }, [
    onErrorOccuredListener,
    onNavigatedListener,
    onCompleted,
    onCommittedListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: {
          libraryMatches,
          isCurrentTabLoading,
          isInitialDataUpdated,
          loadedBefore,
          showLoader,
          tabId,
          errorOccured,
        },
        actions: {
          setLibraryMatches,
          setIsCurrentTabLoading,
          setIsInitialDataUpdated,
          setLoadedBeforeState,
          setShowLoader,
          setErrorOccured,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default LibraryDetectionProvider;
