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
import { type SingleStoryJSON } from './getStaticStoryMarkup';
import { apiDataFetcher, BASE_API_URL, getMediaUrl } from './apiFetchers';

const Provider = ({ children }: PropsWithChildren) => {
  const [_searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterSidebarValue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChipsFilter[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    Record<string, string[]>
  >({});
  const authorPublisherLogoRef = useRef<Record<number, Record<string, string>>>(
    {}
  );
  const [storyOpened, setStoryOpened] = useState(false);
  const [authors, setAuthors] = useState<Record<number, string>>({});
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
        key: 'author',
        title: 'Author',
        values: Object.values(authors),
        sortValues: true,
      },
      {
        key: 'tag',
        title: 'Tag',
        values: Object.values(tags),
        sortValues: true,
      },
    ]);
  }, [authors, categories, tags]);

  const webStoriesLoadMoreData = useCallback(() => {
    if (!doesHaveMorePagesRef.current) {
      return;
    }

    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

  useEffect(() => {
    window.document.addEventListener(
      'webStoriesLightBoxEvent',
      //@ts-ignore since this is a custom event.
      (event) => setStoryOpened(event.detail.storyOpened),
      false
    );

    window.document.addEventListener(
      'iframeLoaded',
      () => setIframeLoaded(true),
      false
    );

    window.document.addEventListener(
      'loadMoreData',
      webStoriesLoadMoreData,
      false
    );

    return () => {
      window.document.removeEventListener(
        'iframeLoaded',
        () => setIframeLoaded(true),
        false
      );

      window.document.removeEventListener(
        'webStoriesLightBoxEvent',
        //@ts-ignore since this is a custom event.
        (event) => setStoryOpened(event.detail.storyOpened),
        false
      );

      window.document.removeEventListener(
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

  const getAuthorsAndPublisherLogo = useCallback(
    async (mediaAuthorSet: Record<number, string>) => {
      if (authors && Object.keys(authors).length === 0) {
        return {};
      }

      const mediaAuthorSetClone = mediaAuthorSet;
      Object.keys(authorPublisherLogoRef.current).forEach((key) => {
        if (authorPublisherLogoRef.current[Number(key)]) {
          delete mediaAuthorSetClone[Number(key)];
        }
      });

      if (Object.keys(mediaAuthorSet).length === 0) {
        return authorPublisherLogoRef.current;
      }

      authorPublisherLogoRef.current = await getMediaUrl(
        mediaAuthorSet,
        authors
      );
      return authorPublisherLogoRef.current;
    },
    [authors]
  );

  const queryParams = useMemo(() => {
    const selectedAuthorsID: number[] = [];
    const selectedCategoriesId: number[] = [];
    const selectedTagId: number[] = [];

    Object.keys(authors).forEach((key) => {
      const keyToUse = Number(key);
      if (selectedFilterValues?.author?.includes(authors[keyToUse])) {
        selectedAuthorsID.push(keyToUse);
      }
    });

    Object.keys(categories).forEach((key) => {
      const keyToUse = Number(key);
      if (selectedFilterValues?.category?.includes(categories[keyToUse])) {
        selectedCategoriesId.push(keyToUse);
      }
    });

    Object.keys(tags).forEach((key) => {
      const keyToUse = Number(key);
      if (selectedFilterValues?.tag?.includes(tags[keyToUse])) {
        selectedTagId.push(keyToUse);
      }
    });

    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append('per_page', '8');
    urlSearchParams.append('page', pageNumber.toString());

    if (selectedAuthorsID.length > 0) {
      urlSearchParams.append('author', selectedAuthorsID.join(','));
    }

    if (selectedCategoriesId.length > 0) {
      urlSearchParams.append(
        'web_story_category',
        selectedCategoriesId.join(',')
      );
    }

    if (selectedTagId.length > 0) {
      urlSearchParams.append('web_story_tag', selectedTagId.join(','));
    }

    urlSearchParams.append('order', sortValue === 'latest' ? 'desc' : 'asc');

    if (searchValue) {
      urlSearchParams.append('search', searchValue);
    }

    return urlSearchParams.toString();
  }, [
    pageNumber,
    searchValue,
    authors,
    categories,
    selectedFilterValues?.author,
    selectedFilterValues?.category,
    selectedFilterValues?.tag,
    sortValue,
    tags,
  ]);

  const fetchStories = useCallback(async () => {
    if (
      Object.keys(tags).length === 0 ||
      Object.keys(categories).length === 0 ||
      Object.keys(authors).length === 0
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
      return;
    }

    let storyJSON: SingleStoryJSON[] = [];
    const mediaAuthorSet: Record<number, string> = {};

    if (responseJSON.length === 0 && pageNumber === 1) {
      setAllStoryJSON([]);
      setLoadingState(false);
      return;
    }

    responseJSON?.forEach((singleResponse: any) => {
      if (singleResponse?.status === 'publish') {
        mediaAuthorSet[singleResponse.author] =
          singleResponse?.meta?.web_stories_publisher_logo;

        storyJSON.push({
          heroImage: singleResponse?.story_poster?.url ?? '',
          publisherLogo: singleResponse?.meta?.web_stories_publisher_logo,
          publisherName: singleResponse?.author,
          storyTitle: singleResponse?.title?.rendered,
          storyUrl: `${singleResponse?.link}#embedMode=2`,
        });
      }
    });

    const authorsAndPublisherLogoMap = await getAuthorsAndPublisherLogo(
      mediaAuthorSet
    );

    storyJSON = storyJSON.map((story) => {
      const key = Number(story.publisherName);
      story.publisherName = authorsAndPublisherLogoMap[key]?.name;
      story.publisherLogo = authorsAndPublisherLogoMap[key]?.publisherLogo;
      return story;
    });

    setLoadingState(false);
    setAllStoryJSON((prevState) => {
      if (pageNumber === 1) {
        return [...storyJSON];
      } else {
        return [...prevState, ...storyJSON];
      }
    });
  }, [
    tags,
    categories,
    authors,
    pageNumber,
    queryParams,
    getAuthorsAndPublisherLogo,
  ]);

  useEffect(() => {
    apiDataFetcher('/users', setAuthors);
    apiDataFetcher('/web_story_category', setCategories);
    apiDataFetcher('/web-story_tag', setTags);
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
