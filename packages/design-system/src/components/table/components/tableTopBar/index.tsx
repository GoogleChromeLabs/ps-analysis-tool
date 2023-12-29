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
import {
  FilterIcon,
  SearchInput,
  TableOutput,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */

interface TableTopBarProps {
  searchValue: TableOutput['searchValue'];
  setSearchValue: TableOutput['setSearchValue'];
  showFilterSidebar: boolean;
  setShowFilterSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  cookiesCount: number;
  hideFiltering?: boolean;
  disableFiltering?: boolean;
  extraInterface?: React.ReactNode;
}

const TableTopBar = ({
  searchValue,
  setSearchValue,
  showFilterSidebar,
  setShowFilterSidebar,
  cookiesCount,
  hideFiltering = false,
  disableFiltering = false,
  extraInterface = null,
}: TableTopBarProps) => {
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [setSearchValue]
  );

  return (
    <div className="w-full h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-white dark:bg-charleston-green">
      {!hideFiltering && (
        <button
          className={classNames('w-3 h-3 mr-2', {
            'opacity-20': disableFiltering,
          })}
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
          disabled={disableFiltering}
          title="Open filter options"
        >
          <FilterIcon
            className={
              showFilterSidebar && !disableFiltering
                ? 'text-royal-blue dark:text-medium-persian-blue'
                : 'text-mischka'
            }
          />
        </button>
      )}
      <SearchInput
        value={searchValue}
        onChange={handleInput}
        clearInput={() => {
          setSearchValue('');
        }}
      />
      <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />

      {extraInterface}

      <div className="text-right w-full text-xxxs text-secondary">
        Count: {cookiesCount ?? 0}
      </div>
    </div>
  );
};

export default TableTopBar;
