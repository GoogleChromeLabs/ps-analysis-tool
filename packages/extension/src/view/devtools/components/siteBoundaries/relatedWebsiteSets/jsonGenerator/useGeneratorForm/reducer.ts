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
  CountrySiteType,
  ServiceSiteType,
} from '../types';
import { FORM_ACTIONS, initialState, type StateType } from './types';
import {
  handleSubmit,
  updateAssociatedSites,
  updateContact,
  updateCountrySites,
  updatePrimaryDomain,
  updateServiceSites,
} from './actions';

/**
 * Reducer for the form.
 * @param state State of the form.
 * @param action Action to be performed on the state.
 * @param action.type Type of the action.
 * @param action.payload Payload of the action.
 * @returns Updated state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reducer(state: StateType, action: any) {
  switch (action.type) {
    case FORM_ACTIONS.SET_CONTACT:
      return {
        ...state,
        contact: updateContact(action.payload, state.contact),
      };
    case FORM_ACTIONS.SET_PRIMARY_DOMAIN:
      return {
        ...state,
        primaryDomain: updatePrimaryDomain(action.payload, state.primaryDomain),
      };
    case FORM_ACTIONS.ADD_ASSOCIATED_SITE:
      return {
        ...state,
        associatedSites: [
          ...state.associatedSites,
          {
            url: '',
            rationale: '',
            urlError: '',
            rationaleError: '',
          },
        ],
      };
    case FORM_ACTIONS.SET_ASSOCIATED_SITES:
      if (action.payload.length === 0) {
        return {
          ...state,
          associatedSites: [],
        };
      }

      return {
        ...state,
        associatedSites: updateAssociatedSites(
          action.payload.idx,
          action.payload.key,
          action.payload.value,
          state.associatedSites
        ),
      };
    case FORM_ACTIONS.REMOVE_ASSOCIATED_SITE:
      return {
        ...state,
        associatedSites: state.associatedSites.filter(
          (_: AssociatedSiteType, i: number) => i !== action.payload
        ),
      };
    case FORM_ACTIONS.ADD_SERVICE_SITE:
      return {
        ...state,
        serviceSites: [
          ...state.serviceSites,
          {
            url: '',
            rationale: '',
            urlError: '',
            rationaleError: '',
          },
        ],
      };
    case FORM_ACTIONS.SET_SERVICE_SITES:
      if (action.payload.length === 0) {
        return {
          ...state,
          serviceSites: [],
        };
      }

      return {
        ...state,
        serviceSites: updateServiceSites(
          action.payload.idx,
          action.payload.key,
          action.payload.value,
          state.serviceSites
        ),
      };
    case FORM_ACTIONS.REMOVE_SERVICE_SITE:
      return {
        ...state,
        serviceSites: state.serviceSites.filter(
          (_: ServiceSiteType, i: number) => i !== action.payload
        ),
      };
    case FORM_ACTIONS.ADD_COUNTRY_SITE:
      return {
        ...state,
        countrySites: [
          ...state.countrySites,
          {
            site: '',
            cctld: '',
            siteError: '',
            cctldError: '',
          },
        ],
      };
    case FORM_ACTIONS.SET_COUNTRY_SITES:
      if (action.payload.length === 0) {
        return {
          ...state,
          countrySites: [],
        };
      }

      return {
        ...state,
        countrySites: updateCountrySites(
          action.payload.idx,
          action.payload.key,
          action.payload.value,
          state.countrySites
        ),
      };
    case FORM_ACTIONS.REMOVE_COUNTRY_SITE:
      return {
        ...state,
        countrySites: state.countrySites.filter(
          (_: CountrySiteType, i: number) => i !== action.payload
        ),
      };
    case FORM_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case FORM_ACTIONS.SUBMIT_FORM:
      return {
        ...state,
        ...handleSubmit(state),
      };
    case FORM_ACTIONS.RESET_FORM:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
