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
import { I18n } from '@google-psat/i18n';
import { StopIcon } from '../../icons';
import ChipList from './chipsList';

/**
 * Internal dependencies.
 */

export type ChipsFilter = {
  key: string;
  title: string;
  values: string[];
};

interface ChipsBarProps {
  selectedFilters: ChipsFilter[];
  resetFilters: () => void;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean
  ) => void;
  hideClearAll?: boolean;
}

const ChipsBar = ({
  selectedFilters,
  resetFilters,
  toggleFilterSelection,
  hideClearAll = false,
}: ChipsBarProps) => {
  console.log(selectedFilters);

  const appliedFiltersCount = selectedFilters.reduce((acc, filter) => {
    acc += filter.values.length;
    return acc;
  }, 0);

  return (
    <div
      className={
        'w-full h-6 px-2 py-1 flex items-center overflow-x-scroll no-scrollbar bg-anti-flash-white dark:bg-raisin-black'
      }
    >
      {appliedFiltersCount > 0 && !hideClearAll && (
        <button
          className="h-full flex items-center text-link text-xs whitespace-nowrap"
          onClick={resetFilters}
        >
          <StopIcon className="text-gray min-w-[14px] min-h-[14px]" />
          <span className="ml-1 mr-2 dark:text-bright-gray bg-transparent">
            {I18n.getMessage('clearAll')}
          </span>
          <div className="w-[1px] bg-gainsboro dark:bg-quartz h-[20px]"></div>
        </button>
      )}
      <ChipList
        selectedFilters={selectedFilters}
        toggleFilterSelection={toggleFilterSelection}
        hideCloseIcon={hideClearAll}
      />
    </div>
  );
};

export default ChipsBar;
