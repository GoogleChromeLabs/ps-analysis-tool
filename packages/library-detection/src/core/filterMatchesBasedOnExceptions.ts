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

import type { Config, DetectedSignature } from '../types';

/**
 * Filters the given matches based on the exceptions defined in the configuration.
 * @param domain - The domain for which the matches are filtered.
 * @param config - The configuration object containing the exceptions.
 * @param matches - The array of detected signatures to be filtered.
 * @returns The filtered array of matches.
 */
const filterMatchesBasedOnExceptions = (
  domain: string,
  config: Config,
  matches: DetectedSignature[]
) => {
  const parsedUrl = extractUrl(domain);
  const parsedTabDomain = parsedUrl?.hostname;
  const parsedSubDomain = parsedUrl?.subdomain;
  let filteredMatches = { ...matches };

  const isCurrentDomainExceptionDomain =
    config?.exceptions?.[parsedTabDomain as string] &&
    config?.exceptions?.[parsedTabDomain as string]?.signatures?.length > 0;

  if (
    (isCurrentDomainExceptionDomain && !parsedSubDomain) ||
    (isCurrentDomainExceptionDomain &&
      parsedSubDomain &&
      config.exceptions?.[parsedTabDomain as string]?.subDomains.includes(
        parsedSubDomain
      ))
  ) {
    filteredMatches = matches.filter(
      (match: DetectedSignature) =>
        !config.exceptions?.[parsedTabDomain as string]?.signatures?.includes(
          match.feature.text
        )
    );
  }

  return filteredMatches;
};

export default filterMatchesBasedOnExceptions;
