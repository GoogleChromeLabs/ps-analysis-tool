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
import { GSI_V2_SIGNATURE_STRONG_MATCHES } from './constants';
import type { DetectedSignature } from '../../types';

/**
 * Generates the Google Sign-In v2 api matches.
 * @param signatureMatches - The number of signature matches.
 * @param matches - The existing matches.
 * @param moduleMatches - Matching modules.
 * @returns The matches.
 */
const overrideGSIV2Matches = (
  signatureMatches: number,
  matches: DetectedSignature[],
  moduleMatches: number
) => {
  const hasStrongMatch = matches.some((item) =>
    GSI_V2_SIGNATURE_STRONG_MATCHES.some(
      (strongMatchItem) => item.feature.text === strongMatchItem.signature
    )
  );

  const shouldClearMatches = !(
    (signatureMatches > 0 && moduleMatches > 0) ||
    hasStrongMatch
  );

  return shouldClearMatches ? [] : matches;
};

export default overrideGSIV2Matches;
