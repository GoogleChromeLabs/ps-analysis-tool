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
import { extractUrl } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */

import type { DetectedSignature, ExceptionUrls } from '../types';

/**
 * Filters the given matches based on the exceptions defined in the configuration.
 * @param domain - The domain for which the matches are filtered.
 * @param exceptions - The configuration object containing the exceptions.
 * @param matches - The array of detected signatures to be filtered.
 * @returns The filtered array of matches.
 */
const filterMatchesBasedOnExceptions = (
  domain: string,
  exceptions: ExceptionUrls,
  matches: DetectedSignature[]
) => {
  const parsedUrl = extractUrl(domain);
  const parsedTabDomain = parsedUrl?.domain;
  const parsedSubDomain = parsedUrl?.subdomain;
  let filteredMatches: DetectedSignature[] = [...matches];

  const isCurrentDomainExceptionDomain =
    exceptions?.[parsedTabDomain as string] &&
    exceptions?.[parsedTabDomain as string]?.signatures?.length > 0;

  if (
    (isCurrentDomainExceptionDomain && !parsedSubDomain) ||
    (isCurrentDomainExceptionDomain &&
      parsedSubDomain &&
      exceptions?.[parsedTabDomain as string]?.subDomains.includes(
        parsedSubDomain
      ))
  ) {
    filteredMatches = matches.filter(
      (match: DetectedSignature) =>
        !exceptions?.[parsedTabDomain as string]?.signatures?.includes(
          match.feature.text
        )
    );
  }

  return filteredMatches;
};

export default filterMatchesBasedOnExceptions;
