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
import {
  GSIAccordion,
  GISAccordion,
  FBCommentsAccordion,
  GSI_V2_SIGNATURE_STRONG_MATCHES,
  GSI_V2_SIGNATURE_WEAK_MATCHES,
  GIS_SIGNATURE_WEAK_MATCHES,
  GIS_HELP_URL,
  GSI_HELP_URL,
  FB_COMMENTS_HELP_URL,
  GIS_DOMAINS_TO_SKIP,
  GSI_V2_DOMAINS_TO_SKIP,
  GSIV2_EXCEPTIONS,
  GIS_EXCEPTIONS,
  getGISMatches,
  getGSIV2Matches,
  overrideGSIV2Matches,
  fbCommentsDOMQuery,
} from './libraries';

const LIBRARIES = [
  {
    name: 'gsiV2',
    component: GISAccordion,
    signatures: {
      strongMatches: GSI_V2_SIGNATURE_STRONG_MATCHES,
      weakMatches: GSI_V2_SIGNATURE_WEAK_MATCHES,
    },
    exceptions: GSIV2_EXCEPTIONS,
    domainsToSkip: GSI_V2_DOMAINS_TO_SKIP,
    helpUrl: GSI_HELP_URL,
    detectionFunction: getGSIV2Matches,
    overrideMatchesFunction: overrideGSIV2Matches,
  },
  {
    name: 'gis',
    component: GSIAccordion,
    signatures: {
      strongMatches: [],
      weakMatches: GIS_SIGNATURE_WEAK_MATCHES,
    },
    exceptions: GIS_EXCEPTIONS,
    domainsToSkip: GIS_DOMAINS_TO_SKIP,
    helpUrl: GIS_HELP_URL,
    detectionFunction: getGISMatches,
  },
  {
    name: 'fb-comments',
    component: FBCommentsAccordion,
    helpUrl: FB_COMMENTS_HELP_URL,
    domQueryFunction: fbCommentsDOMQuery,
  },
];

export default LIBRARIES;
