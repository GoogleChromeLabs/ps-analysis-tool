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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import { getStoryMarkup } from './createStoryIframe';
import { STORY_JSON } from './story';
import { TopBar } from '@google-psat/design-system';
import { Resizable } from 're-resizable';

const WebStories = () => {
  const storyMarkup = getStoryMarkup(STORY_JSON);
  const [searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  return (
    <div className="h-full w-full flex flex-col">
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
        <div className="flex">
          <p>Sort by:</p>
          <select>
            <option value="Newest">Newest</option>
            <option value="name">Name</option>
          </select>
        </div>
      </TopBar>
      {/* <ChipsBar
        selectedFilters={selectedFilters}
        resetFilters={resetFilters}
        toggleFilterSelection={toggleFilterSelection}
      /> */}
      <div className="flex-1 w-full flex divide-x divide-american-silver dark:divide-quartz border-t border-gray-300 dark:border-quartz">
        <Resizable
          minWidth="100px"
          maxWidth="50%"
          enable={{
            right: true,
          }}
        >
          {/* <FiltersSidebar
            filters={{
              ...filters,
              category: {
                title: 'Category',
                filterValues: {
                  category1: {
                    selected: false,
                  },
                  category2: {
                    selected: false,
                  },
                },
                hasStaticFilterValues: true,
              },
              author: {
                title: 'Author',
                filterValues: {
                  author1: {
                    selected: false,
                  },
                  author2: {
                    selected: false,
                  },
                },
                hasStaticFilterValues: true,
              },
              tags: {
                title: 'Tags',
                filterValues: {
                  tag1: {
                    selected: false,
                  },
                  tag2: {
                    selected: false,
                  },
                },
                hasStaticFilterValues: true,
              },
            }}
            isSelectAllFilterSelected={isSelectAllFilterSelected}
            toggleFilterSelection={toggleFilterSelection}
            toggleSelectAllFilter={toggleSelectAllFilter}
          /> */}
        </Resizable>
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
              padding: '1rem 0rem',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WebStories;
