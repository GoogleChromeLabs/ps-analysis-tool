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
/*
 * External dependencies
 */
import { CookieTableData } from '@ps-analysis-tool/common';
/*
 * Internal dependencies
 */
import { TableFilter } from '../../useTable';

/**
 * This function will return set of non duplicated cookie execmption reason.
 * @param frameFilteredCookies The cookie table data.
 * @param clearQuery Function to clear the query(when options are provided) to avoid conflicts.
 * @param options Options to preselect the filter values.
 * @returns {string[]} Unique set of exemption reasons.
 */
function frameOnlyExemptionReasonValues(
  frameFilteredCookies: CookieTableData[],
  clearQuery?: () => void,
  options?: string[]
) {
  const collectedExemptionReasons = Array.from(
    new Set(
      frameFilteredCookies.map(({ exemptionReason }) => {
        if (!exemptionReason || exemptionReason.toLowerCase() === 'none') {
          return null;
        }
        return exemptionReason;
      })
    )
  );

  const reasons = collectedExemptionReasons.reduce((acc, reason) => {
    if (!acc) {
      acc = {};
    }

    if (reason) {
      acc[reason] = {
        selected: false,
      };

      if (options) {
        acc[reason].selected = options.includes(reason);
      }
    }

    return acc;
  }, {} as TableFilter[keyof TableFilter]['filterValues']);

  if (options) {
    clearQuery?.();
  }

  return reasons;
}

export default frameOnlyExemptionReasonValues;
