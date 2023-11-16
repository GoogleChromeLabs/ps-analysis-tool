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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import { ClearIcon } from '../../icons';

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
}

const SearchInput = ({ value, onChange, clearInput }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label
      className={`cursor-text dark:bg-charleston-green hover:bg-lotion dark:text-bright-gray border rounded flex justify-between items-center mx-[3px] my-px px-[3px] pt-0.5 pb-px box-content ${
        isFocused || value
          ? 'dark:border-baby-blue-eyes'
          : 'dark:border-davys-grey'
      }`}
    >
      <input
        type="text"
        className="h-[14px] w-56 outline-none bg-inherit"
        placeholder="Search"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <button
        onClick={clearInput}
        className={`w-3 h-3 flex items-center justify-center ${
          value ? 'visible' : 'invisible'
        }`}
        title="Clear Search"
      >
        <ClearIcon />
      </button>
    </label>
  );
};

export default SearchInput;
