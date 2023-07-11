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
import useCookies from '../../useCookies';
import type { CookieData, Cookies } from '../../../../../../../localStore';

interface CookieListProps {
  cookies: Cookies;
  selectedKey: string | null;
  onClickItem: (key: string) => void;
}

const CookieList = () => {
  const { cookies, selectedKey, selectedFilters, searchTerm, onClickItem } =
    useCookies(
      ({ state, actions }) =>
        ({
          cookies: state?.filteredCookies,
          selectedKey: state?.selectedKey,
          selectedFilters: state?.selectedFilters,
          searchTerm: state?.searchTerm,
          onClickItem: actions?.setSelectedKey,
        } as CookieListProps)
    );

  if (!Object.entries(cookies).length) {
    if (Object.entries(selectedFilters).length) {
      return (
        <div className="h-full items-center justify-center flex">
          <p className="p-3 text-sm">
            No cookies found for the selected filters
          </p>
        </div>
      );
    } else if (searchTerm) {
      return (
        <div className="h-full items-center justify-center flex">
          <p className="p-3 text-sm">No cookies found for {searchTerm}</p>
        </div>
      );
    }
  }

  return (
    <ul className="w-full h-full" data-testid="cookie-list-column">
      {cookies &&
        Object.entries(cookies).map(([key, value]) => (
          <li key={key}>
            <ListItem
              cookie={value as CookieData}
              isSelected={selectedKey === key}
              onClick={() => onClickItem(key)}
            />
          </li>
        ))}
    </ul>
  );
};

export default CookieList;
