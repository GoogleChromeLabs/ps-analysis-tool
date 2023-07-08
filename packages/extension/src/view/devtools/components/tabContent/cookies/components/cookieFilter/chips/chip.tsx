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
import type { SelectedFilters } from '../../../types';

interface ChipProps {
  text: string;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  filterKey: string;
}

const Chip: React.FC<ChipProps> = ({ text, setSelectedFilters, filterKey }) => {
  const handleOnClick = () => {
    setSelectedFilters((prevState) => {
      if (prevState[filterKey] && prevState[filterKey].has(text)) {
        prevState[filterKey].delete(text);

        if (!prevState[filterKey].size) {
          delete prevState[filterKey];
        }
      }

      return { ...prevState };
    });
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full text-xs text-gray-700 px-2 py-1 mr-1">
      <span className="mr-1 block whitespace-nowrap">{text}</span>
      <button
        onClick={handleOnClick}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        x
      </button>
    </div>
  );
};

export default Chip;
