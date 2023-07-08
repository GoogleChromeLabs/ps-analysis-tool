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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import getFilters from '../../utils/getFilters';
import useCookies from '../../useCookies';
import type { Cookies } from '../../../../../../../localStore';
import type { Filter, SelectedFilters } from '../../types';

interface FiltersListProps {
  cookies: Cookies;
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const FiltersList = () => {
  const { cookies, selectedFilters, setSelectedFilters, setSearchTerm } =
    useCookies(
      ({ state, actions }) =>
        ({
          cookies: state?.cookies,
          selectedFilters: state?.selectedFilters,
          setSelectedFilters: actions?.setSelectedFilters,
          setSearchTerm: actions?.setSearchTerm,
        } as FiltersListProps)
    );

  const [filters, setFilters] = useState<Filter[]>([]);
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const handleFilterChange = (
    checked: boolean,
    keys: string,
    value: string
  ) => {
    setSelectedFilters((prevState: SelectedFilters) => {
      const newValue: SelectedFilters = { ...prevState };
      const newValueForKey: Set<string> = newValue[keys] || new Set<string>();

      if (checked) {
        newValueForKey.add(value);
      } else {
        newValueForKey.delete(value);
      }

      if (newValueForKey.size) {
        newValue[keys] = newValueForKey;
      } else {
        delete newValue[keys];
      }

      return newValue;
    });
  };

  const handleShowMoreClick = () => {
    setExpanded(!isExpanded);
  };

  const handleOnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const updatedFilters = getFilters(cookies);
    setFilters(updatedFilters);
  }, [cookies]);

  if (!filters.length) {
    return null;
  }

  return (
    <div className="pt-2">
      <div className="mb-3">
        <input
          type="search"
          placeholder="Filter.."
          className="p-2 pl-0 pb-1 focus:outline-none outline-none border-b"
          onInput={handleOnInput}
        />
      </div>
      <ul>
        {filters
          .filter((filter) => Boolean(filter.filters?.size))
          .map((filter, index) => (
            <li key={index} className="mb-4">
              <p className="font-bold">{filter.name}</p>
              <ul>
                {filter?.filters &&
                  [...filter.filters].sort().map((filterValue, subIndex) => (
                    <li
                      className={
                        subIndex > 3 && !isExpanded
                          ? 'ml-2 mt-1 hidden'
                          : 'ml-2 mt-1'
                      }
                      key={subIndex}
                    >
                      <label className="flex gap-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name={filter.keys}
                          checked={Boolean(
                            selectedFilters[filter.keys] &&
                              selectedFilters[filter.keys].has(filterValue)
                          )}
                          onChange={(event) =>
                            handleFilterChange(
                              event?.target?.checked,
                              filter.keys,
                              filterValue
                            )
                          }
                        />
                        <span>{String(filterValue)}</span>
                      </label>
                    </li>
                  ))}
              </ul>
              {Number(filter?.filters?.size) > 4 && (
                <a
                  onClick={handleShowMoreClick}
                  className="text-md text-link ml-2 mt-1 block"
                  href="#"
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </a>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FiltersList;
