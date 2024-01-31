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

/**
 * Checks if the origin of a script tag is Google-related.
 * @param script - The script tag to check.
 * @returns A boolean value indicating whether the origin is Google-related.
 */
const originIsGoogle = (script: ScriptTagUnderCheck) => {
  return !(
    (
      script.origin?.includes('accounts.google.com') ||
      script.origin?.includes('gstatic.com')
    ) // NOTE: intentionally removed apis.google.com from this list
  );
};

/**
 * Detects matching signatures of libraries in loaded scripts.
 * @param librariesToDetect - An array of libraries to detect.
 * @param loadedScripts - An array of loaded scripts to check.
 * @param detectionSubFunctions - An object containing detection sub-functions for each library.
 * @param detectionAuditFunctions - An object containing detection audit functions for each library.
 * @returns An object containing the matching signatures and matches for each library.
 */

const detectMatchingSignatures = (
  librariesToDetect: string[],
  loadedScripts: ScriptTagUnderCheck[],
  detectionSubFunctions: DetectionSubFunctions,
  detectionAuditFunctions: DetectionAuditFunctions
) => {
  const libraryMatches: LibraryData = librariesToDetect.reduce(
    (acc, library) => {
      acc[library as keyof LibraryData] = {
        signatureMatches: 0,
        matches: [],
        moduleMatch: 0,
      };
      return acc;
    },
    {} as LibraryData
  );

  for (const script of loadedScripts.filter(originIsGoogle)) {
    if (script.content === undefined) {
      continue;
    }

    const detectionSubFunctionsKeys = Object.keys(detectionSubFunctions);

    for (let i = 0; i < detectionSubFunctionsKeys.length; i++) {
      const key = detectionSubFunctionsKeys[i] as keyof LibraryData;
      libraryMatches[key] = detectionSubFunctions[key](
        script,
        libraryMatches[key].matches,
        libraryMatches[key].signatureMatches,
        libraryMatches[key].moduleMatch as number
      );
    }
  }

  const detectionAuditFunctionsKeys = Object.keys(detectionAuditFunctions);

  for (let i = 0; i < detectionAuditFunctionsKeys.length; i++) {
    const key = detectionAuditFunctionsKeys[i] as keyof DetectionAuditFunctions;

    libraryMatches[key].matches = detectionAuditFunctions[key](
      libraryMatches[key].signatureMatches,
      libraryMatches[key].matches,
      libraryMatches[key].moduleMatch as number
    );
  }

  return libraryMatches;
};

export default detectMatchingSignatures;
