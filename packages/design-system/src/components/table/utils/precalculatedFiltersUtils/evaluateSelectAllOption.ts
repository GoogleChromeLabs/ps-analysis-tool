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
 *	Evaluate if the 'All' option is present in parsedQuery.
 * @param filterKey Filter key to evaluate.
 * @param parsedQuery Query to evaluate from.
 * @param clearActivePanelQuery Function to clear the query to avoid conflicts.
 * @returns True if 'All' option is present in parsedQuery, false otherwise.
 */
const evaluateSelectAllOption = (
  filterKey: string,
  parsedQuery: Record<string, any>,
  clearActivePanelQuery?: () => void
) => {
  const options: string[] = parsedQuery?.filter?.[filterKey];

  if (options?.[0] === 'All') {
    clearActivePanelQuery?.();

    return true;
  }

  return false;
};

export default evaluateSelectAllOption;
