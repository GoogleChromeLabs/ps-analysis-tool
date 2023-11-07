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
import { type CookieTableData, getCookieKey } from '@ps-analysis-tool/common';
import { ClearAll, RefreshButton } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */

// eslint-disable-next-line import/no-relative-packages
import FilterIcon from '../../../../../../../../third_party/icons/filter-icon.svg';
// eslint-disable-next-line import/no-relative-packages
import CrossIcon from '../../../../../../../../third_party/icons/cross-icon.svg';
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

interface CookieSearchProps {
  cookiesAvailable: boolean;
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
  filteredCookies: CookieTableData[];
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
}

const CookieSearch = ({
  cookiesAvailable,
  isFilterMenuOpen,
  toggleFilterMenu,
  filteredCookies,
  selectedFrameCookie,
}: CookieSearchProps) => {
  const { searchTerm, setSearchTerm } = useFilterManagementStore(
    ({ state, actions }) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: actions.setSearchTerm,
    })
  );

  const { deleteCookie, deleteAllCookies } = useCookieStore(({ actions }) => ({
    deleteCookie: actions.deleteCookie,
    deleteAllCookies: actions.deleteAllCookies,
  }));

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
    <div className="w-full h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
      <div className="flex items-center bg-anti-flash-white dark:bg-charleston-green">
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
      <div className="border-l border-american-silver dark:border-quartz px-2 h-full flex items-center justify-center">
        <button
          onClick={() => {
            const selectedKey = Object.values(selectedFrameCookie ?? {})[0];
            if (selectedKey !== null && selectedKey.parsedCookie) {
              const cookieKey = getCookieKey(selectedKey?.parsedCookie);
              if (cookieKey) {
                deleteCookie(cookieKey);
              }
            }
          }}
          className="w-3 h-3 flex items-center"
          title="Delete cookie"
        >
          <CrossIcon className="text-mischka" />
        </button>
        <div className="h-full w-px bg-american-silver dark:bg-quartz mx-2" />
        <button
          onClick={deleteAllCookies}
          className="w-3 h-3 flex items-center"
          title="Delete all cookies"
        >
          <ClearAll className="text-mischka" />
        </button>
        <div className="h-full w-px bg-american-silver dark:bg-quartz mx-2" />
        <RefreshButton onClick={getCookiesSetByJavascript} />
        <div className="text-right w-full text-xxxs text-secondary">
          Count: {Number(filteredCookies?.length) || 0}
        </div>
      </div>
    </div>
  );
};

export default CookieSearch;
