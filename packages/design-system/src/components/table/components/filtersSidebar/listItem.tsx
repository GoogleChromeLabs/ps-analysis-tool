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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  InfoIcon,
  TableFilter,
  TableOutput,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import SubList from './subList';

interface ListItemProps {
  filter: TableFilter[keyof TableFilter];
  filterKey: string;
  toggleFilterSelection: TableOutput['toggleFilterSelection'];
  toggleSelectAllFilter: TableOutput['toggleSelectAllFilter'];
  expandAll: boolean;
  toggleFilterExpansion: (filterKey: string) => void;
  isSelectAllFilterSelected: boolean;
}

const ListItem = ({
  filter,
  filterKey,
  toggleFilterSelection,
  toggleSelectAllFilter,
  expandAll,
  toggleFilterExpansion,
  isSelectAllFilterSelected,
}: ListItemProps) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [showSubList, setShowSubList] = useState<boolean>(false);

  const toggleShowMore = useCallback(() => {
    setExpanded(!isExpanded);
  }, [isExpanded]);

  const toggleSubList = useCallback(() => {
    setShowSubList(!showSubList);
    toggleFilterExpansion(filterKey);
  }, [filterKey, showSubList, toggleFilterExpansion]);

  useEffect(() => {
    setShowSubList(expandAll);
  }, [expandAll]);

  const isDisabled = useMemo(
    () => Object.keys(filter.filterValues || {}).length === 0,
    [filter.filterValues]
  );

  return (
    <li className="py-[3px] text-xs">
      <div className="flex gap-2 items-center">
        <button
          className="flex items-center text-asteriod-black dark:text-bright-gray disabled:opacity-50 active:opacity-70"
          disabled={isDisabled}
          onClick={toggleSubList}
        >
          <span
            className={`${showSubList && !isDisabled ? '' : '-rotate-90'}`}
            data-testid="list-item-arrow"
          >
            <ArrowDown />
          </span>
          <p className="ml-1 leading-normal font-semi-thick">{filter.title}</p>
        </button>
        {filter.description && (
          <p title={filter.description}>
            <InfoIcon />
          </p>
        )}
      </div>
      {showSubList && (
        <>
          <SubList
            filterValues={filter.filterValues}
            filterKey={filterKey}
            sort={!filter.hasStaticFilterValues || Boolean(filter.sortValues)}
            toggleFilterSelection={toggleFilterSelection}
            isExpanded={isExpanded}
            isSelectAllFilterEnabled={Boolean(filter.enableSelectAllOption)}
            toggleSelectAllFilter={toggleSelectAllFilter}
            isSelectAllFilterSelected={isSelectAllFilterSelected}
          />
          {Number(Object.keys(filter.filterValues || {}).length) > 4 && (
            <a
              onClick={toggleShowMore}
              className="text-link ml-2 mt-1 block text-royal-blue dark:text-medium-persian-blue"
              href="#"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </a>
          )}
        </>
      )}
    </li>
  );
};

export default ListItem;
