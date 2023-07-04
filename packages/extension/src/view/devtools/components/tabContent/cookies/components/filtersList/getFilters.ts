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
import type { Cookies } from '../../../../../../../localStore';

interface Filter {
  name: string;
  keys: string;
  filters?: Set<string>;
}

const FILTER_MAPPING: Filter[] = [
  {
    name: 'Category',
    keys: 'analytics.category',
  },
  {
    name: 'Expiration Date',
    keys: 'parsedCookie.expires',
  },
  {
    name: 'Domain',
    keys: 'parsedCookie.domain',
  },
  {
    name: 'Path',
    keys: 'parsedCookie.path',
  },
  {
    name: 'Same Site',
    keys: 'parsedCookie.samesite',
  },
  {
    name: 'Secure',
    keys: 'parsedCookie.secure',
  },
  {
    name: 'HttpOnly',
    keys: 'parsedCookie.httponly',
  },
];

const getFilters = (cookies: Cookies) => {
  const filters: Filter[] = [...FILTER_MAPPING];

  if (!Object.entries(cookies).length) {
    return FILTER_MAPPING;
  }

  FILTER_MAPPING.forEach((filterMap: Filter, key: number) => {
    filters[key].filters = new Set();

    Object.entries(cookies).forEach(([, cookie]) => {
      const keys = filterMap.keys.split('.');
      const rootKey = keys[0];
      const subKey = keys[1];

      let value =
        cookie[rootKey] && cookie[rootKey][subKey]
          ? cookie[rootKey][subKey]
          : '';

      if (
        ['parsedCookie.secure', 'parsedCookie.httponly'].includes(
          filterMap.keys
        )
      ) {
        value = value ? 'True' : 'False';
      }

      if (!value) {
        return;
      }

      if (filterMap.keys === 'parsedCookie.expires') {
        if (value instanceof Date) {
          value = value.toUTCString();
        } else if (typeof value !== 'string') {
          value = '';
        }
      }

      if (value) {
        filters[key].filters.add(value);
      }
    });
  });

  return filters;
};

export default getFilters;
