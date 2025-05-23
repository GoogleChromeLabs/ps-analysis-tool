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
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { FilterSidebarValue } from '.';
import { ArrowDown, InfoIcon } from '../../icons';
import SubList from './subList';

interface ListItemProps {
  filter: FilterSidebarValue;
  selectedFilterValues: string[];
  filterKey: string;
  expandAll: boolean;
  isSelectAllFilterSelected: boolean;
  toggleFilterExpansion: (filterKey: string, expand?: boolean) => void;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean
  ) => void;
  toggleSelectAllFilter: (
    filterKey: string,
    isSingleFilterRemovalAction?: boolean
  ) => void;
}

const ListItem = ({
  filter,
  selectedFilterValues,
  filterKey,
  expandAll,
  toggleFilterExpansion,
  isSelectAllFilterSelected,
  toggleFilterSelection,
  toggleSelectAllFilter,
}: ListItemProps) => {
  const [hasScannedFiltersOnce, setHasScannedFiltersOnce] =
    useState<boolean>(true);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [showSubList, setShowSubList] = useState<boolean>(false);

  const toggleShowMore = useCallback(() => {
    setExpanded(!isExpanded);
  }, [isExpanded]);

  const toggleSubList = useCallback(() => {
    setShowSubList((prev) => !prev);
    toggleFilterExpansion(filterKey);
  }, [filterKey, toggleFilterExpansion]);

  useEffect(() => {
    setShowSubList(expandAll);
  }, [expandAll]);

  const isDisabled = useMemo(() => !filter.values.length, [filter.values]);

  useEffect(() => {
    if (isDisabled && showSubList) {
      setShowSubList((prev) => {
        if (prev) {
          toggleFilterExpansion(filterKey);
        }

        return false;
      });
    }
  }, [expandAll, filterKey, isDisabled, showSubList, toggleFilterExpansion]);

  useEffect(() => {
    if (!hasScannedFiltersOnce) {
      return;
    }

    const areFiltersSelected =
      filter.values?.some((filterValue) =>
        selectedFilterValues?.includes(filterValue)
      ) || false;

    if (areFiltersSelected) {
      setShowSubList(true);
      setHasScannedFiltersOnce(false);
    }
  }, [filter.values, hasScannedFiltersOnce, selectedFilterValues]);

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
            <InfoIcon className="fill-granite-gray" />
          </p>
        )}
      </div>
      {showSubList && (
        <>
          <SubList
            filterValues={filter.values || []}
            filterKey={filterKey}
            sort={Boolean(filter.sortValues)}
            selectedFilterValues={selectedFilterValues || []}
            isExpanded={isExpanded}
            isSelectAllFilterEnabled={Boolean(filter.enableSelectAll)}
            isSelectAllFilterSelected={isSelectAllFilterSelected}
            toggleFilterSelection={toggleFilterSelection}
            toggleSelectAllFilter={toggleSelectAllFilter}
          />
          {Number(filter.values?.length || 0) > 4 && (
            <a
              onClick={toggleShowMore}
              className="text-link ml-2 mt-1 block text-royal-blue dark:text-medium-persian-blue"
              href="#"
            >
              {I18n.getMessage(isExpanded ? 'showLess' : 'showMore')}
            </a>
          )}
        </>
      )}
    </li>
  );
};

export default ListItem;
