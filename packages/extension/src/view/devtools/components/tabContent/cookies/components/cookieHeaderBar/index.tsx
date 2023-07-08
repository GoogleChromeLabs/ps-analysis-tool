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
import Chips from '../cookieFilter/chips';
import useCookies from '../../useCookies';

const CookieHeaderBar = () => {
  const { selectedFilters, setSelectedFilters } = useCookies(
    ({ state, actions }) => ({
      selectedFilters: state.selectedFilters,
      setSelectedFilters: actions.setSelectedFilters,
    })
  );

  const selectedFilterCount = Object.entries(selectedFilters).reduce(
    (size, [, filters]) => size + filters.size,
    0
  );

  const clearAll = () => {
    setSelectedFilters({});
  };

  if (!selectedFilterCount) {
    return null;
  }

  return (
    <div className="p-2 px-3 border-b flex items-center overflow-y-scroll">
      {selectedFilterCount > 1 && (
        <a
          href="#"
          className="min-w-[46px] text-link mr-3 text-xs"
          onClick={clearAll}
        >
          Clear all
        </a>
      )}
      <Chips />
    </div>
  );
};

export default CookieHeaderBar;
