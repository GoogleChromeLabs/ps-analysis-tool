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
import type { CookieTableData } from '../../../cookies.types';
import { CUSTOM_FILTER_MAPPING } from '../constants';
import getFilterValue from './getFilterValue';

/**
 * Filter cookies based on the scope of the cookie.
 * @param selectedFilter Set<string> of selected filters
 * @param cookieData CookieTableData object to be filtered
 * @param keys string of the filter key
 * @returns boolean whether the cookie should be shown or not
 */
export function filterCookiesWithCustomMapping(
  selectedFilter: Set<string>,
  cookieData: CookieTableData,
  keys: string
): boolean {
  let canShow = false;
  const value = getFilterValue(keys, cookieData);

  if (keys === CUSTOM_FILTER_MAPPING.scope.keys) {
    canShow = filterWithScope(selectedFilter, value);
  } else if (keys === CUSTOM_FILTER_MAPPING.sameSite.keys) {
    canShow = filterWithSameSite(selectedFilter, value);
  } else if (
    keys === CUSTOM_FILTER_MAPPING.httpOnly.keys ||
    keys === CUSTOM_FILTER_MAPPING.secure.keys
  ) {
    canShow = filterBoolean(selectedFilter, value);
  }

  return canShow;
}

/**
 * Filter cookies based on the scope of the cookie.
 * @param selectedFilter Set<string> of selected filters
 * @param value Value of the cookie key to be filtered
 * @returns boolean whether the cookie should be shown or not
 */
function filterWithScope(selectedFilter: Set<string>, value: string) {
  let canShow = false;
  if (selectedFilter.has('Third Party') && !selectedFilter.has('First Party')) {
    canShow = !value;
  } else if (
    !selectedFilter.has('Third Party') &&
    selectedFilter.has('First Party')
  ) {
    canShow = Boolean(value);
  } else {
    canShow = true;
  }

  return canShow;
}

/**
 * Filter cookies based on the same site of the cookie.
 * @param selectedFilter Set<string> of selected filters
 * @param value Value of the cookie key to be filtered
 * @returns boolean whether the cookie should be shown or not
 */
function filterWithSameSite(selectedFilter: Set<string>, value: string) {
  let canShow = false;
  if (
    !selectedFilter.has('None') &&
    !selectedFilter.has('Lax') &&
    !selectedFilter.has('Strict')
  ) {
    return true;
  }

  const _selectedFilters = Array.from(selectedFilter).map((filter) =>
    filter.toLowerCase()
  );
  const sameSite = value?.toLowerCase() || '';

  canShow = _selectedFilters.includes(sameSite);

  return canShow;
}

/**
 * Filter cookies based on the boolean value of the cookie.
 * @param selectedFilter Set<string> of selected filters
 * @param value Value of the cookie key to be filtered
 * @returns boolean whether the cookie should be shown or not
 */
function filterBoolean(selectedFilter: Set<string>, value: string) {
  let canShow = false;
  if (
    (selectedFilter.has('True') && selectedFilter.has('False')) ||
    (!selectedFilter.has('True') && !selectedFilter.has('False'))
  ) {
    return true;
  }

  if (selectedFilter.has('True')) {
    canShow = Boolean(value);
  } else {
    canShow = !value;
  }

  return canShow;
}
