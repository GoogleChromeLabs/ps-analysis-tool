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
import type { Cookies } from '../../../../../../localStore';
import { FILTER_MAPPING } from '../constants';
import getFilterValue from './getFilterValue';
import type { Filter } from '../types';
import sortRetentionPeriod from './sortRetentionPeriod';
import { sortStringArray } from '.';

const getFilters = (cookies: Cookies): Filter[] => {
  const filters: Filter[] = [...FILTER_MAPPING];

  if (!Object.entries(cookies).length) {
    return FILTER_MAPPING;
  }

  FILTER_MAPPING.forEach((filterMap: Filter, key: number) => {
    filters[key].filters = new Set();

    Object.entries(cookies).forEach(([, cookie]) => {
      let value = getFilterValue(filterMap.keys, cookie);

      if ('boolean' === filterMap?.type) {
        value = value ? 'True' : 'False';
      }

      if (!value && filterMap?.default) {
        value = filterMap.default;
      }

      if (value && filters[key]) {
        filters[key].filters?.add(value);
      }
    });

    const collectedFilters = filters[key]?.filters;

    // Formatting and sorting.
    if (filterMap?.sort && collectedFilters) {
      filters[key].filters = new Set(sortStringArray([...collectedFilters]));
    }

    if ('boolean' === filterMap?.type && collectedFilters) {
      filters[key].filters = new Set([...collectedFilters].sort().reverse()); // To bring [True, False]
    }

    if (filterMap?.keys === 'analytics.retention' && collectedFilters) {
      filters[key].filters = new Set(
        sortRetentionPeriod([...collectedFilters])
      );
    }
  });

  return filters;
};

export default getFilters;
