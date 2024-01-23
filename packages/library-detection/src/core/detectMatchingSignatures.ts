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
import { generateGSIV2Matches } from '../libraries';
import type {
  ScriptTagUnderCheck,
  LibraryData,
  DetectionSubFunctions,
} from '../types';

/**
 * Checks if given ScriptTag's url and return false if it is google origin
 * @param {any} script:ScriptTagUnderCheck
 * @param script
 * @returns {any}
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
 * Primary function which gets the stringTag url and content and looks for varirous library sigantures
 * @param {any} loadedScripts:ScriptTagUnderCheck[]
 * @param loadedScripts
 * @param detectionSubFunctions
 * @returns {any}
 */
const detectMatchingSignatures = (
  loadedScripts: ScriptTagUnderCheck[],
  detectionSubFunctions: DetectionSubFunctions
) => {
  const libraryMatches: LibraryData = {
    gis: {
      signatureMatches: 0,
      matches: [],
    },
    gsiV2: {
      signatureMatches: 0,
      moduleMatch: 0,
      matches: [],
    },
  };

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

  const gsi2AuditData = generateGSIV2Matches(
    libraryMatches.gsiV2.signatureMatches,
    libraryMatches.gsiV2.matches,
    libraryMatches.gsiV2.moduleMatch as number
  );

  libraryMatches.gsiV2.matches = gsi2AuditData;

  return {
    gis: libraryMatches.gis,
    gsiV2: libraryMatches.gsiV2,
  };
};

export default detectMatchingSignatures;
