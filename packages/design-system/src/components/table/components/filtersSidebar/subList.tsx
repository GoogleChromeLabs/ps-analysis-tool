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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { TableFilter, TableOutput } from '../../useTable';

interface SubListProps {
  filterValues: TableFilter[keyof TableFilter]['filterValues'];
  filterKey: string;
  sort: boolean;
  isExpanded: boolean;
  toggleFilterSelection: TableOutput['toggleFilterSelection'];
}

const SubList = ({
  filterValues,
  filterKey,
  sort,
  toggleFilterSelection,
  isExpanded,
}: SubListProps) => {
  const sortedFilterValueKeys = useMemo(() => {
    if (!sort) {
      return Object.keys(filterValues || {});
    }

    return Object.keys(filterValues || {}).sort(([a], [b]) =>
      String(a).localeCompare(String(b))
    );
  }, [filterValues, sort]);

  return (
    <ul>
      {sortedFilterValueKeys.map((filterValue, index) => (
        <li
          key={index}
          className={
            index > 3 && !isExpanded ? 'ml-3 mt-1 hidden' : 'mx-3 mt-1'
          }
        >
          <label className="flex gap-x-2 cursor-pointer items-center">
            <input
              role="checkbox"
              type="checkbox"
              name={filterKey}
              className={classNames(
                'accent-royal-blue dark:accent-orange-400 w-3 h-3 dark:bg-outer-space dark:min-h-[12px] dark:min-w-[12px]',
                {
                  'dark:appearance-none dark:text-manatee dark:border dark:rounded-[3px]':
                    !filterValues?.[filterValue].selected,
                }
              )}
              checked={filterValues?.[filterValue].selected}
              onChange={() => toggleFilterSelection(filterKey, filterValue)}
            />
            <span className="text-asteriod-black dark:text-bright-gray leading-normal font-semi-thick">
              {String(filterValue)}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SubList;
