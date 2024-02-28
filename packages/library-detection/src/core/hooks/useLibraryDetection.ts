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
import { useCallback, useEffect, useRef } from 'react';
import {
  executeTaskInDevToolWorker,
  LIBRARY_DETECTION_WORKER_TASK,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import {
  getNetworkResourcesWithContent,
  getResourcesWithContent,
} from '../../utils';
import { sumUpDetectionResults, useLibraryDetectionContext } from '..';
import type { LibraryData, ResourceTreeItem } from '../../types';
import LIBRARIES from '../../config';

// The delay after the page load, because some scripts arrive right after the page load.
const LOADING_DELAY = 2000;

/**
 * Custom hook that handles the library detection logic.
 */
const useLibraryDetection = () => {
  const {
    isCurrentTabLoading,
    loadedBefore,
    showLoader,
    setLibraryMatches,
    setLoadedBeforeState,
    setShowLoader,
    tabId,
  } = useLibraryDetectionContext(({ state, actions }) => ({
    isCurrentTabLoading: state.isCurrentTabLoading,
    loadedBefore: state.loadedBefore,
    showLoader: state.showLoader,
    setLoadedBeforeState: actions.setLoadedBeforeState,
    setLibraryMatches: actions.setLibraryMatches,
    setShowLoader: actions.setShowLoader,
    tabId: state.tabId,
  }));

  const timeout = useRef(0);
  const initialDataUpdated = useRef(false);

  /**
   * Callback function used as a listener for resource changes.
   * It detects library matches in the updated resources and updates the library matches state accordingly.
   * @param resource - The updated resource for which library detection needs to be performed.
   */
  const listenerCallback = useCallback(
    async (resource: ResourceTreeItem) => {
      const resourcesWithContent = await getResourcesWithContent([resource]);

      if (resourcesWithContent.length === 0) {
        return;
      }

      executeTaskInDevToolWorker(
        LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
        resourcesWithContent,
        (realtimeComputationResult: LibraryData) => {
          const hasResults = Object.entries(realtimeComputationResult).find(
            ([, result]) => result?.matches?.length
          );

          if (hasResults) {
            setLibraryMatches((matches) => {
              return sumUpDetectionResults(matches, realtimeComputationResult);
            });
          }
        }
      );
    },
    [setLibraryMatches]
  );

  const removeListener = useCallback(() => {
    chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
      listenerCallback
    );
  }, [listenerCallback]);

  const attachListener = useCallback(() => {
    removeListener();
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(
      listenerCallback
    );
  }, [listenerCallback, removeListener]);

  const updateInitialData = useCallback(async () => {
    if (initialDataUpdated.current) {
      return;
    }

    initialDataUpdated.current = true;

    //  chrome.devtools.inspectedWindow.getResources updates whenever new items are added.
    const scripts = await getNetworkResourcesWithContent();

    LIBRARIES.forEach(async ({ name, domQueryFunction }) => {
      if (domQueryFunction) {
        const queryResult = await chrome.scripting.executeScript({
          target: { tabId: tabId, allFrames: false },
          func: domQueryFunction,
        });

        setLibraryMatches((matches) => {
          matches[name] = { matches: queryResult[0]?.result };
          return matches;
        });
      }
    });

    executeTaskInDevToolWorker(
      LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
      scripts,
      (detectedMatchingSignatures: LibraryData) => {
        setLibraryMatches(detectedMatchingSignatures);
        attachListener();
        setShowLoader(false);
      }
    );
  }, [setLibraryMatches, attachListener, setShowLoader, tabId]);

  useEffect(() => {
    if (showLoader) {
      removeListener();
    }
  }, [showLoader, removeListener]);

  // Get the initial data and listen to new resources.
  useEffect(() => {
    // Show loader while page is loading.
    if (isCurrentTabLoading) {
      return;
    }

    // If the user visits the landing page for the first time,
    // Or after the tab has updated (reloaded or changed) show loader for few seconds.
    if (!loadedBefore) {
      // Since this useEffect has multiple depedency, it may be called multiple times.
      // We want to ensure that we show the loader only once.
      if (!timeout.current) {
        timeout.current = setTimeout(() => {
          updateInitialData();
          setLoadedBeforeState(true);
          timeout.current = 0;
        }, LOADING_DELAY);
      }
    } else {
      // When the user revisits the landing page we do not need to show loader.
      updateInitialData();
    }
  }, [
    isCurrentTabLoading,
    loadedBefore,
    setLoadedBeforeState,
    updateInitialData,
  ]);

  // CLeanup on component unmount.
  useEffect(() => {
    return () => {
      removeListener();

      initialDataUpdated.current = false;

      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = 0;
      }
    };
  }, [removeListener]);
};

export default useLibraryDetection;
