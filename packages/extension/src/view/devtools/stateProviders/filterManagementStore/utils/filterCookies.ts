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
import { FILTER_MAPPING, RETENTION_PERIOD_FILTER } from '../constants';
import getFilterValue from './getFilterValue';

const filterCookies = (
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

    const matchTerm = () => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        cookieName.toLowerCase().includes(lowerCaseTerm) ||
        cookieData.parsedCookie.domain?.toLowerCase()?.includes(lowerCaseTerm)
      );
    };

    if (Object.keys(selectedFilters).length) {
      Object.entries(selectedFilters).forEach(([keys, selectedFilter]) => {
        if (keys !== RETENTION_PERIOD_FILTER.keys) {
          let value = getFilterValue(keys, cookieData);
          const filterMap = FILTER_MAPPING.find(
            (config) => config.keys === keys
          );

          if ('boolean' === filterMap?.type) {
            if (filterMap.keys === 'isFirstParty') {
              value = !value ? 'True' : 'False';
            } else {
              value = value ? 'True' : 'False';
            }
          }

          if (!value && filterMap?.default) {
            value = filterMap.default;
          }

          canShow.push(selectedFilter?.has(value));
        }
      });

      if (canShow.length > 0 && !canShow.includes(false)) {
        if (searchTerm) {
          if (matchTerm()) {
            filteredCookies[cookieName] = cookieData;
          }
        } else {
          filteredCookies[cookieName] = cookieData;
        }
      }
    } else {
      if (matchTerm()) {
        filteredCookies[cookieName] = cookieData;
      }
    }
  });

  return filteredCookies;
};

export default filterCookies;
