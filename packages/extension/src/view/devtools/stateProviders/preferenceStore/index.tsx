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
import { createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
/**
 * Internal dependencies.
 */
import { useCookieStore } from '../syncCookieStore';
import { noop } from '../../../../utils/noop';
import useContextSelector from '../../../../utils/useContextSelector';
import type { PreferenceDataValues } from '../../../../localStore/types';
import { useFilterManagementStore } from '../filterManagementStore';
import { PreferenceStore } from '../../../../localStore';
import { getCurrentTabId } from '../../../../utils/getCurrentTabId';

export interface PreferenceStore {
  state: {
    [key: string]: unknown;
  };
  actions: {
    updatePreference: (key: string, value: PreferenceDataValues) => void;
  };
}

const initialState: PreferenceStore = {
  state: {},
  actions: {
    updatePreference: noop,
  },
};

export const Context = createContext<PreferenceStore>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [preferences, setPreferences] = useState<PreferenceStore['state']>({});
  const mountedRef = useRef<boolean>(false);

  const updatePreference = useCallback(
    (key: string, value: PreferenceDataValues) => {
      if (preferences) {
        const _updatedPreferences: PreferenceStore['state'] = preferences;
        if (
          _updatedPreferences &&
          Object.keys(_updatedPreferences).length > 0
        ) {
          _updatedPreferences[key] = value;
        } else {
          _updatedPreferences[key] = value;
        }
        setPreferences(_updatedPreferences);
      }
    },
    [preferences]
  );

  const { selectedFilters } = useFilterManagementStore(({ state }) => ({
    selectedFilters: state?.selectedFilters,
  }));

  const { selectedFrame, tabId } = useCookieStore(({ state }) => ({
    selectedFrame: state?.selectedFrame,
    tabId: state?.tabId,
  }));

  const getPreviousPreferences = useCallback(async () => {
    const currentTabId = await getCurrentTabId();
    const previousPreferences = await chrome.storage.local.get(
      currentTabId?.toString()
    );
    return previousPreferences;
  }, []);

  const memoisedPreferences = useMemo(() => {
    return {
      selectedFilters,
      selectedFrame,
      columnSorting: preferences?.columnSorting || {},
      columnSizing: preferences?.columnSizing || {},
      selectedColumns: [],
    };
  }, [
    preferences?.columnSizing,
    preferences?.columnSorting,
    selectedFilters,
    selectedFrame,
  ]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (tabId) {
      if (mountedRef.current) {
        (async () => {
          await PreferenceStore.update(tabId.toString(), memoisedPreferences);
        })();
      } else {
        (async () => {
          const previousPreferences = await getPreviousPreferences();
          setPreferences(previousPreferences);
        })();
      }
    }
  }, [tabId, memoisedPreferences, getPreviousPreferences]);

  const value: PreferenceStore = useMemo(
    () => ({
      state: preferences,
      actions: {
        updatePreference,
      },
    }),
    [updatePreference, preferences]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function usePreferenceStore(): PreferenceStore;
export function usePreferenceStore<T>(
  selector: (state: PreferenceStore) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function usePreferenceStore<T>(
  selector: (state: PreferenceStore) => T | PreferenceStore = (state) => state
) {
  return useContextSelector(Context, selector);
}
