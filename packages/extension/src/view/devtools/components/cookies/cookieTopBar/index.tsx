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

/**
 * Internal dependencies.
 */

// eslint-disable-next-line import/no-relative-packages
import FilterIcon from '../../../../../../../../third_party/icons/filter-icon.svg';
// eslint-disable-next-line import/no-relative-packages
import CrossIcon from '../../../../../../../../third_party/icons/cross-icon.svg';
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';

interface CookieSearchProps {
  cookiesAvailable: boolean;
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
}

const CookieSearch = ({
  cookiesAvailable,
  isFilterMenuOpen,
  toggleFilterMenu,
}: CookieSearchProps) => {
  const { searchTerm, setSearchTerm } = useFilterManagementStore(
    ({ state, actions }) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: actions.setSearchTerm,
    })
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  return (
    <div className="w-full h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
      <button
        className={classNames('w-3 h-3', {
          'opacity-20': !cookiesAvailable,
        })}
        onClick={toggleFilterMenu}
        title="Open filter options"
        disabled={!cookiesAvailable}
      >
        <FilterIcon
          className={
            isFilterMenuOpen
              ? 'text-royal-blue dark:text-medium-persian-blue'
              : 'text-mischka'
          }
        />
      </button>
      <input
        type="text"
        className="h-5 w-80 mx-2 p-2 outline-none dark:bg-charleston-green border-[1px] border-gainsboro dark:border-quartz focus:border-royal-blue focus:dark:border-medium-persian-blue dark:text-bright-gray text-outer-space-crayola"
        placeholder="Search"
        value={searchTerm}
        onInput={handleInput}
      />
      <button
        onClick={() => {
          setSearchTerm('');
        }}
        className="w-3 h-3"
        title="Clear Search"
      >
        <CrossIcon className="text-mischka" />
      </button>
    </div>
  );
};

export default CookieSearch;
