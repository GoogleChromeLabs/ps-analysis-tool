/*
 * Copyright 2024 Google LLC
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
import { SearchInput } from '@google-psat/design-system';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

interface SearchDropdownProps {
  values: string[];
  onSelect: (value: string) => void;
}

const SearchDropdown = ({ values, onSelect }: SearchDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredValues, setFilteredValues] = useState(values);
  const [closeDropdown, setCloseDropdown] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
      setFilteredValues(
        values.filter((value) =>
          value.toLowerCase().includes(term.toLowerCase())
        )
      );
      setCloseDropdown(false);
    },
    [values]
  );

  const handleSelect = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setFilteredValues(
        values.filter((v) => v.toLowerCase().includes(value.toLowerCase()))
      );
      onSelect(value);
      setCloseDropdown(true);
    },
    [onSelect, values]
  );

  const keyHandler = useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        if (filteredValues.length > 0) {
          const index = filteredValues.findIndex(
            (value) => value === searchTerm
          );
          const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1;

          if (nextIndex < 0) {
            setSearchTerm(filteredValues[filteredValues.length - 1]);
          } else if (nextIndex === filteredValues.length) {
            setSearchTerm(filteredValues[0]);
          } else {
            setSearchTerm(filteredValues[nextIndex]);
          }
        }
      } else if (event.key === 'Enter') {
        if (searchTerm) {
          handleSelect(searchTerm);
        }
      }
    },
    [filteredValues, handleSelect, searchTerm]
  );

  return (
    <div
      className="relative w-full border-b border-american-silver dark:border-quartz px-2 py-0.5 bg-anti-flash-white dark:bg-raisin-black"
      onKeyDown={keyHandler}
    >
      <div className="w-full max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={handleChange}
          clearInput={() => setSearchTerm('')}
          placeholder="Search Topic"
        />
      </div>
      {searchTerm && !closeDropdown && (
        <ul className="absolute left-0 right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredValues.length > 0 ? (
            filteredValues.slice(0, 5).map((value, index) => (
              <li
                key={index}
                className={classNames(
                  'px-2 py-1 cursor-pointer hover:bg-gray-100',
                  {
                    'bg-gray-200': value === searchTerm,
                  }
                )}
                onClick={() => handleSelect(value)}
              >
                {value}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
