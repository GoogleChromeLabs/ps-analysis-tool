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
import ListItem from './listItem';
import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';

const FiltersList = () => {
  const { filters, selectedFilters, setSelectedFilters } =
    useFilterManagementStore(({ state, actions }) => ({
      filters: state.filters,
      selectedFilters: state.selectedFilters,
      setSelectedFilters: actions.setSelectedFilters,
    }));

  if (!filters.length) {
    return null;
  }

  return (
    <ul>
      {filters
        .filter((filter) => Boolean(filter.filters?.size))
        .map((filter, index) => (
          <ListItem
            key={index}
            filter={filter}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        ))}
    </ul>
  );
};

export default FiltersList;
