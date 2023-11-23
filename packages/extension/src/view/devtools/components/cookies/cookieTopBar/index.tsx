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
import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */

// eslint-disable-next-line import/no-relative-packages
import FilterIcon from '../../../../../../../../third_party/icons/filter-icon.svg';
// eslint-disable-next-line import/no-relative-packages
import CrossIcon from '../../../../../../../../third_party/icons/cross-icon.svg';
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import { type CookieTableData, getCookieKey } from '@ps-analysis-tool/common';
import {
  ClearAll,
  RefreshButton,
  CrossIcon as ClearSingle,
} from '@ps-analysis-tool/design-system';
import getNextIndexToDelete from '../../../../../utils/getNextIndexToDelete';

interface CookieSearchProps {
  cookiesAvailable: boolean;
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
  filteredCookies: CookieTableData[];
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
}

const CookieSearch = ({
  cookiesAvailable,
  isFilterMenuOpen,
  toggleFilterMenu,
  filteredCookies,
  selectedFrameCookie,
  setSelectedFrameCookie,
}: CookieSearchProps) => {
  const { searchTerm, setSearchTerm } = useFilterManagementStore(
    ({ state, actions }) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: actions.setSearchTerm,
    })
  );

  const cookieDeletedRef = useRef(false);
  const selectedCookieIndexRef = useRef(-1);
  const isAnyCookieSelected =
    cookieDeletedRef.current && !selectedFrameCookie
      ? true
      : selectedFrameCookie
      ? true
      : false;
  const { deleteCookie, deleteAllCookies, getCookiesSetByJavascript } =
    useCookieStore(({ actions }) => ({
      deleteCookie: actions.deleteCookie,
      deleteAllCookies: actions.deleteAllCookies,
      getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
    }));

  const handleDeleteCookie = useCallback(() => {
    const selectedKey =
      cookieDeletedRef.current && !selectedFrameCookie
        ? Object.values(filteredCookies)[
            getNextIndexToDelete(
              selectedCookieIndexRef.current,
              Object.keys(filteredCookies).length
            )
          ]
        : Object.values(selectedFrameCookie ?? {})[0];

    if (selectedKey !== null && selectedKey.parsedCookie) {
      const cookieKey = getCookieKey(selectedKey?.parsedCookie);
      if (cookieKey) {
        selectedCookieIndexRef.current = Object.values(
          filteredCookies
        ).findIndex(
          (cookie) => getCookieKey(cookie.parsedCookie) === cookieKey
        );

        deleteCookie(cookieKey);
        cookieDeletedRef.current = true;
        setSelectedFrameCookie(null);
      }
    }
  }, [
    deleteCookie,
    filteredCookies,
    selectedFrameCookie,
    setSelectedFrameCookie,
  ]);

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
      <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />

      <RefreshButton onClick={getCookiesSetByJavascript} />

      <button
        disabled={!isAnyCookieSelected}
        onClick={handleDeleteCookie}
        className={`flex items-center text-center dark:text-mischka  ${
          isAnyCookieSelected
            ? 'text-comet-black hover:text-comet-grey hover:dark:text-bright-gray active:dark:text-mischka active:text-comet-black'
            : 'text-mischka dark:text-dark-gray'
        } mx-2`}
        title="Delete selected cookie"
      >
        <ClearSingle className="rotate-45" />
      </button>
      <button
        disabled={!cookiesAvailable}
        onClick={deleteAllCookies}
        className={`flex h-full items-end dark:text-mischka ${
          cookiesAvailable
            ? 'text-comet-black hover:text-comet-grey hover:dark:text-bright-gray active:dark:text-mischka active:text-comet-black'
            : 'text-mischka dark:text-dark-gray'
        }`}
        title="Delete all cookies"
      >
        <ClearAll />
      </button>
      <div className="text-right w-full text-xxxs text-secondary">
        Count: {Number(filteredCookies?.length) || 0}
      </div>
    </div>
  );
};

export default CookieSearch;
