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
import React, { useState } from 'react';
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
}

const ListItem = ({
  filter,
  filterKey,
  toggleFilterSelection,
}: ListItemProps) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [showSubList, setShowSubList] = useState<boolean>(false);

  const toggleShowMore = () => {
    setExpanded(!isExpanded);
  };

  const toggleSubList = () => {
    setShowSubList(!showSubList);
  };

  return (
    <li className="py-[3px] text-xs">
      <div className="flex gap-2 items-center">
        <button
          className="flex items-center text-asteriod-black dark:text-bright-gray"
          onClick={toggleSubList}
        >
          <span className={showSubList ? '' : '-rotate-90'}>
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
            sort={!filter.hasStaticFilterValues}
            toggleFilterSelection={toggleFilterSelection}
            isExpanded={isExpanded}
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
