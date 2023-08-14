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
import type {
  Filter,
  SelectedFilters,
} from '../../stateProviders/filterManagementStore/types';

interface SubListProps {
  filter: Filter;
  isExpanded: boolean;
  selectedFilters: SelectedFilters;
  handleFilterChange: (checked: boolean, keys: string, value: string) => void;
}

const SubList: React.FC<SubListProps> = ({
  filter,
  selectedFilters,
  handleFilterChange,
  isExpanded,
}) => {
  if (!filter?.filters) {
    return null;
  }

  return (
    <ul>
      {[...filter.filters].map((filterValue, index) => (
        <li
          key={index}
          className={
            index > 3 && !isExpanded ? 'ml-3 mt-1 hidden' : 'ml-3 mt-1'
          }
        >
          <label className="flex gap-x-2 cursor-pointer items-center">
            <input
              type="checkbox"
              name={filter.keys}
              className="accent-royal-blue w-3 h-3"
              checked={Boolean(
                selectedFilters[filter.keys] &&
                  selectedFilters[filter.keys].has(filterValue)
              )}
              onChange={(event) =>
                handleFilterChange(
                  event?.target?.checked,
                  filter.keys,
                  filterValue
                )
              }
            />
            <span>{String(filterValue)}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SubList;
