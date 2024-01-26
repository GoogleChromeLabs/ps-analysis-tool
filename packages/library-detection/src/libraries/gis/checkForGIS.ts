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
import escapeStringRegexp from 'escape-string-regexp';

/**
 * Internal dependencies.
 */
import { getSourceLocation } from '../../utils';
import { getHelpUrl } from '../../core';
import type { DetectedSignature, ScriptTagUnderCheck } from '../../types';
import {
  GIS_SIGNATURE_WEAK_MATCHES,
  GIS_SIGNATURE_STRONG_MATCHES,
  GIS_HELP_URL,
} from './constants';

/**
 * Checks for Google Identity Services api signatures.
 * @param script - The script tag to check.
 * @param existingItems - The existing items to check against.
 * @param signatureMatches - The number of signature matches.
 * @returns The number of signature matches and the items.
 */
const checkForGIS = (
  script: ScriptTagUnderCheck,
  existingItems: DetectedSignature[],
  signatureMatches: number
) => {
  const content = script.content;
  let items = existingItems;

  if (!content) {
    // this case if no network request is present
    return {
      signatureMatches,
      matches: items,
    };
  }

  const gisSignatures = [
    ...GIS_SIGNATURE_WEAK_MATCHES,
    ...GIS_SIGNATURE_STRONG_MATCHES,
  ].map((item) => item.signature);

  const captureGroup = gisSignatures.map(escapeStringRegexp);

  const allCaptureGroups =
    '(?:.{0,63}?)(?<signature>' + captureGroup.join('|') + ')(?:.{0,63}?)';

  const reSignatures = new RegExp(allCaptureGroups, 'dg');

  for (const match of content.matchAll(reSignatures)) {
    if (!match.groups || !('signature' in match.groups)) {
      continue;
    }

    const featureText = match
      .slice(1)
      .filter((n) => n)
      .join('');

    const item = items.find((_item) => _item.feature.text === featureText);

    if (item !== undefined) {
      item.subItems.items.push({
        sourceLocation: getSourceLocation(match, script.origin),
        snippet: match[0],
      });
    } else {
      signatureMatches += 1;

      items.push({
        feature: {
          type: 'link',
          text: featureText,
          /* Link to the migration guide for all features instead of linking to individual
           * pages as the instructions to update the codebase are short and simple.
           */
          url:
            getHelpUrl(featureText, [
              ...GIS_SIGNATURE_WEAK_MATCHES,
              ...GIS_SIGNATURE_STRONG_MATCHES,
            ]) || GIS_HELP_URL,
        },
        subItems: {
          type: 'subitems',
          items: [
            {
              sourceLocation: getSourceLocation(match, script.origin),
              snippet: match[0],
            },
          ],
        },
      });
    }
  }

  // Audit step
  if (signatureMatches === 0) {
    items = [];
  }

  return {
    signatureMatches,
    matches: items,
  };
};

export default checkForGIS;
