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
import type { SelectedFilters } from '../../types';

interface ListItem {
  index: number;
  isExpanded: boolean;
  filterKeys: string;
  selectedFilters: SelectedFilters;
  filterValue: string;
  handleFilterChange: () => void;
}

const ListItem: React.FC<ListItem> = ({
  index,
  isExpanded,
  filterKeys,
  selectedFilters,
  filterValue,
  handleFilterChange,
}) => {
  return (
    <li className={index > 3 && !isExpanded ? 'ml-2 mt-1 hidden' : 'ml-2 mt-1'}>
      <label className="flex gap-x-2 cursor-pointer">
        <input
          type="checkbox"
          name={filterKeys}
          checked={Boolean(
            selectedFilters[filterKeys] &&
              selectedFilters[filterKeys].has(filterValue)
          )}
          onChange={(event) =>
            handleFilterChange(event?.target?.checked, filterKeys, filterValue)
          }
        />
        <span>{String(filterValue)}</span>
      </label>
    </li>
  );
};

export default ListItem;
