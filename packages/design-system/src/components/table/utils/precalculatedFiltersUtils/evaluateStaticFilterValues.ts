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

import { TableFilter } from '../../useTable';

/**
 * Preselect the static filter values based on the options provided.
 * @param staticValues Filter values to evaluate.
 * @param filterKey Filter key to evaluate.
 * @param parsedQuery Query to evaluate from.
 * @param clearActivePanelQuery Function to clear the query to avoid conflicts.
 * @returns Filter values for the static filter.
 */
const evaluateStaticFilterValues = (
  staticValues: TableFilter[keyof TableFilter]['filterValues'],
  filterKey: string,
  parsedQuery: Record<string, any>,
  clearActivePanelQuery?: () => void
) => {
  const options: string[] = parsedQuery?.filter?.[filterKey];

  if (!options) {
    return staticValues;
  }

  const filters = Object.entries(staticValues || {}).reduce(
    (acc, [key, value]) => {
      if (!acc) {
        acc = {};
      }

      if (options) {
        value.selected = options.includes(key);
      }

      acc[key] = value;

      return acc;
    },
    {} as TableFilter[keyof TableFilter]['filterValues']
  );

  if (options) {
    clearActivePanelQuery?.();
  }

  return filters;
};

export default evaluateStaticFilterValues;
