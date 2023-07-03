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

interface Filter {
  name: string;
  keys: string;
  filters?: Set<string>;
}

interface FiltersListProps {
  cookies: Cookies;
  setSelectedFilters: (Filter) => void;
}

const FiltersList = ({ cookies, setSelectedFilters }: FiltersListProps) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  const handleFilterChange = (
    checked: boolean,
    filterKeys: string,
    filterValue: string
  ) => {
    setSelectedFilters((prevState: Filter) => {
      const newValue = prevState[filterKeys]
        ? prevState[filterKeys]
        : new Set();

      if (checked) {
        newValue.add(filterValue);
      } else {
        newValue.delete(filterValue);
      }

      return {
        ...prevState,
        [filterKeys]: newValue,
      };
    });
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
      <ul>
        {filters
          .filter((filter) => Boolean(filter.filters?.size))
          .map((filter, index) => (
            <li key={index} className="mb-4">
              <p className="font-bold">{filter.name}</p>
              <ul>
                {[...filter.filters].sort().map((filterValue, subIndex) => (
                  <li className="ml-2 mt-1" key={subIndex}>
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
                      <span>{filterValue}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FiltersList;
