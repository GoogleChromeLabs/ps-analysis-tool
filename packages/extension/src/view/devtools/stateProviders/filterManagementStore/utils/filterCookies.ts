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
import filterCookiesWithRetentionPeriod from './filterCookiesWithRetentionPeriod';
import filterCookiesWithoutRetentionPeriod from './filterCookiesWithoutRetentionPeriod';

const filterCookies = (
  cookies: {
    [key: string]: CookieTableData;
  },
  selectedFilters: SelectedFilters,
  searchTerm = ''
): {
  [key: string]: CookieTableData;
} => {
  // Case when both filters are present
  if (
    selectedFilters['retentionPeriod'] &&
    Object.keys(selectedFilters).length > 1
  ) {
    const cookiesFilteredWithoutRetentionPeriod =
      filterCookiesWithoutRetentionPeriod(cookies, selectedFilters, searchTerm);
    return filterCookiesWithRetentionPeriod(
      cookiesFilteredWithoutRetentionPeriod,
      selectedFilters,
      searchTerm
    );
  } else if (
    selectedFilters['retentionPeriod'] &&
    Object.keys(selectedFilters).length === 1
  ) {
    // Case when only retention period is present.
    return filterCookiesWithRetentionPeriod(
      cookies,
      selectedFilters,
      searchTerm
    );
  } else if (
    !selectedFilters['retentionPeriod'] &&
    Object.keys(selectedFilters).length >= 1
  ) {
    // All other filters except retention period is present.
    return filterCookiesWithoutRetentionPeriod(
      cookies,
      selectedFilters,
      searchTerm
    );
  }
  // This is when there are no filters but only search term.
  if (searchTerm) {
    const filteredCookies: {
      [key: string]: CookieTableData;
    } = {};
    Object.entries(cookies).forEach(([cookieName, cookieData]) => {
      const matchTerm = () => {
        const lowerCaseTerm = searchTerm.toLowerCase();
        return (
          cookieName.toLowerCase().includes(lowerCaseTerm) ||
          cookieData.parsedCookie.domain?.toLowerCase()?.includes(lowerCaseTerm)
        );
      };
      if (matchTerm()) {
        filteredCookies[cookieName] = cookieData;
      }
    });
    return filteredCookies;
  }
  return cookies;
};

export default filterCookies;
