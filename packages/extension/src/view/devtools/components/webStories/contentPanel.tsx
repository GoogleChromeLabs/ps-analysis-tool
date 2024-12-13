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
import { getStoryMarkup } from './createStoryIframe';
import { STORY_JSON } from './story';
import { useStories } from '../../stateProviders';

interface WebStoriesProps {
  storyOpened: boolean;
}

const WebStories = ({ storyOpened }: WebStoriesProps) => {
  const storyMarkup = getStoryMarkup(STORY_JSON);

  const {
    searchValue,
    setSearchValue,
    showFilterSidebar,
    setShowFilterSidebar,
    setSortValue,
    sortValue,
    selectedFilters,
    toggleFilterSelection,
    resetFilters,
    selectedFilterValues,
    filters,
  } = useStories(({ state, actions }) => ({
    searchValue: state.searchValue,
    filters: state.filters,
    sortValue: state.sortValue,
    selectedFilterValues: state.selectedFilterValues,
    setSearchValue: actions.setSearchValue,
    showFilterSidebar: state.showFilterSidebar,
    setShowFilterSidebar: actions.setShowFilterSidebar,
    setSortValue: actions.setSortValue,
    selectedFilters: state.selectedFilters,
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
          className="h-full flex-1 text-raisin-black dark:text-bright-gray"
        >
          <iframe
            srcDoc={storyMarkup}
            style={{
              width: '100%',
              height: '100%',
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
