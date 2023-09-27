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
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { noop } from '@cookie-analysis-tool/design-system';
/**
 * Internal dependencies.
 */
import type { SelectedFilters, Filter } from './types';
import { useCookieStore } from '../syncCookieStore';
import getFilters from './utils/getFilters';
import filterCookies from './utils/filterCookies';
import useContextSelector from '../../../../utils/useContextSelector';
import type { CookieTableData } from '@cookie-analysis-tool/common';

export interface filterManagementStore {
  state: {
    selectedFilters: SelectedFilters;
    filters: Filter[];
    filteredCookies: CookieTableData[];
    searchTerm: string;
    cookiesAvailable: boolean;
  };
  actions: {
    setSelectedFilters: (
      update: (prevState: SelectedFilters) => SelectedFilters
    ) => void;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  };
}

const initialState: filterManagementStore = {
  state: {
    selectedFilters: {},
    filters: [],
    filteredCookies: [],
    searchTerm: '',
    cookiesAvailable: false,
  },
  actions: {
    setSelectedFilters: noop,
    setSearchTerm: noop,
  },
};

export const Context = createContext<filterManagementStore>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [selectedFrameFilters, setSelectedFrameFilters] = useState<{
    [frameKey: string]: { selectedFilters: SelectedFilters };
  }>({});
  const [filters, setFilters] = useState<{
    [frameKey: string]: { filters: Filter[] };
  }>({});

  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const cookiesAvailable = useMemo(() => {
    return Boolean(
      frameFilteredCookies && Object.keys(frameFilteredCookies).length
    );
  }, [frameFilteredCookies]);

  const filteredCookies = useMemo(() => {
    if (!selectedFrame) {
      return [];
    }

    return Object.values(
      filterCookies(
        frameFilteredCookies,
        selectedFrameFilters[selectedFrame]?.selectedFilters || {},
        searchTerm
      )
    );
  }, [selectedFrame, frameFilteredCookies, selectedFrameFilters, searchTerm]);

  useEffect(() => {
    if (Object.keys(frameFilteredCookies).length !== 0) {
      const updatedFilters = getFilters(Object.values(frameFilteredCookies));

      selectedFrame &&
        setFilters((previousFilters) => ({
          ...previousFilters,
          [selectedFrame]: { filters: updatedFilters },
        }));
    } else {
      selectedFrame &&
        setFilters((previousFilters) => ({
          ...previousFilters,
          [selectedFrame]: { filters: [] },
        }));
    }
  }, [frameFilteredCookies, selectedFrame]);

  const setSelectedFilters = useCallback(
    (update: (prevState: SelectedFilters) => SelectedFilters) => {
      if (selectedFrame) {
        setSelectedFrameFilters((previousFrameFilters) => ({
          ...previousFrameFilters,
          [selectedFrame]: {
            selectedFilters: update(
              previousFrameFilters[selectedFrame]?.selectedFilters || {}
            ),
          },
        }));
      }
    },
    [selectedFrame]
  );

  const value: filterManagementStore = useMemo(
    () => ({
      state: {
        selectedFilters: selectedFrame
          ? selectedFrameFilters[selectedFrame]?.selectedFilters || {}
          : {},
        filters: selectedFrame ? filters[selectedFrame]?.filters || {} : [],
        filteredCookies,
        searchTerm,
        cookiesAvailable,
      },
      actions: {
        setSelectedFilters,
        setSearchTerm,
      },
    }),
    [
      selectedFrame,
      selectedFrameFilters,
      filters,
      filteredCookies,
      searchTerm,
      setSelectedFilters,
      cookiesAvailable,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
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
