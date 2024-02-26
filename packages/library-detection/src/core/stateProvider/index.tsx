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
  useRef,
} from 'react';
import {
  getDomainFromUrl,
  noop,
  useContextSelector,
  createContext,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { LibraryData } from '../../types';

/**
 * Represents the context for library detection state.
 */
export interface LibraryDetectionContext {
  state: {
    libraryMatches: LibraryData;
    isCurrentTabLoading: boolean;
    loadedBefore: boolean;
    showLoader: boolean;
    tabDomain: string;
  };
  actions: {
    setLibraryMatches: React.Dispatch<React.SetStateAction<LibraryData>>;
    setIsCurrentTabLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLoadedBeforeState: React.Dispatch<React.SetStateAction<boolean>>;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setTabDomain: React.Dispatch<React.SetStateAction<string>>;
  };
}

const INITIAL_STATE: LibraryData = {
  gis: {
    signatureMatches: 0,
    matches: [],
  },
  gsiV2: {
    signatureMatches: 0,
    moduleMatch: 0,
    matches: [],
  },
};

const initialState: LibraryDetectionContext = {
  state: {
    libraryMatches: INITIAL_STATE,
    isCurrentTabLoading: false,
    loadedBefore: false,
    showLoader: true,
    tabDomain: '',
  },
  actions: {
    setLibraryMatches: noop,
    setIsCurrentTabLoading: noop,
    setLoadedBeforeState: noop,
    setShowLoader: noop,
    setTabDomain: noop,
  },
};

export const Context = createContext<LibraryDetectionContext>(initialState);

export const LibraryDetectionProvider = ({ children }: PropsWithChildren) => {
  const [libraryMatches, setLibraryMatches] =
    useState<LibraryData>(INITIAL_STATE);
  const [isCurrentTabLoading, setIsCurrentTabLoading] =
    useState<boolean>(false); // TODO: Use first/current tab loaded state instead.
  const [loadedBefore, setLoadedBeforeState] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [tabDomain, setTabDomain] = useState<string>('');
  const tabId = useRef(-1);

  useEffect(() => {
    tabId.current = chrome.devtools.inspectedWindow.tabId;
    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabDomain(getDomainFromUrl(result));
        }
      }
    );
  }, []);

  // It is attached, next time the tab is updated or reloaded.
  const onTabUpdate = useCallback(
    (
      changingTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (Number(changingTabId) === Number(tabId.current)) {
        if (tab.url) {
          setTabDomain(getDomainFromUrl(tab.url));
        }
        if (changeInfo.status === 'complete') {
          setIsCurrentTabLoading(false);
        } else if (changeInfo.status === 'loading') {
          setLibraryMatches(INITIAL_STATE);
          setIsCurrentTabLoading(true);
          setShowLoader(true);
          setLoadedBeforeState(false);
        }
      }
    },
    [
      setIsCurrentTabLoading,
      setLibraryMatches,
      setShowLoader,
      setLoadedBeforeState,
    ]
  );

  useEffect(() => {
    chrome.tabs.onUpdated.removeListener(onTabUpdate);
    chrome.tabs.onUpdated.addListener(onTabUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdate);
    };
  }, [onTabUpdate]);

  return (
    <Context.Provider
      value={{
        state: {
          libraryMatches,
          isCurrentTabLoading,
          loadedBefore,
          showLoader,
          tabDomain,
        },
        actions: {
          setLibraryMatches,
          setIsCurrentTabLoading,
          setLoadedBeforeState,
          setShowLoader,
          setTabDomain,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useLibraryDetectionContext(): LibraryDetectionContext;
export function useLibraryDetectionContext<T>(
  selector: (state: LibraryDetectionContext) => T
): T;

/**
 * Library detection hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useLibraryDetectionContext<T>(
  selector: (state: LibraryDetectionContext) => T | LibraryDetectionContext = (
    state
  ) => state
) {
  return useContextSelector(Context, selector);
}
