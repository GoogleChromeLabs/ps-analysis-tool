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
import React from 'react';

/**
 * Internal dependencies.
 */
import ChipList from './chipList';
import { StopIcon } from '../../../../../icons';
import { useTable } from '../../../useTable';

const ChipsBar = () => {
  const { selectedFilters, resetFilters } = useTable(({ state, actions }) => ({
    selectedFilters: state.selectedFilters,
    resetFilters: actions.resetFilters,
  }));

  const appliedFiltersCount = Object.values(selectedFilters).reduce(
    (acc, filter) => {
      acc += Number(Object.keys(filter.filterValues || {}).length);
      return acc;
    },
    0
  );

  return (
    <div
      className={
        'w-full h-6 px-2 py-1 flex items-center overflow-x-scroll no-scrollbar bg-anti-flash-white dark:bg-raisin-black border-b border-gray-300 dark:border-quartz'
      }
    >
      {appliedFiltersCount > 1 && (
        <button
          className="h-full flex items-center text-link text-xs whitespace-nowrap"
          onClick={resetFilters}
        >
          <StopIcon className="text-gray min-w-[14px] min-h-[14px]" />
          <span className="ml-1 mr-2 dark:text-bright-gray bg-transparent">
            Clear all
          </span>
          <div className="w-[1px] bg-gainsboro dark:bg-quartz h-[20px]"></div>
        </button>
      )}
      <ChipList />
    </div>
  );
};

export default ChipsBar;
