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
 * Internal dependencies
 */
import type {
  AssociatedSiteType,
  ContactEmailType,
  CountrySiteType,
  PrimaryDomainType,
  ServiceSiteType,
} from '../types';
import {
  validateContactEmail,
  validateForm,
  validateRationale,
  validateUrl,
} from '../utils';
import createPrimaryOutput from '../utils/createOutput';
import type { StateType } from './types';

const updateContact = (value = '', prevState: ContactEmailType) => {
  value = value.trim();

  const newContact = { ...prevState };
  newContact.email = value;
  newContact.emailError = validateContactEmail(value);

  return newContact;
};

const updatePrimaryDomain = (value = '', prevState: PrimaryDomainType) => {
  value = value.trim();

  const newPrimaryDomain = { ...prevState };
  newPrimaryDomain.url = value;
  newPrimaryDomain.urlError = validateUrl(value);

  return newPrimaryDomain;
};

const updateAssociatedSites = (
  idx: number,
  key: string,
  value = '',
  prevState: AssociatedSiteType[]
) => {
  const newAssociatedSites = [...prevState];
  if (key === 'url') {
    value = value.trim();

    newAssociatedSites[idx].url = value;
    newAssociatedSites[idx].urlError = validateUrl(value);
  }

  if (key === 'rationale') {
    newAssociatedSites[idx].rationale = value;
    newAssociatedSites[idx].rationaleError = validateRationale(value);
  }

  return newAssociatedSites;
};

const updateServiceSites = (
  idx: number,
  key: string,
  value = '',
  prevState: ServiceSiteType[]
) => {
  const newServiceSites = [...prevState];
  if (key === 'url') {
    value = value.trim();

    newServiceSites[idx].url = value;
    newServiceSites[idx].urlError = validateUrl(value);
  }

  if (key === 'rationale') {
    newServiceSites[idx].rationale = value;
    newServiceSites[idx].rationaleError = validateRationale(value);
  }

  return newServiceSites;
};

const updateCountrySites = (
  idx: number,
  key: string,
  value = '',
  prevState: CountrySiteType[]
) => {
  value = value.trim();

  const newCountrySites = [...prevState];
  if (key === 'site') {
    newCountrySites[idx].site = value;
    newCountrySites[idx].siteError = validateUrl(value);
  }

  if (key === 'cctld') {
    newCountrySites[idx].cctld = value;
    newCountrySites[idx].cctldError = validateUrl(value);
  }

  return newCountrySites;
};

const handleSubmit = (prevState: StateType) => {
  const {
    contact,
    primaryDomain,
    associatedSites,
    serviceSites,
    countrySites,
  } = prevState;

  const state = {
    ...prevState,
    ...validateForm(
      primaryDomain,
      contact,
      associatedSites,
      serviceSites,
      countrySites
    ),
  } as StateType;

  if (!state.validationPassed) {
    return state;
  }

  const primaryWellKnownOutput = createPrimaryOutput(
    contact.email,
    primaryDomain.url,
    associatedSites,
    serviceSites,
    countrySites
  );

  const otherWellKnownOutput = {
    primary: primaryDomain.url,
  };

  state.primaryWellKnownOutput = primaryWellKnownOutput;
  state.otherWellKnownOutput = otherWellKnownOutput;

  return state;
};

export {
  handleSubmit,
  updateAssociatedSites,
  updateContact,
  updateCountrySites,
  updatePrimaryDomain,
  updateServiceSites,
};
