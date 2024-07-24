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

/**
 * Internal dependencies.
 */
import { type TableFilter } from '../../useTable';
import Option from './option';

interface SubListProps {
  filterValues: TableFilter[keyof TableFilter]['filterValues'];
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
      return Object.keys(filterValues || {});
    }

    return Object.keys(filterValues || {}).sort((a, b) =>
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
              Boolean(filterValues?.[filterValue].selected) &&
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
