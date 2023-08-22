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
import { CUSTOM_FILTER_MAPPING, RetentionPeriodFilter } from '../constants';
import getFilterValue from './getFilterValue';

const filterCookiesWithRetentionPeriod = (
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
    let canShow = false;

    const matchTerm = () => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        cookieName.toLowerCase().includes(lowerCaseTerm) ||
        cookieData.parsedCookie.domain?.toLowerCase()?.includes(lowerCaseTerm)
      );
    };

    if (Object.keys(selectedFilters).length) {
      Object.entries(selectedFilters).forEach(([keys, selectedFilter]) => {
        if (keys === CUSTOM_FILTER_MAPPING.retentionPeriod.keys) {
          selectedFilter.forEach((retentionFilter) => {
            if (canShow) {
              return;
            }

            const value = getFilterValue(keys, cookieData);
            switch (retentionFilter) {
              case RetentionPeriodFilter.Session:
                canShow = value === 0;
                break;
              case RetentionPeriodFilter.ShortTerm:
                if (typeof value === 'string') {
                  const diff = Date.parse(value) - Date.now();
                  canShow = diff < 86400000;
                }
                break;
              case RetentionPeriodFilter.MediumTerm:
                if (typeof value === 'string') {
                  const diff = Date.parse(value) - Date.now();
                  canShow = diff >= 86400000 && diff < 604800000;
                }
                break;
              case RetentionPeriodFilter.LongTerm:
                if (typeof value === 'string') {
                  const diff = Date.parse(value) - Date.now();
                  canShow = diff >= 604800000 && diff < 2629743833;
                }
                break;
              case RetentionPeriodFilter.ExtendedTerm:
                if (typeof value === 'string') {
                  const diff = Date.parse(value) - Date.now();
                  canShow = diff >= 2629743833;
                }
                break;
              default:
            }
          });
        }
      });

      if (canShow) {
        if (searchTerm) {
          if (matchTerm()) {
            filteredCookies[cookieName] = cookieData;
          }
        } else {
          filteredCookies[cookieName] = cookieData;
        }
      }
    }
  });
  return filteredCookies;
};

export default filterCookiesWithRetentionPeriod;
