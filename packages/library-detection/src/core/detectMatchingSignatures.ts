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
  DetectionSubFunctions,
  DetectionAuditFunctions,
} from '../types';
import getInitialLibraryData from './getInitialLibraryData';
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
 * @param loadedScripts - An array of loaded scripts to check.
 * @param detectionSubFunctions - An object containing detection sub-functions for each library.
 * @param detectionAuditFunctions - An object containing detection audit functions for each library.
 * @returns An object containing the matching signatures and matches for each library.
 */
const detectMatchingSignatures = (
  loadedScripts: ScriptTagUnderCheck[],
  detectionSubFunctions: DetectionSubFunctions,
  detectionAuditFunctions: DetectionAuditFunctions
): LibraryData => {
  const libraryMatches: LibraryData = getInitialLibraryData();

  for (const script of loadedScripts.filter(filterDomainsToSkip)) {
    if (script.content === undefined) {
      continue;
    }

    Object.entries(detectionSubFunctions).forEach(([key, callback]) => {
      const {
        matches,
        signatureMatches,
        moduleMatch = 0,
      } = libraryMatches[key];

      libraryMatches[key] = callback(
        script,
        matches,
        signatureMatches,
        moduleMatch
      );
    });
  }

  Object.entries(detectionAuditFunctions).forEach(([key, callback]) => {
    const { matches, signatureMatches, moduleMatch = 0 } = libraryMatches[key];

    libraryMatches[key].matches = callback(
      signatureMatches,
      matches,
      moduleMatch
    );
  });

  return libraryMatches;
};

export default detectMatchingSignatures;
