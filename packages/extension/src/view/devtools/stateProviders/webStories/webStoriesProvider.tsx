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
import { useDebounce } from 'use-debounce';

/**
 * Internal dependencies.
 */
import Context, { type WebStoryContext } from './context';
import {
  getStoryMarkup,
  type SingleStoryJSON,
} from '../../../../utils/createStoryIframe';

const Provider = ({ children }: PropsWithChildren) => {
  const [_searchValue, setSearchValue] = useState('');
  const [storyMarkup, setStoryMarkup] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterSidebarValue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChipsFilter[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    Record<string, string[]>
  >({});
  const [authorPublisherLogo, setAuthorPublisherLogo] = useState<
    Record<number, Record<string, string>>
  >({});
  const [storyOpened, setStoryOpened] = useState(false);
  const [authors, setAuthors] = useState<Record<number, string>>({});
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [tags, setTags] = useState<Record<number, string>>({});
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [storyCount, setStoryCount] = useState<number>(0);
  const [sortValue, setSortValue] =
    useState<WebStoryContext['state']['sortValue']>('latest');

  const [searchValue] = useDebounce(_searchValue, 500);

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

  const fetchCategories = useCallback(async () => {
    const response = await fetch(
      'https://privacysandbox-stories.com/wp-json/web-stories/v1/web_story_category'
    );
    const responseJson = await response.json();
    const categoriesMap: Record<number, string> = {};
    responseJson.forEach((category: any) => {
      categoriesMap[category.id] = category.name;
    });

    setCategories(categoriesMap);
  }, []);

  const fetchAuthors = useCallback(async () => {
    const response = await fetch(
      'https://privacysandbox-stories.com/wp-json/web-stories/v1/users'
    );

    const responseJSON = await response.json();

    const authorNameIdMap: Record<number, string> = {};

    responseJSON.forEach((singleResponse: Record<string, any>) => {
      authorNameIdMap[singleResponse.id] = singleResponse.name;
    });

    setAuthors(authorNameIdMap);
  }, []);

  const fetchTags = useCallback(async () => {
    const response = await fetch(
      'https://privacysandbox-stories.com/wp-json/web-stories/v1/web_story_tag'
    );

    const responseJSON = await response.json();

    const tagNameIdMap: Record<number, string> = {};

    responseJSON.forEach((singleResponse: Record<string, any>) => {
      tagNameIdMap[singleResponse.id] = singleResponse.name;
    });

    setTags(tagNameIdMap);
  }, []);

  const getAuthorsAndPublisherLogo = useCallback(
    async (mediaAuthorSet: Record<number, string>) => {
      if (authors && Object.keys(authors).length === 0) {
        return {};
      }

      const mediaAuthorSetClone = mediaAuthorSet;
      Object.keys(authorPublisherLogo).forEach((key) => {
        if (authorPublisherLogo[Number(key)]) {
          delete mediaAuthorSetClone[Number(key)];
        }
      });

      if (Object.keys(mediaAuthorSet).length === 0) {
        return authorPublisherLogo;
      }

      const transformedMediaAuthorMap: Record<
        number,
        Record<string, string>
      > = {};

      await Promise.all(
        Object.keys(mediaAuthorSet).map(async (key: string) => {
          const mediaResponse = await fetch(
            'https://privacysandbox-stories.com/wp-json/web-stories/v1/media/' +
              mediaAuthorSet[Number(key)]
          );

          //Check the media response and get the avif/webp image if available else use source_url.
          const mediaResponseJSON = await mediaResponse.json();
          const sourceUrl = mediaResponseJSON.source_url;
          const splittedUrl = sourceUrl.split('/');
          const urlWithoutName = sourceUrl.substring(
            0,
            sourceUrl.length - splittedUrl[splittedUrl.length - 1].length
          );

          const avifResource =
            urlWithoutName +
            mediaResponseJSON?.media_details?.sources?.['image/avif']?.file;
          const webpResource =
            urlWithoutName +
            mediaResponseJSON?.media_details?.sources?.['image/webp']?.file;

          transformedMediaAuthorMap[Number(key)] = {
            name: authors[Number(key)],
            publisherLogo: avifResource ?? webpResource ?? sourceUrl,
          };
        })
      );
      setAuthorPublisherLogo(transformedMediaAuthorMap);
      return transformedMediaAuthorMap;
    },
    [authorPublisherLogo, authors]
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

    return `${
      selectedAuthorsID.length > 0
        ? 'author=' + selectedAuthorsID.join(',')
        : ''
    }${
      selectedCategoriesId.length > 0
        ? '&web_story_category=' + selectedCategoriesId.join(',')
        : ''
    }${
      selectedTagId.length > 0
        ? '&web_story_tag=' + selectedTagId.join(',')
        : ''
    }${sortValue === 'latest' ? '&order=desc' : '&order=asc'}${
      searchValue ? '&search="' + searchValue + '"' : ''
    }`;
  }, [
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

    setLoadingState(true);
    const response = await fetch(
      `https://privacysandbox-stories.com/wp-json/web-stories/v1/web-story/?${queryParams}`
    );

    const responseJSON = await response.json();
    let storyJSON: SingleStoryJSON[] = [];
    const mediaAuthorSet: Record<number, string> = {};

    responseJSON.forEach((singleResponse: any) => {
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

    setStoryCount(storyJSON.length);
    setStoryMarkup(getStoryMarkup(storyJSON));
    setLoadingState(false);
  }, [tags, categories, authors, queryParams, getAuthorsAndPublisherLogo]);

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchAuthors, fetchTags]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const memoisedValue = useMemo(() => {
    return {
      state: {
        storyMarkup,
        searchValue: _searchValue,
        showFilterSidebar,
        selectedFilters,
        filters,
        selectedFilterValues,
        sortValue,
        storyOpened,
        loadingState,
        storyCount,
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
    storyCount,
    storyMarkup,
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
