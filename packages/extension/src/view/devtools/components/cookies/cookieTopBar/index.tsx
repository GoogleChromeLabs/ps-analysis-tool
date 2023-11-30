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
import { type CookieTableData, getCookieKey } from '@ps-analysis-tool/common';
import {
  ClearAll,
  RefreshButton,
  CrossIcon as ClearSingle,
  FilterIcon,
  SearchInput,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
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

  const selectedCookieIndex = useRef(-1);

  const isAnyCookieSelected = !selectedFrameCookie
    ? filteredCookies.length > 0
      ? true
      : false
    : selectedFrameCookie &&
      selectedFrameCookie[Object.keys(selectedFrameCookie)[0]]
    ? true
    : false;

  const {
    deleteCookie,
    deleteAllCookies,
    getCookiesSetByJavascript,
    selectedFrame,
  } = useCookieStore(({ state, actions }) => ({
    deleteCookie: actions.deleteCookie,
    deleteAllCookies: actions.deleteAllCookies,
    getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
    selectedFrame: state.selectedFrame,
  }));

  const handleDeleteCookie = useCallback(() => {
    const selectedIndex = getNextIndexToDelete(
      selectedCookieIndex.current,
      filteredCookies.length
    );
    const selectedKey = !selectedFrameCookie
      ? selectedIndex
        ? filteredCookies[selectedIndex]
        : null
      : Object.values(selectedFrameCookie ?? {})[0];

    if (selectedKey !== null && selectedKey.parsedCookie) {
      const cookieKey = getCookieKey(selectedKey?.parsedCookie);
      if (cookieKey) {
        selectedCookieIndex.current = filteredCookies.findIndex(
          (cookie) => getCookieKey(cookie.parsedCookie) === cookieKey
        );
        deleteCookie(cookieKey);
        const index = getNextIndexToDelete(
          selectedCookieIndex.current,
          filteredCookies.length - 1
        );
        const filteredRows = filteredCookies.filter((cookie) => {
          return (
            cookie.parsedCookie.name +
              cookie.parsedCookie.domain +
              cookie.parsedCookie.path !==
            cookieKey
          );
        });

        if (index !== null && selectedFrame) {
          setSelectedFrameCookie({
            [selectedFrame]: filteredRows[index],
          });
        }
      }
    }
  }, [
    deleteCookie,
    filteredCookies,
    selectedFrameCookie,
    setSelectedFrameCookie,
    selectedFrame,
  ]);

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
      <SearchInput
        value={searchTerm}
        onChange={handleInput}
        clearInput={() => setSearchTerm('')}
      />
      <div className="h-full w-px bg-american-silver dark:bg-quartz mx-3" />

      <RefreshButton onClick={getCookiesSetByJavascript} />

      <button
        disabled={!isAnyCookieSelected}
        onClick={handleDeleteCookie}
        className={`flex items-center text-center ${
          isAnyCookieSelected
            ? 'text-comet-black dark:text-mischka hover:text-comet-grey hover:dark:text-bright-gray active:dark:text-mischka active:text-comet-black'
            : 'text-mischka dark:text-dark-gray'
        } mx-2`}
        title="Delete selected cookie"
      >
        <ClearSingle className="rotate-45" />
      </button>
      <button
        disabled={!cookiesAvailable}
        onClick={deleteAllCookies}
        className={`flex h-full items-end ${
          cookiesAvailable
            ? 'text-comet-black dark:text-mischka hover:text-comet-grey hover:dark:text-bright-gray active:dark:text-mischka active:text-comet-black'
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
