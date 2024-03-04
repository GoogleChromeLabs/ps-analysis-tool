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
 * External dependencies
 */
import { getValueByKey, type CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { TableFilter } from '../../useTable';

const calculateDynamicFilterValues = (
  key: string,
  tabCookies: CookieTableData[],
  options: string[],
  clearQuery?: () => void
): TableFilter[keyof TableFilter]['filterValues'] => {
  const filters = tabCookies.reduce<
    TableFilter[keyof TableFilter]['filterValues']
  >((acc, cookie) => {
    const value = getValueByKey(key, cookie);

    if (!acc) {
      acc = {};
    }

    if (value && !acc[value]) {
      acc[value] = {
        selected: false,
      };

      if (options) {
        acc[value].selected = options.includes(value);
      }
    }

    return acc;
  }, {});

  if (options) {
    clearQuery?.();
  }

  return filters;
};

export default calculateDynamicFilterValues;
