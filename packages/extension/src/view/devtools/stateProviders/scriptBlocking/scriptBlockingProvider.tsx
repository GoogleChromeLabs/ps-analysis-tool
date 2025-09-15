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

const ScriptBlockingProvider = ({ children }: PropsWithChildren) => {
  const [uniqueResponseDomains, setUniqueResponseDomains] = useState<string[]>(
    []
  );

  const [statistics, setStatistics] = useState<
    ScriptBlockingStoreContext['state']['statistics']
  >(initialState.state.statistics);

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

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.storage.sync.onChanged.addListener(syncStorageListener);

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.storage.sync.onChanged.removeListener(syncStorageListener);
    };
  }, [messagePassingListener, syncStorageListener]);

  return (
    <Context.Provider
      value={{
        state: {
          uniqueResponseDomains,
          statistics,
        },
        actions: {
          setUniqueResponseDomains,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ScriptBlockingProvider;
