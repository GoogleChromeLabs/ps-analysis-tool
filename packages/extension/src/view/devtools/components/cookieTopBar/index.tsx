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

/**
 * Internal dependencies.
 */

// eslint-disable-next-line import/no-relative-packages
import FilterIcon from '../../../../../../../third_party/icons/filter-icon.svg';
import { useFilterManagementStore } from '../../stateProviders/filterManagementStore';

interface CookieSearchProps {
  toggleFilterMenu: () => void;
}

const CookieSearch = ({ toggleFilterMenu }: CookieSearchProps) => {
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
    <div className="w-full h-full px-2 flex items-center border-b border-american-silver bg-anti-flash-white">
      <button className="w-3 h-3" onClick={toggleFilterMenu}>
        <FilterIcon />
      </button>
      <input
        type="search"
        className="h-5 w-80 mx-2 p-2 outline-none border-[1px] border-[#DADCE0] focus:border-royal-blue"
        placeholder="Search"
        value={searchTerm}
        onInput={handleInput}
      />
    </div>
  );
};

export default CookieSearch;
