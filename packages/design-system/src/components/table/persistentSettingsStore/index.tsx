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
 * External dependencies
 */
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PQueue from 'p-queue';
import { useContextSelector, createContext } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { PersistentStorageData } from '../useTable';
import { extractStorage, updateStorage } from './utils';

export const TABLE_PERSISTENT_SETTINGS_STORE_KEY =
  'tablePersistentSettingsStore';

export interface TablePersistentSettingsStoreContext {
  state: {
    [persistenceKey: string]: PersistentStorageData;
  };
  actions: {
    setPreferences: (
      options: PersistentStorageData,
      persistenceKey: string
    ) => Promise<void>;
    getPreferences: (
      persistentkey: string,
      type: keyof PersistentStorageData
    ) => PersistentStorageData[keyof PersistentStorageData];
  };
}

const initialState: TablePersistentSettingsStoreContext = {
  state: {},
  actions: {
    setPreferences: () => Promise.resolve(),
    getPreferences: () => ({}),
  },
};

export const Context =
  createContext<TablePersistentSettingsStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const PROMISE_QUEUE = useMemo(() => new PQueue({ concurrency: 1 }), []);

  const isChromeExtension = useMemo(() => {
    return window.location.protocol === 'chrome-extension:';
  }, []);

  const preferences = useRef<TablePersistentSettingsStoreContext['state']>(
    initialState.state
  );

  useEffect(() => {
    (async () => {
      await PROMISE_QUEUE.add(async () => {
        const _preferences = await extractStorage(
          TABLE_PERSISTENT_SETTINGS_STORE_KEY,
          isChromeExtension
        );

        preferences.current = _preferences;
      });
    })();
  }, [PROMISE_QUEUE, isChromeExtension]);

  const getPreferences = useCallback(
    (persistentkey: string, type: keyof PersistentStorageData) => {
      return preferences.current?.[persistentkey]?.[type];
    },
    []
  );

  const setPreferences = useCallback(
    async (options: PersistentStorageData, persistenceKey: string) => {
      await PROMISE_QUEUE.add(async () => {
        const updatedData = await updateStorage(
          persistenceKey,
          isChromeExtension,
          options
        );

        preferences.current = updatedData;
      });
    },
    [PROMISE_QUEUE, isChromeExtension]
  );

  return (
    <Context.Provider
      value={{
        state: preferences.current,
        actions: {
          getPreferences,
          setPreferences,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useTablePersistentSettingsStore(): TablePersistentSettingsStoreContext;
export function useTablePersistentSettingsStore<T>(
  selector: (state: TablePersistentSettingsStoreContext) => T
): T;

/**
 * Table Persistent Settings store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useTablePersistentSettingsStore<T>(
  selector: (
    state: TablePersistentSettingsStoreContext
  ) => T | TablePersistentSettingsStoreContext = (state) => state
) {
  return useContextSelector(Context, selector);
}
