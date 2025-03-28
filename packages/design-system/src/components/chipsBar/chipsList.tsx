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
import { ChipsFilter } from '.';
import Chip from './chip';

interface ChipListProps {
  selectedFilters: ChipsFilter[];
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean
  ) => void;
  hideCloseIcon?: boolean;
}

const ChipList = ({
  selectedFilters,
  toggleFilterSelection,
  hideCloseIcon = false,
}: ChipListProps) => {
  return (
    <div className="flex flex-nowrap max-w-full">
      {selectedFilters.map((filter) => {
        return filter.values.map((value) => (
          <Chip
            key={value}
            filterTitle={filter.title}
            value={value}
            toggleFilterSelection={() => {
              toggleFilterSelection(filter.key, value, true);
            }}
            hideCloseIcon={hideCloseIcon}
          />
        ));
      })}
    </div>
  );
};

export default ChipList;
