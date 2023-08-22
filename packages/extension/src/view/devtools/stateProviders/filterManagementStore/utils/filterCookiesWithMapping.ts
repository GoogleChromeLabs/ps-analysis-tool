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
 * Internal dependencies.
 */
import type { SelectedFilters } from '../types';
import type { CookieTableData } from '../../../cookies.types';
import { CUSTOM_FILTER_MAPPING } from '../constants';
import filterCookiesWithCustomMapping from './filterCookiesWithCustomMapping';
import matchTerm from './matchTerm';
import filterWithCalculatedMapping from './filterCookiesWithCalculatedMapping';

/**
 * Filter cookies based on the selected filters and search term.
 * @param cookies object of cookies
 * @param selectedFilters Set<string> of selected filters
 * @param searchTerm The search term.
 * @returns object of filtered cookies
 */
export default function filterCookiesWithMapping(
  cookies: {
    [key: string]: CookieTableData;
  },
  selectedFilters: SelectedFilters,
  searchTerm = ''
) {
  if (!cookies || (!searchTerm && !Object.keys(selectedFilters).length)) {
    return cookies;
  }

  const filteredCookies = {} as { [key: string]: CookieTableData };
  Object.entries(cookies).forEach(([, cookieData]) => {
    const canShow: boolean[] = [];

    Object.entries(selectedFilters).forEach(([keys, selectedFilter]) => {
      if (
        !Object.values(CUSTOM_FILTER_MAPPING)
          .map((value) => value.keys)
          .includes(keys)
      ) {
        canShow.push(
          filterWithCalculatedMapping(keys, cookieData, selectedFilter)
        );
      } else {
        canShow.push(
          filterCookiesWithCustomMapping(selectedFilter, cookieData, keys)
        );
      }
    });

    if (canShow.length > 0 && !canShow.includes(false)) {
      matchTerm(searchTerm, cookieData, filteredCookies);
    }
  });

  return filteredCookies;
}
