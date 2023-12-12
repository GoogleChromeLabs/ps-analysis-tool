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
import { ClearIcon } from '../../../../../icons';

interface ChipProps {
  filterTitle: string;
  value: string;
  toggleFilterSelection: () => void;
}

const Chip = ({ filterTitle, value, toggleFilterSelection }: ChipProps) => {
  return (
    <div className="flex items-center px-2 rounded-sm bg-gainsboro dark:bg-charleston-green mx-1 h-4">
      <span className="block whitespace-nowrap text-onyx dark:text-manatee text-xs">
        {filterTitle + ': ' + value}
      </span>
      <button
        onClick={toggleFilterSelection}
        className="w-1.5 h-1.5 text-gray-600 hover:text-gray-800 focus:outline-none ml-1"
      >
        <ClearIcon className="text-mischka" />
      </button>
    </div>
  );
};

export default Chip;
