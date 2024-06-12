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
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Calculate the filter values for the provider key.
 * Use options to preselect the filter values, if options are provided clear the query to avoid conflicts.
 * @param key Key to calculate the filter values for.
 * @param tabCookies Cookies to calculate the filter values from.
 * @param options Options to preselect the filter values.
 * @param clearQuery Function to clear the query(when options are provided) to avoid conflicts.
 * @param runTranslation Boolean to check if the translation should be run.
 * @returns	Filters for the provider key.
 */
const calculateDynamicFilterValues = (
  key: string,
  tabCookies: CookieTableData[],
  options: string[],
  clearQuery?: () => void,
  runTranslation?: boolean
): TableFilter[keyof TableFilter]['filterValues'] => {
  const filters = tabCookies.reduce<
    TableFilter[keyof TableFilter]['filterValues']
  >((acc, cookie) => {
    let value = getValueByKey(key, cookie);
    console.log(cookie);
    if (runTranslation) {
      value = I18n.getMessage(
        (value as string).toLowerCase() || 'uncategorized'
      );
    }

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
