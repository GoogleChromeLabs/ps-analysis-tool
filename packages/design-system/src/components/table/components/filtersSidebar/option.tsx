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
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { noop } from '@ps-analysis-tool/common';

interface OptionProps {
  filterKey: string;
  filterValue: string;
  selected: boolean;
  toggleFilterSelection: (filterKey: string, filterValue: string) => void;
  isExpanded: boolean;
}

const Option = ({
  filterKey,
  filterValue,
  selected,
  toggleFilterSelection,
  isExpanded,
}: OptionProps) => {
  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFilterSelection(filterKey, filterValue);
    },
    [filterKey, filterValue, toggleFilterSelection]
  );

  return (
    <li
      className={isExpanded ? 'mx-3 mt-1' : 'ml-3 mt-1 hidden'}
      data-testid="sub-list-item"
      onClick={handleOnClick}
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
                !selected,
            }
          )}
          checked={selected}
          onChange={noop}
        />
        <span className="text-asteriod-black dark:text-bright-gray leading-normal font-semi-thick">
          {String(filterValue)}
        </span>
      </label>
    </li>
  );
};

export default Option;
