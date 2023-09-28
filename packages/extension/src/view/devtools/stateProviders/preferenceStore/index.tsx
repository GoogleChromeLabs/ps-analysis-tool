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
import { noop } from '@cookie-analysis-tool/design-system';
import type {
  PreferenceDataValues,
  SelectedFilters,
} from '@cookie-analysis-tool/common';
/**
 * Internal dependencies.
 */
import { useCookieStore } from '../syncCookieStore';
import useContextSelector from '../../../../utils/useContextSelector';
import { useFilterManagementStore } from '../filterManagementStore';
import { PreferenceStore } from '../../../../localStore';
import { getCurrentTabId } from '../../../../utils/getCurrentTabId';

export interface PreferenceStore {
  state: {
    [key: string]: unknown;
  };
  actions: {
    updatePreference: (
      key: string,
      updater: (
        prevStatePreferences: PreferenceStore['state']
      ) => PreferenceDataValues
    ) => void;
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
  const fetchedInitialValueRef = useRef<boolean>(false);
  const updatePreference = useCallback(
    (
      key: string,
      updater: (
        prevStatePreferences: PreferenceStore['state']
      ) => PreferenceDataValues
    ) => {
      setPreferences((prevStatePreferences) => {
        return {
          ...prevStatePreferences,
          [key]: updater(prevStatePreferences),
        };
      });
    },
    []
  );

  const { selectedFrameFilters, setSelectedFrameFilters } =
    useFilterManagementStore(({ state, actions }) => ({
      selectedFrameFilters: state?.selectedFrameFilters,
      setSelectedFrameFilters: actions?.setSelectedFrameFilters,
    }));

  const { selectedFrame, setSelectedFrame } = useCookieStore(
    ({ state, actions }) => ({
      selectedFrame: state?.selectedFrame,
      setSelectedFrame: actions?.setSelectedFrame,
      tabFrames: state.tabFrames,
    })
  );

  const getPreviousPreferences = useCallback(async () => {
    const currentTabId = await getCurrentTabId();
    const storedTabData = await chrome.storage.local.get(
      currentTabId?.toString()
    );
    return Promise.resolve(storedTabData.preferences);
  }, []);

  const memoisedPreferences = useMemo(() => {
    const processedFilters: {
      [frameKey: string]: { [key: string]: Array<string> };
    } = {};
    // eslint-disable-next-line guard-for-in
    for (const frame in selectedFrameFilters) {
      for (const filter in selectedFrameFilters[frame]?.selectedFilters) {
        if (
          selectedFrameFilters[frame]?.selectedFilters[filter] instanceof Set
        ) {
          processedFilters[frame] = {
            ...processedFilters[frame],
            [filter]: Array.from(
              selectedFrameFilters[frame]?.selectedFilters[filter]
            ),
          };
        }
      }
    }
    return {
      selectedFilters: processedFilters,
      selectedFrame,
      columnSorting: preferences?.columnSorting || {},
      columnSizing: preferences?.columnSizing || {},
      selectedColumns: preferences?.selectedColumns || {},
    };
  }, [
    preferences?.columnSizing,
    preferences?.columnSorting,
    preferences?.selectedColumns,
    selectedFrameFilters,
    selectedFrame,
  ]);

  const saveToLocalStorage = useCallback(async () => {
    if (fetchedInitialValueRef.current) {
      const currentTabId = await getCurrentTabId();
      if (currentTabId) {
        await PreferenceStore.update(
          currentTabId?.toString(),
          memoisedPreferences
        );
      }
    }
  }, [memoisedPreferences]);

  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  useEffect(() => {
    (async () => {
      const currentTabId = await getCurrentTabId();
      if (currentTabId && !fetchedInitialValueRef.current) {
        const storedTabData = (
          await chrome.storage.local.get(currentTabId?.toString())
        )[currentTabId];

        setPreferences(storedTabData?.preferences);
        if (storedTabData?.preferences?.selectedFrame) {
          if (
            storedTabData?.preferences?.selectedFilters &&
            Object.keys(storedTabData?.preferences?.selectedFilters).length > 0
          ) {
            // eslint-disable-next-line guard-for-in
            for (const frame in storedTabData?.preferences?.selectedFilters) {
              const newFiltersGenerator = (prevState: object) => {
                const newValue: SelectedFilters = { ...prevState };
                const setFilters =
                  storedTabData?.preferences?.selectedFilters[frame];
                // eslint-disable-next-line guard-for-in
                for (const filter in setFilters) {
                  newValue[filter] = new Set(setFilters[filter]);
                }
                return newValue;
              };
              setSelectedFrameFilters((previousFrameFilters) => ({
                ...previousFrameFilters,
                [frame]: {
                  selectedFilters: newFiltersGenerator(
                    previousFrameFilters[frame]?.selectedFilters || {}
                  ),
                },
              }));
            }
          }
        }
        fetchedInitialValueRef.current = true;
      }
    })();
  }, [getPreviousPreferences, setSelectedFrame, setSelectedFrameFilters]);

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
