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
  CountrySiteType,
  OtherWellKnownOutputType,
  PrimaryWellKnownOutputType,
  ServiceSiteType,
} from '../types';

export enum FORM_ACTIONS {
  SET_CONTACT = 'SET_CONTACT',
  SET_PRIMARY_DOMAIN = 'SET_PRIMARY_DOMAIN',
  ADD_ASSOCIATED_SITE = 'ADD_ASSOCIATED_SITE',
  SET_ASSOCIATED_SITES = 'SET_ASSOCIATED_SITES',
  REMOVE_ASSOCIATED_SITE = 'REMOVE_ASSOCIATED_SITE',
  ADD_SERVICE_SITE = 'ADD_SERVICE_SITE',
  SET_SERVICE_SITES = 'SET_SERVICE_SITES',
  REMOVE_SERVICE_SITE = 'REMOVE_SERVICE_SITE',
  ADD_COUNTRY_SITE = 'ADD_COUNTRY_SITE',
  SET_COUNTRY_SITES = 'SET_COUNTRY_SITES',
  REMOVE_COUNTRY_SITE = 'REMOVE_COUNTRY_SITE',
  SET_LOADING = 'SET_LOADING',
  SUBMIT_FORM = 'SUBMIT_FORM',
  RESET_FORM = 'RESET_FORM',
}

export const initialState = {
  contact: {
    email: '',
    emailError: '',
  },
  primaryDomain: {
    url: '',
    urlError: '',
  },
  associatedSites: [] as AssociatedSiteType[],
  serviceSites: [] as ServiceSiteType[],
  countrySites: [] as CountrySiteType[],
  loading: false,
  validationPassed: true,
  primaryWellKnownOutput: null as PrimaryWellKnownOutputType | null,
  otherWellKnownOutput: null as OtherWellKnownOutputType | null,
};

export type StateType = typeof initialState;

export type SitePayloadType =
  | {
      idx: number;
      key: 'url' | 'rationale' | 'site' | 'cctld';
      value: string;
    }
  | [];
