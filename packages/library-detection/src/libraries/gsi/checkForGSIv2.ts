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
import type { DetectedSignature, ScriptTagUnderCheck } from '../../types';

/**
 * Internal dependencies.
 */
import { getSourceLocation } from '../../utils';
import {
  GSI_V2_SIGNATURE_WEAK_MATCHES,
  GSI_V2_SIGNATURE_STRONG_MATCHES,
  GSI_HELP_URL,
} from './constants';
import isRequestURLMatchingDomainPaths from '../../core/isRequestURLMatchingDomainPaths';
import getHelpUrl from '../../core/getHelpUrl';

export const checkForGSIv2 = (
  script: ScriptTagUnderCheck,
  existingItems: DetectedSignature[],
  signatureMatches: number,
  gsi2ModuleMatch: number
) => {
  const content = script.content;
  const items = existingItems;

  const domainPaths = {
    'apis.google.com': ['/js/platform.js', '/js/api:client.js', '/js/api.js'],
  };

  if (
    script.origin !== null &&
    isRequestURLMatchingDomainPaths(script.origin, domainPaths)
  ) {
    gsi2ModuleMatch = gsi2ModuleMatch + 1;
  }

  if (!content) {
    // this case if no network request is present
    return {
      signatureMatches,
      matches: items,
      moduleMatch: gsi2ModuleMatch,
    };
  }

  const gsiSignatures = [
    ...GSI_V2_SIGNATURE_WEAK_MATCHES.map((item) => item.signature),
    ...GSI_V2_SIGNATURE_STRONG_MATCHES.map((item) => item.signature),
  ];
  /* Match all signatures in the capture group and return surrounding the text:
   *    /(?:.{0,63}?)(signature1|signature2|signature3)(?:.{0,63}?)/g
   */
  const captureGroup = gsiSignatures.map(escapeStringRegexp);
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
              ...GSI_V2_SIGNATURE_STRONG_MATCHES,
              ...GSI_V2_SIGNATURE_WEAK_MATCHES,
            ]) || GSI_HELP_URL,
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

  return {
    signatureMatches,
    matches: items,
    moduleMatch: gsi2ModuleMatch,
  };
};

export default checkForGSIv2;
