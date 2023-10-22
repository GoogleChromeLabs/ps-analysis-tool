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
import validateContactEmail from './validateContactEmail';
import validateRationale from './validateRationale';
import validateUrl from './validateUrl';

const validateForm = (
  primaryDomain: PrimaryDomainType,
  contact: ContactEmailType,
  associatedSites: AssociatedSiteType[],
  serviceSites: ServiceSiteType[],
  countrySites: CountrySiteType[]
) => {
  primaryDomain.urlError = validateUrl(primaryDomain.url);
  contact.emailError = validateContactEmail(contact.email);

  const associatedSiteErrors: string[] = [];
  const serviceSiteErrors: string[] = [];
  const countrySiteErrors: string[] = [];

  associatedSites.forEach((site) => {
    const urlError = validateUrl(site.url);
    const rationaleError = validateRationale(site.rationale);

    associatedSiteErrors.push(urlError, rationaleError);

    site.urlError = urlError;
    site.rationaleError = rationaleError;
  });

  serviceSites.forEach((site) => {
    const urlError = validateUrl(site.url);
    const rationaleError = validateRationale(site.rationale);

    serviceSiteErrors.push(urlError, rationaleError);

    site.urlError = urlError;
    site.rationaleError = rationaleError;
  });

  countrySites.forEach((site) => {
    const siteError = validateUrl(site.site);
    const cctldError = validateUrl(site.cctld);

    countrySiteErrors.push(siteError, cctldError);

    site.siteError = siteError;
    site.cctldError = cctldError;
  });

  const validationPassed = ![
    contact.emailError,
    primaryDomain.urlError,
    ...associatedSiteErrors,
    ...serviceSiteErrors,
    ...countrySiteErrors,
  ].filter((error) => Boolean(error)).length;

  return {
    validationPassed,
    primaryDomain,
    contact,
    associatedSites,
    serviceSites,
    countrySites,
  };
};

export default validateForm;
