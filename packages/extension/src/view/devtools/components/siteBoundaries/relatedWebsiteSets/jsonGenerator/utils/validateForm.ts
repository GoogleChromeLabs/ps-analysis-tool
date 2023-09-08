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
  AssociatedSiteType,
  ContactEmailType,
  CountrySiteType,
  PrimaryDomainType,
  ServiceSiteType,
} from '../types';

const validateForm = (
  primaryDomain: PrimaryDomainType,
  contact: ContactEmailType,
  associatedSites: AssociatedSiteType[],
  serviceSites: ServiceSiteType[],
  countrySites: CountrySiteType[]
) => {
  const associatedSiteErrors: string[] = [];
  const serviceSiteErrors: string[] = [];
  const countrySiteErrors: string[] = [];

  associatedSites.forEach(({ urlError, rationaleError }) => {
    associatedSiteErrors.push(urlError, rationaleError);
  });

  serviceSites.forEach(({ urlError, rationaleError }) => {
    serviceSiteErrors.push(urlError, rationaleError);
  });

  countrySites.forEach(({ siteError, cctldError }) => {
    countrySiteErrors.push(siteError, cctldError);
  });

  return ![
    contact.emailError,
    primaryDomain.urlError,
    ...associatedSiteErrors,
    ...serviceSiteErrors,
    ...countrySiteErrors,
  ].filter((error) => Boolean(error)).length;
};

export default validateForm;
