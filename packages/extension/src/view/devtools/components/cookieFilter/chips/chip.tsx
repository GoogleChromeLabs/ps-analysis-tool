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
import type {
  SelectedFilters,
  Filter,
} from '../../../stateProviders/filterManagementStore/types';
import { FILTER_MAPPING } from '../../../stateProviders/filterManagementStore/constants';
// eslint-disable-next-line import/no-relative-packages
import CrossIcon from '../../../../../../../../third_party/icons/cross-icon.svg';

interface ChipProps {
  text: string;
  setSelectedFilters: (
    update: (prevState: SelectedFilters) => SelectedFilters
  ) => void;
  filterKeys: string;
}

const Chip: React.FC<ChipProps> = ({
  text,
  setSelectedFilters,
  filterKeys,
}) => {
  const handleOnClick = () => {
    setSelectedFilters((prevState) => {
      if (prevState[filterKeys] && prevState[filterKeys].has(text)) {
        prevState[filterKeys].delete(text);

        if (!prevState[filterKeys].size) {
          delete prevState[filterKeys];
        }
      }

      return { ...prevState };
    });
  };

  let label = text;

  if (['True', 'False'].includes(text)) {
    const filterMap =
      FILTER_MAPPING.find((_filterMap: Filter) => {
        return _filterMap.keys === filterKeys;
      }) || ({} as Filter);

    if (filterMap.name) {
      label = filterMap.name + ':' + text;
    }
  }

  return (
    <div className="flex items-center px-2 rounded-sm bg-[#DADCE0] dark:bg-charleston-green mx-1 h-4">
      <span className="block whitespace-nowrap text-[#323941] dark:text-manatee">
        {label}
      </span>
      <button
        onClick={handleOnClick}
        className="w-[6px] h-[6px] text-gray-600 hover:text-gray-800 focus:outline-none ml-1"
      >
        <CrossIcon className="text-[#AFB0B1]" />
      </button>
    </div>
  );
};

export default Chip;
