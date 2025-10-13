/*
 * Copyright 2025 Google LLC
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
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import Context, {
  initialState,
  type ScriptBlockingStoreContext,
} from './context';
import { EXTRA_DATA } from '../../../../constants';

export const IMPACTED_BY_SCRIPT_BLOCKING = {
  NONE: 'Not Impacted By Script Blocking',
  PARTIAL: 'Some URLs are Blocked',
  ENTIRE: 'Entire Domain Blocked',
};

const DATA_URL =
  'https://raw.githubusercontent.com/GoogleChrome/ip-protection/refs/heads/main/Masked-Domain-List.md';

const ScriptBlockingProvider = ({ children }: PropsWithChildren) => {
  const [uniqueResponseDomains, setUniqueResponseDomains] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [statistics, setStatistics] = useState<
    ScriptBlockingStoreContext['state']['statistics']
  >(initialState.state.statistics);

  const [initialTableData, setinitialTableData] = useState<
    { domain: string; owner: string; scriptBlocking: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      const lines = text
        .split('\n')
        .filter((line) => line.includes('|'))
        .slice(2);

      const mdlData = lines.map((line) =>
        line.split('|').map((item) => item.trim())
      );

      setinitialTableData(() => {
        const data = mdlData.map((item: string[]) => {
          let owner = item[1];

          if (item[1].includes('PSL Domain')) {
            owner = 'PSL Domain';
          }

          const scriptBlocking = item[2];

          return {
            domain: item[0],
            owner,
            scriptBlocking,
          };
        });

        setIsLoading(false);

        return data;
      });
    })();
  }, []);

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        uniqueResponseDomains?: string[];
        stats: ScriptBlockingStoreContext['state']['statistics'];
        tabId: string;
      };
    }) => {
      if (
        message.type !== EXTRA_DATA ||
        String(message.payload.tabId) !==
          String(chrome.devtools.inspectedWindow.tabId)
      ) {
        return;
      }

      setUniqueResponseDomains((prev) => {
        return isEqual(message.payload.uniqueResponseDomains, prev)
          ? prev
          : message.payload.uniqueResponseDomains || [];
      });

      if (message.payload.stats) {
        setStatistics((prev) => {
          if (isEqual(prev, message.payload.stats)) {
            return prev;
          }
          return message.payload.stats;
        });
      }
    },
    []
  );

  const syncStorageListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      const hasChangesForScriptBlockingData =
        Object.keys(changes).includes('scriptBlocking') &&
        Object.keys(changes.scriptBlocking).includes('newValue');

      if (hasChangesForScriptBlockingData) {
        setStatistics((prev) => {
          return {
            ...prev,
            globalView: {
              ...changes.scriptBlocking.newValue,
            },
          };
        });
      }
    },
    []
  );

  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        !(
          chrome.devtools.inspectedWindow.tabId === tabId &&
          frameType === 'outermost_frame' &&
          frameId === 0
        )
      ) {
        return;
      }
      setUniqueResponseDomains(initialState.state.uniqueResponseDomains);
      setStatistics(initialState.state.statistics);
    },
    []
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.storage.session.onChanged.addListener(syncStorageListener);
    chrome.webNavigation?.onCommitted?.addListener(
      onCommittedNavigationListener
    );

    return () => {
      chrome.webNavigation?.onCommitted?.removeListener(
        onCommittedNavigationListener
      );
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.storage.session.onChanged.removeListener(syncStorageListener);
    };
  }, [
    messagePassingListener,
    onCommittedNavigationListener,
    syncStorageListener,
  ]);

  const value = useMemo(
    () => ({
      state: {
        uniqueResponseDomains,
        statistics,
        scriptBlockingData: initialTableData,
        isLoading,
      },
      actions: {
        setUniqueResponseDomains,
      },
    }),
    [initialTableData, isLoading, statistics, uniqueResponseDomains]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ScriptBlockingProvider;
