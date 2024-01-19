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

/**
 * Internal dependencies.
 */
import {
  getNetworkResourcesWithContent,
  getResourcesWithContent,
} from '../../utils';
import { detectMatchingSignatures, sumUpDetectionResults } from '..';
import type { LibraryData, ResourceTreeItem } from '../../types';

/**
 * The primary custom hook used for Library signature detection purpose
 *
 */
const useLibraryDetection = () => {
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

  /**
   * This function is called whenever a new resource is added.
   * @param {any} async(resource:chrome.devtools.inspectedWindow.Resource
   * @returns {any}
   */
  const listenerCallback = useCallback(
    async (resource: ResourceTreeItem) => {
      const realtimeComputationResult = detectMatchingSignatures(
        await getResourcesWithContent([resource])
      );

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
    },
    [libraryMatches]
  );

  /**
   * This function invokes the getResource method internal and invokes the processing on the data return from getResource
   * @param {any}
   * @returns {any}
   */
  const oneTimeComputation = useCallback(async () => {
    const scripts = await getNetworkResourcesWithContent();
    setLibraryMatches(detectMatchingSignatures(scripts));
  }, [libraryMatches]);

  const tabOnUpdatedHandler = useCallback(
    (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
        listenerCallback
      );
      if (changeInfo.status === 'complete' && tab.active) {
        // Check for fully loaded and active tab
        oneTimeComputation();
        chrome.devtools.inspectedWindow.onResourceAdded.addListener(
          listenerCallback
        );
      }
    },
    [listenerCallback]
  );

  useEffect(() => {
    oneTimeComputation();
    chrome.tabs.onUpdated.addListener(tabOnUpdatedHandler);

    return () => {
      chrome.tabs.onUpdated.removeListener(tabOnUpdatedHandler);
    };
  }, []);

  const invokeGSIdetection = useCallback(() => {
    chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
      listenerCallback
    );

    chrome.devtools.inspectedWindow.onResourceAdded.addListener(
      listenerCallback
    );
  }, [listenerCallback]);

  useEffect(() => {
    invokeGSIdetection();
  }, [invokeGSIdetection]);

  return {
    libraryMatches,
  };
};

export default useLibraryDetection;
