/*
 * Copyright 2024 Google LLC
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
  useRef,
} from 'react';
import type {
  ChipsFilter,
  FilterSidebarValue,
} from '@google-psat/design-system';
import { useDebounce } from 'use-debounce';

/**
 * Internal dependencies.
 */
import Context, { type WebStoryContext } from './context';
import type { SingleStoryJSON } from './types';
import { apiDataFetcher } from './utils/apiFetchers';
import { BASE_API_URL } from './constants';
import { createQueryParams } from './utils/createQueryParams';

const Provider = ({ children }: PropsWithChildren) => {
  const [_searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterSidebarValue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChipsFilter[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    Record<string, string[]>
  >({});
  const [storyOpened, setStoryOpened] = useState(false);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [tags, setTags] = useState<Record<number, string>>({});
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [pageNumber, setPageNumber] = useState<number>(1);
  const doesHaveMorePagesRef = useRef<boolean>(true);
  const [allStoryJSON, setAllStoryJSON] = useState<SingleStoryJSON[]>([]);
  const [sortValue, setSortValue] =
    useState<WebStoryContext['state']['sortValue']>('latest');

  const [searchValue] = useDebounce(_searchValue, 500);

  useEffect(() => {
    setPageNumber(1);
  }, [searchValue]);

  useEffect(() => {
    setFilters([
      {
        key: 'category',
        title: 'Category',
        values: Object.values(categories),
        sortValues: true,
      },
      {
        key: 'tag',
        title: 'Tag',
        values: Object.values(tags),
        sortValues: true,
      },
    ]);
  }, [categories, tags]);

  const webStoriesLoadMoreData = useCallback(() => {
    if (!doesHaveMorePagesRef.current) {
      return;
    }

    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

  useEffect(() => {
    document.addEventListener(
      'webStoriesLightBoxEvent',
      //@ts-ignore since this is a custom event.
      (event) => setStoryOpened(event.detail.storyOpened),
      false
    );

    document.addEventListener(
      'iframeLoaded',
      () => setIframeLoaded(true),
      false
    );

    document.addEventListener('loadMoreData', webStoriesLoadMoreData, false);

    return () => {
      document.removeEventListener(
        'iframeLoaded',
        () => setIframeLoaded(true),
        false
      );

      document.removeEventListener(
        'webStoriesLightBoxEvent',
        //@ts-ignore since this is a custom event.
        (event) => setStoryOpened(event.detail.storyOpened),
        false
      );

      document.removeEventListener(
        'loadMoreData',
        webStoriesLoadMoreData,
        false
      );
    };
  }, [webStoriesLoadMoreData]);

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

      setPageNumber(1);
    },
    [filters]
  );

  const resetFilters = useCallback(() => {
    setSelectedFilters([]);
    setSelectedFilterValues({});
    setPageNumber(1);
  }, []);

  const queryParams = useMemo(() => {
    return createQueryParams(
      selectedFilterValues,
      categories,
      tags,
      searchValue,
      pageNumber,
      sortValue
    );
  }, [
    pageNumber,
    searchValue,
    categories,
    selectedFilterValues,
    sortValue,
    tags,
  ]);

  const fetchStories = useCallback(async () => {
    if (
      Object.keys(tags).length === 0 ||
      Object.keys(categories).length === 0
    ) {
      return;
    }

    if (pageNumber === 1) {
      setIframeLoaded(false);
      setAllStoryJSON([]);
    }

    setLoadingState(true);

    const response = await fetch(`${BASE_API_URL}/web-story/?${queryParams}`);

    const responseJSON = await response.json();
    const totalPages = Number(response.headers.get('X-Wp-Totalpages'));

    doesHaveMorePagesRef.current = pageNumber < totalPages;

    if (responseJSON?.data?.status === 400) {
      setLoadingState(false);
      if (pageNumber === 1) {
        setAllStoryJSON([]);
      }
      return;
    }

    const storyJSON: SingleStoryJSON[] = [];

    if (responseJSON.length === 0 && pageNumber === 1) {
      setAllStoryJSON([]);
      setLoadingState(false);
      return;
    }

    responseJSON?.forEach((singleResponse: any) => {
      if (singleResponse?.status === 'publish') {
        storyJSON.push({
          heroImage: singleResponse?.story_poster?.url ?? '',
          publisherLogo: singleResponse?.meta?.web_stories_publisher_logo,
          publisherName: singleResponse?.author,
          storyTitle: singleResponse?.title?.rendered,
          storyUrl: `${singleResponse?.link}#embedMode=2`,
        });
      }
    });

    setLoadingState(false);
    setAllStoryJSON((prevState) => {
      if (pageNumber === 1) {
        return [...storyJSON];
      } else {
        return [...prevState, ...storyJSON];
      }
    });
  }, [tags, categories, pageNumber, queryParams]);

  useEffect(() => {
    apiDataFetcher('/web_story_category', setCategories);
    apiDataFetcher('/web_story_tag', setTags);
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const memoisedValue = useMemo(() => {
    return {
      state: {
        allStoryJSON,
        searchValue: _searchValue,
        showFilterSidebar,
        selectedFilters,
        filters,
        selectedFilterValues,
        sortValue,
        storyOpened,
        loadingState,
        iframeLoaded,
        pageNumber,
        doesHaveMorePages: doesHaveMorePagesRef.current,
      },
      actions: {
        setIframeLoaded,
        resetFilters,
        toggleFilterSelection,
        setSearchValue,
        setShowFilterSidebar,
        setSortValue,
        setSelectedFilterValues,
        setPageNumber,
      },
    };
  }, [
    pageNumber,
    iframeLoaded,
    allStoryJSON,
    _searchValue,
    showFilterSidebar,
    selectedFilters,
    filters,
    selectedFilterValues,
    sortValue,
    storyOpened,
    loadingState,
    resetFilters,
    toggleFilterSelection,
    setSearchValue,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
