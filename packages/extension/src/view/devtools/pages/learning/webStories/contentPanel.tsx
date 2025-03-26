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
import React from 'react';
import { ChipsBar, FiltersSidebar, TopBar } from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { MainContentContainer } from './mainContentContainer';
import { useWebStories } from '../../../stateProviders';

interface WebStoriesProps {
  storyOpened: boolean;
}

const WebStories = ({ storyOpened }: WebStoriesProps) => {
  const {
    allStoryJSON,
    searchValue,
    showFilterSidebar,
    sortValue,
    selectedFilters,
    selectedFilterValues,
    filters,
    setSearchValue,
    setShowFilterSidebar,
    setSortValue,
    toggleFilterSelection,
    resetFilters,
    setPageNumber,
  } = useWebStories(({ state, actions }) => ({
    allStoryJSON: state.allStoryJSON,
    searchValue: state.searchValue,
    filters: state.filters,
    sortValue: state.sortValue,
    selectedFilterValues: state.selectedFilterValues,
    showFilterSidebar: state.showFilterSidebar,
    selectedFilters: state.selectedFilters,
    setPageNumber: actions.setPageNumber,
    setSearchValue: actions.setSearchValue,
    setShowFilterSidebar: actions.setShowFilterSidebar,
    setSortValue: actions.setSortValue,
    toggleFilterSelection: actions.toggleFilterSelection,
    resetFilters: actions.resetFilters,
  }));

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
            count={allStoryJSON.length}
          >
            <div className="flex justify-between items-center min-w-[100px] text-raisin-black dark:text-bright-gray">
              <p className="min-w-fit">Sort by:</p>
              <select
                value={sortValue}
                onChange={(e) => {
                  setPageNumber(1);
                  setSortValue(e.target.value as 'latest' | 'oldest');
                }}
                className="hover:opacity-70 active:opacity-60 focus:bg-anti-flash-white
								focus:dark:bg-quartz bg-transparent cursor-pointer rounded-sm px-2 py-[1px] pr-5 appearance-none bg-no-repeat bg-right
								bg-[url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im03IDkuNDUgMy44NS01LjZoLTcuNyIgZmlsbD0iIzAwMCIvPjwvc3ZnPgo=)]
								dark:bg-[url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im03IDkuNDUgMy44NS01LjZoLTcuNyIgZmlsbD0iI0MyQzdDOSIvPjwvc3ZnPgo=)]"
                style={{
                  backgroundPositionX: '100%',
                  backgroundPositionY: '4px',
                }}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
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
          className="h-full flex-1 text-raisin-black dark:text-bright-gray"
        >
          <div className="h-full w-full flex">
            <MainContentContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebStories;
