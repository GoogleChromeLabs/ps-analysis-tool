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
} from 'react';
/**
 * Internal dependencies.
 */
import { useCookieStore } from '../syncCookieStore';
import { noop } from '../../../../utils/noop';
import useContextSelector from '../../../../utils/useContextSelector';
import type {
  PreferenceData,
  PreferenceDataValues,
} from '../../../../localStore/types';
import { useFilterManagementStore } from '../filterManagementStore';
import { PreferenceStore } from '../../../../localStore';

export interface preferenceStore {
  state: null;
  actions: {
    updatePreference: (key: string, value: PreferenceDataValues) => void;
  };
}

const initialState: preferenceStore = {
  state: null,
  actions: {
    updatePreference: noop,
  },
};

export const Context = createContext<preferenceStore>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [preferences, setPreferences] = useState<
    PreferenceData | Record<string, never>
  >({});

  const updatePreference = useCallback(
    (key: string, value: PreferenceDataValues) => {
      const _updatedPreferences = preferences;
      if (_updatedPreferences && Object.keys(_updatedPreferences).length > 0) {
        _updatedPreferences[key] = value;
      } else {
        _updatedPreferences[key] = value;
      }
      setPreferences(_updatedPreferences);
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

  const memoisedPreferences = useMemo(() => {
    return {
      selectedFilters,
      selectedFrame,
      columnSorting: preferences.columnSorting || {},
      columnSizing: preferences.columnSizing || {},
      selectedColumns: [],
    };
  }, [
    preferences.columnSizing,
    preferences.columnSorting,
    selectedFilters,
    selectedFrame,
  ]);

  useEffect(() => {
    if (tabId) {
      (async () => {
        await PreferenceStore.update(tabId.toString(), memoisedPreferences);
      })();
    }
  }, [tabId, memoisedPreferences]);

  const value: preferenceStore = useMemo(
    () => ({
      state: null,
      actions: {
        updatePreference,
      },
    }),
    [updatePreference]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function usePreferenceStore(): preferenceStore;
export function usePreferenceStore<T>(
  selector: (state: preferenceStore) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function usePreferenceStore<T>(
  selector: (state: preferenceStore) => T | preferenceStore = (state) => state
) {
  return useContextSelector(Context, selector);
}
