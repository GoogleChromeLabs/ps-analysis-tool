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
import { FILTER_MAPPING } from '../constants';
import getFilterValue from './getFilterValue';

/**
 * Filter cookies based on attributes calculated from the cookie.
 * @param keys string of the filter key
 * @param cookieData CookieTableData object to be filtered
 * @param selectedFilter Set<string> of selected filters
 * @returns boolean whether the cookie should be shown or not
 */
export default function filterWithCalculatedMapping(
  keys: string,
  cookieData: CookieTableData,
  selectedFilter: Set<string>
) {
  let value = getFilterValue(keys, cookieData);
  const filterMap = FILTER_MAPPING.find((config) => config.keys === keys);

  if (!value && filterMap?.default) {
    value = filterMap.default;
  }

  return selectedFilter?.has(value);
}
