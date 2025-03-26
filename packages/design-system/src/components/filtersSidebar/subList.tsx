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
import React, { useMemo } from 'react';
import { I18n } from '@google-psat/i18n';
import Option from './option';

/**
 * Internal dependencies.
 */

interface SubListProps {
  filterValues: string[];
  selectedFilterValues: string[];
  filterKey: string;
  sort: boolean;
  isExpanded: boolean;
  isSelectAllFilterEnabled: boolean;
  isSelectAllFilterSelected: boolean;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean | undefined
  ) => void;
  toggleSelectAllFilter: (
    filterKey: string,
    isSingleFilterRemovalAction?: boolean | undefined
  ) => void;
}

const SubList = ({
  filterValues,
  selectedFilterValues,
  filterKey,
  sort,
  isExpanded,
  isSelectAllFilterEnabled,
  isSelectAllFilterSelected,
  toggleFilterSelection,
  toggleSelectAllFilter,
}: SubListProps) => {
  const sortedFilterValueKeys = useMemo(() => {
    if (!sort) {
      return filterValues || [];
    }

    return (filterValues || []).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
  }, [filterValues, sort]);

  return (
    <ul>
      {isSelectAllFilterEnabled && (
        <Option
          filterKey={filterKey}
          filterValue={I18n.getMessage('selectAll')}
          selected={isSelectAllFilterSelected}
          toggleFilterSelection={() => toggleSelectAllFilter(filterKey)}
          isExpanded={true}
        />
      )}
      {sortedFilterValueKeys.map((filterValue, index) => (
        <React.Fragment key={index}>
          <Option
            filterKey={filterKey}
            filterValue={filterValue}
            selected={
              Boolean(
                selectedFilterValues.find(
                  (selectedFilterValue) => selectedFilterValue === filterValue
                )
              ) &&
              (isSelectAllFilterEnabled ? !isSelectAllFilterSelected : true)
            }
            toggleFilterSelection={toggleFilterSelection}
            isExpanded={index < 4 || isExpanded}
          />
        </React.Fragment>
      ))}
    </ul>
  );
};

export default SubList;
