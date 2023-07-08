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
import { createContext } from 'use-context-selector';

/**
 * Internal dependencies.
 */
import type { CookiesContextState, SelectedFilters } from './types';
import type { Cookies, CookieData } from '../../../../../localStore';
import { noop } from '../../../../../utils/noop';

const initialValue = {
  state: {
    cookies: {} as Cookies,
    filteredCookies: {} as Cookies,
    selectedKey: null,
    selectedCookie: {} as CookieData,
    selectedFilters: {} as SelectedFilters,
    searchTerm: '' as string,
  },
  actions: {
    setSelectedKey: noop,
    setSelectedCookie: noop,
    setSelectedFilters: noop,
    setSearchTerm: noop,
  },
};

const CookiesContext = createContext<CookiesContextState>(initialValue);

export default CookiesContext;
