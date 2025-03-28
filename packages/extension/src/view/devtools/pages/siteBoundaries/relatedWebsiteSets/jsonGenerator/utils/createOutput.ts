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

import type {
  AssociatedSiteType,
  CountrySiteType,
  PrimaryWellKnownOutputType,
  ServiceSiteType,
} from '../types';

const createPrimaryOutput = (
  contact: string,
  primary: string,
  associatedSites: AssociatedSiteType[],
  serviceSites: ServiceSiteType[],
  countrySites: CountrySiteType[]
) => {
  const output: PrimaryWellKnownOutputType = {
    contact,
    primary,
  };

  if (associatedSites.length) {
    output.associatedSites = associatedSites.map(({ url }) => url);
  }

  if (serviceSites.length) {
    output.serviceSites = serviceSites.map(({ url }) => url);
  }

  if ([...associatedSites, ...serviceSites].length) {
    [...associatedSites, ...serviceSites].forEach(({ url, rationale }) => {
      if (!output.rationaleBySite) {
        output.rationaleBySite = {};
      }

      output.rationaleBySite[url] = rationale.trim();
    });
  }

  if (countrySites.length) {
    countrySites.forEach(({ site, cctld }) => {
      if (!output.ccTLDs) {
        output.ccTLDs = {};
      }

      if (!output.ccTLDs[site]) {
        output.ccTLDs[site] = [];
      }

      output.ccTLDs[site].push(cctld);
    });
  }

  return output;
};

export default createPrimaryOutput;
