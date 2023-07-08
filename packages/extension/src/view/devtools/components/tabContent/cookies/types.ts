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
import type { Cookies, CookieData } from '../../../../../localStore';
import type { SelectedFilters } from './components/cookieFilter/types';

export interface CookiesContextState {
  state: {
    cookies: Cookies;
    filteredCookies: Cookies;
    selectedKey: string | null;
    selectedCookie: CookieData;
    selectedFilters: SelectedFilters;
    searchTerm: string;
  };
  actions: {
    setSelectedKey: (key: string) => void;
    setSelectedCookie: (cookie: CookieData) => void;
    setSelectedFilters: (filter: SelectedFilters) => void;
    setSearchTerm: (term: string) => void;
  };
}

export type UseCookieReturnType = {
  cookies: Cookies;
};

export type UseCookieStoreReturnType = {
  cookies: Cookies;
};
