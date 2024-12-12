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
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { FilterIcon } from '../../icons';
import SearchInput from '../searchInput';

interface TopBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  showFilterSidebar: boolean;
  setShowFilterSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  hideFiltering?: boolean;
  disableFiltering?: boolean;
  hideSearch?: boolean;
  count?: number;
  children?: React.ReactNode;
}

const TopBar = ({
  searchValue,
  setSearchValue,
  showFilterSidebar,
  setShowFilterSidebar,
  hideFiltering = false,
  disableFiltering = false,
  hideSearch,
  count,
  children,
}: TopBarProps) => {
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [setSearchValue]
  );

  return (
    <div
      className={classNames(
        'w-full px-2 flex items-center border-american-silver dark:border-quartz bg-white dark:bg-charleston-green',
        { 'border-b': !hideFiltering },
        hideSearch && hideFiltering ? 'h-[20px]' : 'h-[25px]'
      )}
    >
      {!hideFiltering && (
        <button
          className={classNames('w-3 h-3 mr-2', {
            'opacity-20': disableFiltering,
          })}
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
          disabled={disableFiltering}
          title={I18n.getMessage('openFilterOptions')}
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
      {!hideSearch && (
        <>
          <SearchInput
            value={searchValue}
            onChange={handleInput}
            clearInput={() => {
              setSearchValue('');
            }}
          />
          <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />
        </>
      )}

      <div className="flex gap-3 justify-center items-center h-full">
        {children}
      </div>

      <div className="text-right w-full text-xxxs text-secondary dark:text-chinese-silver">
        {I18n.getMessage('count')}: {count ?? 0}
      </div>
    </div>
  );
};

export default TopBar;
