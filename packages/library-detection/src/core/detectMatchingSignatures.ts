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
import type {
  ScriptTagUnderCheck,
  LibraryData,
  DetectionFunctions,
} from '../types';
import LIBRARIES from '../config';

/**
 * Filter origins of a script tag from skipped origins.
 * @param script - The script tag to check.
 * @returns A boolean value indicating whether the origin is skipped
 */
const filterDomainsToSkip = (script: ScriptTagUnderCheck): boolean => {
  const domainsToSkip = [
    ...new Set(LIBRARIES.flatMap((library) => library.domainsToSkip || [])),
  ];

  return (
    script.origin !== null &&
    !domainsToSkip.some((domain) => script?.origin?.includes(domain))
  );
};

/**
 * Detects matching signatures of libraries in loaded scripts.
 * @param scripts - An array of loaded scripts to check.
 * @param detectionFunctions - An object containing detection sub-functions for each library.
 * @returns An object containing the matching signatures and matches for each library.
 */
const detectMatchingSignatures = (
  scripts: ScriptTagUnderCheck[],
  detectionFunctions: DetectionFunctions
): LibraryData => {
  const libraryMatches: LibraryData = Object.fromEntries(
    LIBRARIES.filter(({ detectionFunction }) => detectionFunction).map(
      ({ name }) => [
        name,
        {
          signatureMatches: 0,
          matches: [],
          moduleMatch: 0,
        },
      ]
    )
  );

  for (const script of scripts.filter(filterDomainsToSkip)) {
    if (script.content === undefined) {
      continue;
    }

    Object.entries(detectionFunctions).forEach(([key, detectionFunction]) => {
      if (!detectionFunction) {
        return;
      }

      const {
        signatureMatches,
        matches,
        moduleMatch = 0,
      } = libraryMatches[key];

      libraryMatches[key] = detectionFunction(
        script,
        matches,
        signatureMatches,
        moduleMatch
      );
    });
  }

  return libraryMatches;
};

export default detectMatchingSignatures;
