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
import { noop, createContext } from '@google-psat/common';
import type {
  ChipsFilter,
  FilterSidebarValue,
} from '@google-psat/design-system';

export interface StoryContext {
  state: {
    searchValue: string;
    showFilterSidebar: boolean;
    filters: FilterSidebarValue[];
    selectedFilters: ChipsFilter[];
    selectedFilterValues: Record<string, string[]>;
    sortValue: 'latest' | 'oldest';
    storyOpened: boolean;
  };
  actions: {
    resetFilters: () => void;
    toggleFilterSelection: (filterKey: string, filterValue: string) => void;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setShowFilterSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    setSortValue: React.Dispatch<React.SetStateAction<'latest' | 'oldest'>>;
    setSelectedFilterValues: React.Dispatch<
      React.SetStateAction<Record<string, string[]>>
    >;
  };
}

const initialState: StoryContext = {
  state: {
    searchValue: '',
    showFilterSidebar: false,
    selectedFilters: [],
    filters: [],
    selectedFilterValues: {},
    sortValue: 'latest',
    storyOpened: false,
  },
  actions: {
    resetFilters: noop,
    toggleFilterSelection: noop,
    setSearchValue: noop,
    setShowFilterSidebar: noop,
    setSortValue: noop,
    setSelectedFilterValues: noop,
  },
};

export default createContext<StoryContext>(initialState);
