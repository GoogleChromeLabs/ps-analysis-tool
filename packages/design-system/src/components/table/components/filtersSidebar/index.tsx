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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Internal dependencies.
 */
import ListItem from './listItem';
import type { TableFilter, TableOutput } from '../../useTable';
import { ArrowDown } from '../../../../icons';

interface FiltersSidebarProps {
  filters: TableFilter;
  toggleFilterSelection: TableOutput['toggleFilterSelection'];
  toggleSelectAllFilter: TableOutput['toggleSelectAllFilter'];
  isSelectAllFilterSelected: (filterKey: string) => boolean;
}

const FiltersSidebar = ({
  filters,
  toggleFilterSelection,
  toggleSelectAllFilter,
  isSelectAllFilterSelected,
}: FiltersSidebarProps) => {
  const [expandAll, setExpandAll] = useState(false);
  const expandedFilters = useRef(new Set<string>());
  const filterKeysWithValues = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => Object.keys(filters[key].filterValues || {}).length
    );
  }, [filters]);

  useEffect(() => {
    if (expandAll) {
      expandedFilters.current = new Set(filterKeysWithValues);
    }
  }, [expandAll, filterKeysWithValues]);

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

      if (newSet.size === filterKeysWithValues.length) {
        setExpandAll(true);
      }

      expandedFilters.current = newSet;
    },
    [filterKeysWithValues]
  );

  if (!Object.keys(filters).length) {
    return null;
  }

  return (
    <div
      className="h-full overflow-auto p-3 flex flex-col gap-1"
      data-testid="filters-sidebar"
    >
      <div className="flex gap-2 items-center mb-[3px]">
        <button
          className="flex items-center text-asteriod-black dark:text-bright-gray active:opacity-70"
          onClick={() => {
            setExpandAll((prev) => {
              const newExpandAll = !prev;

              if (newExpandAll) {
                expandedFilters.current = new Set(filterKeysWithValues);
              } else {
                expandedFilters.current = new Set();
              }

              return newExpandAll;
            });
          }}
        >
          <span
            className={`${expandAll ? '' : '-rotate-90'}`}
            data-testid="expand-arrow"
          >
            <ArrowDown />
          </span>
          <p className="ml-1 leading-normal font-semi-thick">
            Expand/Collapse All
          </p>
        </button>
      </div>
      <hr />
      <ul>
        {Object.entries(filters).map(([filterKey, filter]) => (
          <ListItem
            key={filterKey}
            filter={filter}
            filterKey={filterKey}
            toggleFilterSelection={toggleFilterSelection}
            toggleSelectAllFilter={toggleSelectAllFilter}
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
