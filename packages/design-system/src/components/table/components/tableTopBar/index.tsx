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
  ClearIcon,
  FilterIcon,
  RefreshButton,
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
  getCookiesSetByJavascript?: () => void;
  cookiesCount: number;
  disableFiltering?: boolean;
}

const TableTopBar = ({
  searchValue,
  setSearchValue,
  showFilterSidebar,
  setShowFilterSidebar,
  getCookiesSetByJavascript,
  cookiesCount,
  disableFiltering = false,
}: TableTopBarProps) => {
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [setSearchValue]
  );

  return (
    <div className="w-full h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
      {!disableFiltering && (
        <button
          className={classNames('w-3 h-3')}
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
          title="Open filter options"
        >
          <FilterIcon
            className={
              showFilterSidebar
                ? 'text-royal-blue dark:text-medium-persian-blue'
                : 'text-mischka'
            }
          />
        </button>
      )}
      <input
        type="text"
        className="text-xs h-5 w-80 mx-2 p-2 outline-none dark:bg-charleston-green border-[1px] border-gainsboro dark:border-quartz focus:border-royal-blue focus:dark:border-medium-persian-blue dark:text-bright-gray text-outer-space-crayola"
        placeholder="Search"
        value={searchValue}
        onInput={handleInput}
      />
      <button
        onClick={() => {
          setSearchValue('');
        }}
        className="w-3 h-3"
        title="Clear Search"
      >
        <ClearIcon className="text-mischka" />
      </button>
      <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />

      {getCookiesSetByJavascript && (
        <RefreshButton onClick={getCookiesSetByJavascript} />
      )}

      <div className="text-right w-full text-xxxs text-secondary">
        Count: {cookiesCount ?? 0}
      </div>
    </div>
  );
};

export default TableTopBar;
