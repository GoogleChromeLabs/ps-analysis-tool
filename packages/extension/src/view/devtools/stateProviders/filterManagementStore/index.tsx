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
import { useContextSelector, createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useMemo,
} from 'react';
import type { SelectedFilters, Filter } from './types';
import { useCookieStore, type CookieTableData } from '../syncCookieStore';
import getFilters from './utils/getFilters';
import filterCookies from './utils/filterCookies';

export interface filterManagementStore {
  state: {
    selectedFilters: SelectedFilters;
    filters: Filter[];
    filteredCookies: CookieTableData[];
  };
  actions: {
    setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  };
}

const initialState: filterManagementStore = {
  state: {
    selectedFilters: {},
    filters: [],
    filteredCookies: [],
  },
  actions: {
    setSelectedFilters: () => {
      //Do nothing
    },
  },
};

export const Context = createContext<filterManagementStore>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [filters, setFilters] = useState<Filter[]>([]);

  const { cookies, selectedFrame, tabFrames } = useCookieStore(({ state }) => ({
    cookies: state.tabCookies,
    selectedFrame: state.selectedFrame,
    tabFrames: state.tabFrames,
  }));

  const frameFilteredCookies = useMemo(() => {
    const _frameFilteredCookies: { [key: string]: CookieTableData } = {};
    if (cookies && selectedFrame && tabFrames && tabFrames[selectedFrame]) {
      Object.entries(cookies).forEach(([key, cookie]) => {
        tabFrames[selectedFrame].frameIds?.forEach((frameId) => {
          if (cookie.frameIdList?.includes(frameId)) {
            _frameFilteredCookies[key] = cookie;
          }
        });
      });
    }
    return _frameFilteredCookies;
  }, [cookies, selectedFrame, tabFrames]);

  const filteredCookies = useMemo(() => {
    return Object.values(
      filterCookies(frameFilteredCookies, selectedFilters, '')
    );
  }, [frameFilteredCookies, selectedFilters]);

  useEffect(() => {
    if (Object.keys(frameFilteredCookies).length !== 0) {
      const updatedFilters = getFilters(Object.values(frameFilteredCookies));

      setFilters(updatedFilters);
    } else {
      setFilters([]);
    }
  }, [frameFilteredCookies]);

  useEffect(() => {
    setSelectedFilters({});
  }, [selectedFrame]);

  return (
    <Context.Provider
      value={{
        state: { selectedFilters, filters, filteredCookies },
        actions: { setSelectedFilters },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useFilterManagementStore(): filterManagementStore;
export function useFilterManagementStore<T>(
  selector: (state: filterManagementStore) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useFilterManagementStore<T>(
  selector: (state: filterManagementStore) => T | filterManagementStore = (
    state
  ) => state
) {
  return useContextSelector(Context, selector);
}
