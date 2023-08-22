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
import { FILTER_MAPPING, CUSTOM_FILTER_MAPPING } from '../constants';
import getFilterValue from './getFilterValue';
import { filterCookiesWithCustomMapping } from './filterCookiesWithCustomMapping';
import { matchTerm } from './matchTerm';

const filterCookiesWithoutRetentionPeriod = (
  cookies: {
    [key: string]: CookieTableData;
  },
  selectedFilters: SelectedFilters,
  searchTerm = ''
): {
  [key: string]: CookieTableData;
} => {
  const filteredCookies: {
    [key: string]: CookieTableData;
  } = {};

  if (!cookies || (!searchTerm && !Object.keys(selectedFilters).length)) {
    return cookies;
  }

  Object.entries(cookies).forEach(([cookieName, cookieData]) => {
    const canShow: boolean[] = [];

    if (Object.keys(selectedFilters).length) {
      Object.entries(selectedFilters).forEach(([keys, selectedFilter]) => {
        if (
          !Object.values(CUSTOM_FILTER_MAPPING)
            .map((value) => value.keys)
            .includes(keys)
        ) {
          let value = getFilterValue(keys, cookieData);
          const filterMap = FILTER_MAPPING.find(
            (config) => config.keys === keys
          );

          if (!value && filterMap?.default) {
            value = filterMap.default;
          }

          canShow.push(selectedFilter?.has(value));
        } else {
          canShow.push(
            filterCookiesWithCustomMapping(selectedFilter, cookieData, keys)
          );
        }
      });

      if (canShow.length > 0 && !canShow.includes(false)) {
        if (searchTerm) {
          if (matchTerm(searchTerm, cookieData)) {
            filteredCookies[cookieName] = cookieData;
          }
        } else {
          filteredCookies[cookieName] = cookieData;
        }
      }
    } else {
      if (matchTerm(searchTerm, cookieData)) {
        filteredCookies[cookieName] = cookieData;
      }
    }
  });

  return filteredCookies;
};

export default filterCookiesWithoutRetentionPeriod;
