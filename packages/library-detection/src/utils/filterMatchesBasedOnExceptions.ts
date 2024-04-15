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
 * External dependencies.
 */

import { getDomainFromUrl } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */

import type { DetectedSignature } from '../types';

/**
 * Filters the given matches based on the exceptions defined in the configuration.
 * @param exceptions - The configuration object containing the exceptions.
 * @param matches - The array of detected signatures to be filtered.
 * @param tabUrl - The url on which library detection running on
 * @returns The filtered array of matches.
 */
const filterMatchesBasedOnExceptions = (
  exceptions: { [domain: string]: { [signatures: string]: string[] } },
  matches: DetectedSignature[],
  tabUrl: string
) => {
  let domain = tabUrl ? getDomainFromUrl(tabUrl) : '';

  if (!domain || !tabUrl || !matches || matches?.length === 0) {
    return matches;
  }

  domain = domain.slice(1);

  let filteredMatches: DetectedSignature[] = [...matches];

  const isCurrentDomainExceptionDomain =
    Boolean(exceptions?.[domain]) &&
    exceptions?.[domain]?.signatures?.length > 0;

  if (isCurrentDomainExceptionDomain) {
    filteredMatches = matches.filter(
      (match: DetectedSignature) =>
        !exceptions?.[domain]?.signatures?.includes(match.feature.text)
    );
  }

  return filteredMatches;
};

export default filterMatchesBasedOnExceptions;
