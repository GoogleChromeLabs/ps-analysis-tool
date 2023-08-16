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
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import ChipList from './chipList';
// eslint-disable-next-line import/no-relative-packages
import ClearIcon from '../../../../../../../../third_party/icons/clear-icon.svg';

const ChipsBar: React.FC = () => {
  const { selectedFilters, setSelectedFilters } = useFilterManagementStore(
    ({ state, actions }) => ({
      selectedFilters: state.selectedFilters,
      setSelectedFilters: actions.setSelectedFilters,
    })
  );

  const selectedFilterCount = Object.entries(selectedFilters).reduce(
    (size, [, filters]) => size + filters.size,
    0
  );

  const clearAll = () => {
    setSelectedFilters(() => ({}));
  };

  return (
    <div className="w-full h-full py-1 px-2 flex items-center overflow-x-scroll no-scrollbar bg-anti-flash-white border-b border-gray-300">
      {selectedFilterCount > 1 && (
        <a
          href="#"
          className="min-w-[72px] h-full flex items-center text-link text-xs whitespace-nowrap"
          onClick={clearAll}
        >
          <ClearIcon />
          <span className="ml-2 mr-1">Clear all</span>
          <div className="w-[1px] bg-[#DADCE0] h-[20px]"></div>
        </a>
      )}
      <ChipList />
    </div>
  );
};

export default ChipsBar;
