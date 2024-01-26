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
import { executeTaskInWorker } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import {
  getNetworkResourcesWithContent,
  getResourcesWithContent,
} from '../../utils';
import { sumUpDetectionResults, useLibraryDetectionContext } from '..';
import type { LibraryData, ResourceTreeItem } from '../../types';
import { LIBRARY_DETECTION_WORKER_TASK } from '../../worker/constants';

const LOADING_DELAY = 4000;

/**
 * The primary custom hook used for Library signature detection purpose
 * @param {number} tabId Tab id.
 */
const useLibraryDetection = () => {
  const {
    isCurrentTabLoading,
    loadedBefore,
    showLoader,
    setLibraryMatches,
    setLoadedBeforeState,
    setShowLoader,
  } = useLibraryDetectionContext(({ state, actions }) => ({
    isCurrentTabLoading: state.isCurrentTabLoading,
    loadedBefore: state.loadedBefore,
    showLoader: state.showLoader,
    setLoadedBeforeState: actions.setLoadedBeforeState,
    setLibraryMatches: actions.setLibraryMatches,
    setShowLoader: actions.setShowLoader,
  }));

  const timeout = useRef(0);

  /**
   * This function is called whenever a new resource is added.
   * @param {any} async(resource:chrome.devtools.inspectedWindow.Resource
   * @returns {any}
   */
  const listenerCallback = useCallback(
    async (resource: ResourceTreeItem) => {
      const resourcesWithContent = await getResourcesWithContent([resource]);

      if (resourcesWithContent.length === 0) {
        return;
      }

      executeTaskInWorker(
        LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
        resourcesWithContent,
        (realtimeComputationResult: LibraryData) => {
          if (
            realtimeComputationResult.gis.matches.length !== 0 ||
            realtimeComputationResult.gsiV2.matches.length !== 0
          ) {
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
    const scripts = await getNetworkResourcesWithContent();

    executeTaskInWorker(
      LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
      scripts,
      (detectedMatchingSignatures: LibraryData) => {
        setLibraryMatches(detectedMatchingSignatures);
        attachListener();
        setShowLoader(false);
      }
    );
  }, [setLibraryMatches, attachListener, setShowLoader]);

  useEffect(() => {
    if (showLoader) {
      removeListener();
    }
  }, [showLoader, removeListener]);

  // Get the initial data and listen to new resources.
  useEffect(() => {
    // Only show loader if the page has not loaded yet.
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

      return;
    }

    // When the user revisits the landing page we do not need to show loader.
    updateInitialData();
  }, [
    isCurrentTabLoading,
    loadedBefore,
    setLoadedBeforeState,
    updateInitialData,
  ]);

  useEffect(() => {
    return () => {
      removeListener();

      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = 0;
      }
    };
  }, [removeListener]);
};

export default useLibraryDetection;
