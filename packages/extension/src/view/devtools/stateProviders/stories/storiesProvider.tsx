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
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  ChipsFilter,
  FilterSidebarValue,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Context, { type StoryContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterSidebarValue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChipsFilter[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    Record<string, string[]>
  >({});
  const [sortValue, setSortValue] =
    useState<StoryContext['state']['sortValue']>('latest');

  useEffect(() => {
    setFilters([
      {
        key: 'category',
        title: 'Category',
        values: ['Category 1', 'Category 2', 'Category 3'],
        sortValues: true,
      },
      {
        key: 'author',
        title: 'Author',
        values: ['Author 1', 'Author 2', 'Author 3'],
        sortValues: true,
      },
      {
        key: 'tag',
        title: 'Tag',
        values: ['Tag 1', 'Tag 2', 'Tag 3'],
        sortValues: true,
      },
    ]);
  }, []);

  const [storyOpened, setStoryOpened] = useState(false);
  //@ts-ignore since this is a custom event.

  const webStoriesLightBoxCallback = useCallback((event) => {
    setStoryOpened(() => event.detail.storyOpened);
  }, []);

  useEffect(() => {
    window.document.addEventListener(
      'webStoriesLightBoxEvent',
      webStoriesLightBoxCallback,
      false
    );

    return () => {
      window.document.removeEventListener(
        'webStoriesLightBoxEvent',
        webStoriesLightBoxCallback,
        false
      );
    };
  }, [webStoriesLightBoxCallback]);

  const toggleFilterSelection = useCallback(
    (filterKey: string, filterValue: string) => {
      setSelectedFilters((prevSelectedFilters) => {
        const filterIndex = prevSelectedFilters.findIndex(
          (filter) => filter.key === filterKey
        );

        if (filterIndex === -1) {
          return [
            ...prevSelectedFilters,
            {
              key: filterKey,
              title:
                filters.find((filter) => filter.key === filterKey)?.title || '',
              values: [filterValue],
            },
          ];
        }

        const filter = prevSelectedFilters[filterIndex];
        const newFilterValues = filter.values.includes(filterValue)
          ? filter.values.filter((value) => value !== filterValue)
          : [...filter.values, filterValue];

        const newFilter = {
          ...filter,
          values: newFilterValues,
        };

        const newSelectedFilters = [...prevSelectedFilters];
        newSelectedFilters[filterIndex] = newFilter;

        return newSelectedFilters;
      });

      setSelectedFilterValues((prevSelectedFilterValues) => {
        const filter = prevSelectedFilterValues[filterKey] || [];

        const newSelectedFilterValues = {
          ...prevSelectedFilterValues,
          [filterKey]: filter.includes(filterValue)
            ? filter.filter((value) => value !== filterValue)
            : [...filter, filterValue],
        };

        return newSelectedFilterValues;
      });
    },
    [filters]
  );

  const resetFilters = useCallback(() => {
    setSelectedFilters([]);
    setSelectedFilterValues({});
  }, []);

  const memoisedValue = useMemo(() => {
    return {
      state: {
        searchValue,
        showFilterSidebar,
        selectedFilters,
        filters,
        selectedFilterValues,
        sortValue,
        storyOpened,
      },
      actions: {
        resetFilters,
        toggleFilterSelection,
        setSearchValue,
        setShowFilterSidebar,
        setSortValue,
        setSelectedFilterValues,
      },
    };
  }, [
    filters,
    resetFilters,
    searchValue,
    selectedFilterValues,
    selectedFilters,
    showFilterSidebar,
    sortValue,
    storyOpened,
    toggleFilterSelection,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
