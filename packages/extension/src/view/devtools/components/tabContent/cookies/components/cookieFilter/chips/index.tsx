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
import Chip from './chip';
import type { SelectedFilters } from '../../../types';
import useCookies from '../../../useCookies';

interface ChipsProps {
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  selectedFilters: SelectedFilters;
}

const Chips: React.FC = () => {
  const { selectedFilters, setSelectedFilters } = useCookies(
    ({ state, actions }) =>
      ({
        selectedFilters: state.selectedFilters,
        setSelectedFilters: actions.setSelectedFilters,
      } as ChipsProps)
  );

  if (!Object.keys(selectedFilters).length) {
    return null;
  }

  return (
    <div className="flex flex-nowrap max-w-full">
      {Object.entries(selectedFilters).map(([keys, filters]) => {
        return [...filters].map((filterName, index) => (
          <Chip
            key={keys + index}
            text={filterName}
            filterKeys={keys}
            setSelectedFilters={setSelectedFilters}
          />
        ));
      })}
    </div>
  );
};

export default Chips;
