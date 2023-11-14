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
  TextInput,
  RefreshButton,
} from '@ps-analysis-tool/design-system';
import type { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

interface CookieSearchProps {
  cookiesAvailable: boolean;
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
  filteredCookies: CookieTableData[];
}

const CookieSearch = ({
  cookiesAvailable,
  isFilterMenuOpen,
  toggleFilterMenu,
  filteredCookies,
}: CookieSearchProps) => {
  const { searchTerm, setSearchTerm } = useFilterManagementStore(
    ({ state, actions }) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: actions.setSearchTerm,
    })
  );

  const { getCookiesSetByJavascript } = useCookieStore(({ actions }) => ({
    getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
  }));

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  return (
    <div className="w-full h-7 px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
      <button
        className={classNames('w-3 h-3 mr-2', {
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
      <TextInput
        value={searchTerm}
        onChange={handleInput}
        clearInput={() => setSearchTerm('')}
      />
      <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />

      <RefreshButton onClick={getCookiesSetByJavascript} />

      <div className="text-right w-full text-xxxs text-secondary">
        Count: {Number(filteredCookies?.length) || 0}
      </div>
    </div>
  );
};

export default CookieSearch;
