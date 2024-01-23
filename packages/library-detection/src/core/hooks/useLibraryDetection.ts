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
import type {
  LibraryData,
  ResourceTreeItem,
  TabLoadingStatus,
} from '../../types';
import { LIBRARY_DETECTION_WORKER_TASK } from '../../worker/constants';

/**
 * The primary custom hook used for Library signature detection purpose
 * @param tabId
 */
const useLibraryDetection = (tabId: number) => {
  const initialState: LibraryData = {
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

  const [libraryMatches, setLibraryMatches] = useState(initialState);
  const [currentTabLoadingStatus, setCurrentTabLoadingStatus] =
    useState<TabLoadingStatus>('complete');

  const [libraryCount, setLibraryCount] = useState(0);

  const onTabUpdate = useCallback(
    (
      changingTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      const currentTabId = tabId;

      if (tab.active && changingTabId === currentTabId) {
        if (changeInfo.status === 'complete') {
          setLibraryCount(0);
          setCurrentTabLoadingStatus('complete');
        } else if (changeInfo.status === 'loading') {
          setCurrentTabLoadingStatus('loading');
        }
      }
    },
    [tabId]
  );

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(onTabUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdate);
    };
  }, [onTabUpdate]);

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

  useEffect(() => {
    if (currentTabLoadingStatus === 'complete') {
      (async () => {
        const scripts = await getNetworkResourcesWithContent();

        executeTaskInWorker(
          LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING,
          scripts,
          (detectedMatchingSignatures: LibraryData) => {
            setLibraryMatches(detectedMatchingSignatures);
            chrome.devtools.inspectedWindow.onResourceAdded.addListener(
              listenerCallback
            );
          }
        );
      })();
    } else {
      chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
        listenerCallback
      );
      setLibraryMatches(initialState);
    }
  }, [currentTabLoadingStatus]);

  return {
    libraryMatches,
    libraryCount,
    setLibraryCount,
    currentTabLoadingStatus,
  };
};

export default useLibraryDetection;
