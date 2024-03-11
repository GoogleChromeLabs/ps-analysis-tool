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
  GSI_V2_SIGNATURE_STRONG_MATCHES,
  GSI_V2_SIGNATURE_WEAK_MATCHES,
  GIS_SIGNATURE_WEAK_MATCHES,
  GIS_HELP_URL,
  GSI_HELP_URL,
  GIS_DOMAINS_TO_SKIP,
  GSI_DOMAINS_TO_SKIP,
  GSIv2_EXCEPTIONS,
  GIS_EXCEPTIONS,
} from './libraries';

const LIBRARIES = [
  {
    name: 'gsiV2',
    component: GISAccordion,
    signatures: {
      strongMatches: GSI_V2_SIGNATURE_STRONG_MATCHES,
      weakMatches: GSI_V2_SIGNATURE_WEAK_MATCHES,
    },
    exceptions: GSIv2_EXCEPTIONS,
    domainsToSkip: GSI_DOMAINS_TO_SKIP,
    helpUrl: GSI_HELP_URL,
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
  },
];

export default LIBRARIES;
