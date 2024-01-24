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
import { useState, useCallback, useEffect } from 'react';
import { executeTaskInWorker } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import {
  getNetworkResourcesWithContent,
  getResourcesWithContent,
} from '../../utils';
import { sumUpDetectionResults } from '..';
import type { LibraryData, ResourceTreeItem } from '../../types';
import { LIBRARY_DETECTION_WORKER_TASK } from '../../worker/constants';

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

/**
 * The primary custom hook used for Library signature detection purpose
 * @param {number} tabId Tab id.
 * @returns {object} libraryMatches and isCurrentTabLoading
 */
const useLibraryDetection = (tabId: number) => {
  const [libraryMatches, setLibraryMatches] = useState(INITIAL_STATE);
  const [isCurrentTabLoading, setIsCurrentTabLoading] =
    useState<boolean>(false);

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
            const newResult = sumUpDetectionResults(
              libraryMatches,
              realtimeComputationResult
            );

            setLibraryMatches(newResult);
          }
        }
      );
    },
    [libraryMatches]
  );

  const onTabUpdate = useCallback(
    (
      changingTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      const currentTabId = tabId;

      if (tab.active && changingTabId === currentTabId) {
        if (changeInfo.status === 'complete') {
          setIsCurrentTabLoading(false);
          chrome.devtools.inspectedWindow.onResourceAdded.addListener(
            listenerCallback
          );
        } else if (changeInfo.status === 'loading') {
          setLibraryMatches(INITIAL_STATE);
          chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
            listenerCallback
          );
          setIsCurrentTabLoading(true);
        }
      }
    },
    [tabId, listenerCallback, setIsCurrentTabLoading, setLibraryMatches]
  );

  useEffect(() => {
    chrome.tabs.onUpdated.removeListener(onTabUpdate);
    chrome.tabs.onUpdated.addListener(onTabUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdate);
    };
  }, [onTabUpdate]);

  useEffect(() => {
    if (!isCurrentTabLoading) {
      (async () => {
        const scripts = await getNetworkResourcesWithContent();

        executeTaskInWorker(
          LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
          scripts,
          (detectedMatchingSignatures: LibraryData) => {
            setLibraryMatches(detectedMatchingSignatures);
          }
        );
      })();
    }
  }, [isCurrentTabLoading]);

  return {
    libraryMatches,
    isCurrentTabLoading,
  };
};

export default useLibraryDetection;
