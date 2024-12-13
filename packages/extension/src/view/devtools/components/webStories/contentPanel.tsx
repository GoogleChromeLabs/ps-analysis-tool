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
import React, { useCallback, useEffect, useState } from 'react';
import {
  ChipsBar,
  FiltersSidebar,
  TopBar,
  type ChipsFilter,
  type FilterSidebarValue,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { getStoryMarkup } from './createStoryIframe';
import { STORY_JSON } from './story';

interface WebStoriesProps {
  storyOpened: boolean;
}

const WebStories = ({ storyOpened }: WebStoriesProps) => {
  const storyMarkup = getStoryMarkup(STORY_JSON);
  const [searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterSidebarValue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChipsFilter[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    Record<string, string[]>
  >({});
  const [sortValue, setSortValue] = useState<'latest' | 'oldest'>('latest');

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

  return (
    <div className="h-full w-full flex flex-col">
      {!storyOpened && (
        <>
          <TopBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            showFilterSidebar={showFilterSidebar}
            setShowFilterSidebar={setShowFilterSidebar}
            hideFiltering={false}
            disableFiltering={false}
            hideSearch={false}
            count={0} // TODO: Add count
          >
            <div className="flex justify-between min-w-28">
              <p>Sort by:</p>
              <select
                value={sortValue}
                onChange={(e) =>
                  setSortValue(e.target.value as 'latest' | 'oldest')
                }
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
          </TopBar>
          <ChipsBar
            selectedFilters={selectedFilters}
            toggleFilterSelection={toggleFilterSelection}
            resetFilters={resetFilters}
          />
        </>
      )}
      <div className="flex-1 w-full flex divide-x divide-american-silver dark:divide-quartz border-t border-gray-300 dark:border-quartz">
        {showFilterSidebar && !storyOpened && (
          <Resizable
            minWidth="150px"
            maxWidth="50%"
            enable={{
              right: true,
            }}
          >
            <FiltersSidebar
              filters={filters}
              selectedFilterValues={selectedFilterValues}
              toggleFilterSelection={toggleFilterSelection}
              isSelectAllFilterSelected={() => false}
              toggleSelectAllFilter={noop}
            />
          </Resizable>
        )}
        <div
          data-testid="web-stories-content"
          className="h-fit flex-1 text-raisin-black dark:text-bright-gray overflow-hidden"
        >
          <iframe
            srcDoc={storyMarkup}
            style={{
              width: '100%',
              height: '100vh',
              border: 'none',
              overflow: 'hidden',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WebStories;
