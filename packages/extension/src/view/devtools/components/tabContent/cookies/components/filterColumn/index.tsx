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
import getFilters from './getFilters';
import type { Cookies } from '../../../../../../../localStore';
import Chips from './chips';

interface Filter {
  name: string;
  keys: string;
  filters?: Set<string>;
  type?: string;
  default?: string;
}

interface FiltersListProps {
  cookies: Cookies;
  setSelectedFilters: (Filter) => void;
  setSearchTerm: (string) => void;
}

type SelectedFilters = {
  [keys: string]: Set<string>;
};

const FiltersList = ({
  cookies,
  setSelectedFilters,
  setSearchTerm,
}: FiltersListProps) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isExpanded, setExpanded] = useState(false);

  const handleFilterChange = (
    checked: boolean,
    keys: string,
    value: string
  ) => {
    setSelectedFilters((prevState: SelectedFilters) => {
      const newValue = prevState[keys] ? prevState[keys] : new Set();

      if (checked) {
        newValue.add(value);
      } else {
        newValue.delete(value);
      }

      if (newValue.size) {
        return {
          ...prevState,
          [keys]: newValue,
        };
      } else {
        delete prevState[keys];

        return {
          ...prevState,
        };
      }
    });
  };

  const handleShowMoreClick = () => {
    setExpanded(!isExpanded);
  };

  const handleOnInput = (event) => {
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
      <div className="my-2">
        <Chips />
      </div>
      <ul>
        {filters
          .filter((filter) => Boolean(filter.filters?.size))
          .map((filter, index) => (
            <li key={index} className="mb-4">
              <p className="font-bold">{filter.name}</p>
              <ul>
                {[...filter.filters].sort().map((filterValue, subIndex) => (
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
                        value={filterValue}
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
              {filter.filters?.size > 4 && (
                <a
                  onClick={handleShowMoreClick}
                  className="text-md text-[#007185] ml-2 mt-1 block"
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
