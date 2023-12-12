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
import ListItem from './listItem';
import type { TableFilter, TableOutput } from '../../useTable';

interface FiltersSidebarProps {
  filters: TableFilter;
  toggleFilterSelection: TableOutput['toggleFilterSelection'];
}

const FiltersSidebar = ({
  filters,
  toggleFilterSelection,
}: FiltersSidebarProps) => {
  if (!Object.keys(filters).length) {
    return null;
  }

  return (
    <div className="h-full overflow-auto p-3">
      <ul>
        {Object.entries(filters).map(([filterKey, filter]) => (
          <ListItem
            key={filterKey}
            filter={filter}
            filterKey={filterKey}
            toggleFilterSelection={toggleFilterSelection}
          />
        ))}
      </ul>
    </div>
  );
};

export default FiltersSidebar;
