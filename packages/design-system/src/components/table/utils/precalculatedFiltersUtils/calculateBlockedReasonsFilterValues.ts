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

/**
 * Calculate the filter values for the blocked reasons filter.
 * Use options to preselect the filter values.
 * @param tabCookies Cookies to calculate the filter values from.
 * @param options Options to preselect the filter values.
 * @param clearQuery Function to clear the query(when options are provided) to avoid conflicts.
 * @returns Filter values for the blocked reasons filter.
 */
const calculateBlockedReasonsFilterValues = (
  tabCookies: CookieTableData[],
  options: string[],
  clearQuery?: () => void
) => {
  const filters = tabCookies.reduce<
    TableFilter[keyof TableFilter]['filterValues']
  >((acc, cookie) => {
    const blockedReason = getValueByKey('blockedReasons', cookie);

    if (!cookie.frameIdList) {
      return acc;
    }

    blockedReason?.forEach((reason: string) => {
      if (!acc) {
        acc = {};
      }

      if (!acc[reason]) {
        acc[reason] = {
          selected: false,
        };

        if (options) {
          acc[reason].selected = options.includes(reason);
        }
      }
    });

    return acc;
  }, {});

  if (options) {
    clearQuery?.();
  }

  return filters;
};

export default calculateBlockedReasonsFilterValues;
