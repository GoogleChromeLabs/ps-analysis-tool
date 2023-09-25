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
import { useReducer } from 'react';

/**
 * Internal dependencies.
 */
import {
  FORM_ACTIONS,
  initialState,
  type SitePayloadType,
  type StateType,
} from './types';
import { reducer } from './reducer';

const useGeneratorForm = () => {
  const [formState, dispatch] = useReducer<typeof reducer>(
    reducer,
    initialState
  );

  return {
    state: formState as StateType,
    actions: {
      setContact: (payload: string) =>
        dispatch({ type: FORM_ACTIONS.SET_CONTACT, payload }),
      setPrimaryDomain: (payload: string) =>
        dispatch({ type: FORM_ACTIONS.SET_PRIMARY_DOMAIN, payload }),
      addAssociatedSite: () =>
        dispatch({ type: FORM_ACTIONS.ADD_ASSOCIATED_SITE }),
      setAssociatedSites: (payload: SitePayloadType) =>
        dispatch({ type: FORM_ACTIONS.SET_ASSOCIATED_SITES, payload }),
      removeAssociatedSite: (payload: number) =>
        dispatch({ type: FORM_ACTIONS.REMOVE_ASSOCIATED_SITE, payload }),
      addServiceSite: () => dispatch({ type: FORM_ACTIONS.ADD_SERVICE_SITE }),
      setServiceSites: (payload: SitePayloadType) =>
        dispatch({ type: FORM_ACTIONS.SET_SERVICE_SITES, payload }),
      removeServiceSite: (payload: number) =>
        dispatch({ type: FORM_ACTIONS.REMOVE_SERVICE_SITE, payload }),
      addCountrySite: () => dispatch({ type: FORM_ACTIONS.ADD_COUNTRY_SITE }),
      setCountrySites: (payload: SitePayloadType) =>
        dispatch({ type: FORM_ACTIONS.SET_COUNTRY_SITES, payload }),
      removeCountrySite: (payload: number) =>
        dispatch({ type: FORM_ACTIONS.REMOVE_COUNTRY_SITE, payload }),
      submitForm: () => {
        dispatch({ type: FORM_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: FORM_ACTIONS.SUBMIT_FORM });
        setTimeout(() => {
          dispatch({ type: FORM_ACTIONS.SET_LOADING, payload: false });
        }, 100);
      },
      resetForm: () => {
        dispatch({ type: FORM_ACTIONS.RESET_FORM });
      },
    },
  };
};

export default useGeneratorForm;
