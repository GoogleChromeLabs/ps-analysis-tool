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
import React from 'react';

/**
 * Internal dependencies.
 */
import useCookies from '../../useCookies';
import type { Cookies } from '../../../../../../../localStore';
import type { SelectedFilters } from '../../types';
import ListItem from './listItem';
import SearchIcon from '../../../../../../../../icons/third_party/search-icon.svg';

interface FiltersListProps {
  cookies: Cookies;
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const FiltersList = () => {
  const { filters, selectedFilters, setSelectedFilters, setSearchTerm } =
    useCookies(
      ({ state, actions }) =>
        ({
          selectedFilters: state?.selectedFilters,
          filters: state?.filters,
          setSelectedFilters: actions?.setSelectedFilters,
          setSearchTerm: actions?.setSearchTerm,
        } as FiltersListProps)
    );

  const handleOnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (!filters.length) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 relative overflow-hidden">
        <span className="absolute left-0 bottom-[8px]">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Filter.."
          className="p-2 pl-4 pb-1 focus:outline-none outline-none border-b"
          onInput={handleOnInput}
        />
      </div>
      <ul>
        {filters
          .filter((filter) => Boolean(filter.filters?.size))
          .map((filter, index) => (
            <ListItem
              key={index}
              filter={filter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          ))}
      </ul>
    </div>
  );
};

export default FiltersList;
