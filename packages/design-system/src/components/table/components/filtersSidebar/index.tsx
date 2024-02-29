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
import React, { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import ListItem from './listItem';
import { useTable } from '../../useTable';

const FiltersSidebar = () => {
  const { filters, isSelectAllFilterSelected } = useTable(
    ({ state, actions }) => ({
      filters: state.filters,
      isSelectAllFilterSelected: actions.isSelectAllFilterSelected,
    })
  );

  const [expandAll, setExpandAll] = useState(false);
  const expandedFilters = useRef(new Set<string>());
  const filterKeys = useMemo(() => {
    return Object.keys(filters);
  }, [filters]);

  const toggleFilterExpansion = useCallback(
    (filterKey: string) => {
      const newSet = new Set(expandedFilters.current);

      if (newSet.has(filterKey)) {
        newSet.delete(filterKey);
      } else {
        newSet.add(filterKey);
      }

      if (newSet.size === 0) {
        setExpandAll(false);
      }
      if (newSet.size === filterKeys.length) {
        setExpandAll(true);
      }

      expandedFilters.current = newSet;
    },
    [filterKeys]
  );

  const handleExpandAllClick = useCallback(() => {
    setExpandAll((prev) => {
      const newExpandAll = !prev;

      if (newExpandAll) {
        expandedFilters.current = new Set(filterKeys);
      } else {
        expandedFilters.current = new Set();
      }

      return newExpandAll;
    });
  }, [filterKeys]);

  if (!filterKeys.length) {
    return null;
  }

  return (
    <div
      className="h-full overflow-auto p-3 pt-0"
      data-testid="filters-sidebar"
    >
      <a
        className="w-full block text-link text-royal-blue dark:text-medium-persian-blue text-[11px] mt-1.5 mb-[5px]"
        href="#"
        onClick={handleExpandAllClick}
      >
        {expandAll ? 'Collapse All' : 'Expand All'}
      </a>
      <ul>
        {Object.entries(filters).map(([filterKey, filter]) => (
          <ListItem
            key={filterKey}
            filter={filter}
            filterKey={filterKey}
            expandAll={expandAll}
            toggleFilterExpansion={toggleFilterExpansion}
            isSelectAllFilterSelected={isSelectAllFilterSelected(filterKey)}
          />
        ))}
      </ul>
    </div>
  );
};

export default FiltersSidebar;
