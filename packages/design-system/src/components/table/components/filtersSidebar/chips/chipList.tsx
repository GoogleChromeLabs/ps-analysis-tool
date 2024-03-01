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
import Chip from './chip';
import { useTable } from '../../../useTable';

const ChipList = () => {
  const { selectedFilters, toggleFilterSelection } = useTable(
    ({ state, actions }) => ({
      selectedFilters: state.selectedFilters,
      toggleFilterSelection: actions.toggleFilterSelection,
    })
  );

  return (
    <div className="flex flex-nowrap max-w-full">
      {Object.entries(selectedFilters).map(([filterKey, filter]) => {
        return Object.keys(filter.filterValues || {}).map((filterValue) => (
          <Chip
            key={filterValue}
            filterTitle={filter.title}
            value={filterValue}
            toggleFilterSelection={() => {
              toggleFilterSelection(filterKey, filterValue, true);
            }}
          />
        ));
      })}
    </div>
  );
};

export default ChipList;
