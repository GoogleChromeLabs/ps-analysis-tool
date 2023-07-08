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
import React, { type ReactNode, useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import CookiesContext from './context';
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import { UseCookieStoreReturnType } from './types';
import { CookieData } from '../../../../../localStore';
import { SelectedFilters } from './components/cookieFilter/types';
import filterCookies from './components/cookieFilter/filterCookies';

interface CookiesProviderProps {
  children: ReactNode;
}

const CookiesProvider: React.FC<CookiesProviderProps> = ({ children }) => {
  const { cookies } = useCookieStore(
    ({ state }) =>
      ({
        cookies: state?.cookies,
      } as UseCookieStoreReturnType)
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedCookie, setSelectedCookie] = useState<CookieData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!cookies) {
      return;
    }

    if (!selectedKey && Object.keys(cookies).length !== 0) {
      setSelectedKey(Object.keys(cookies)[0]);
      setSelectedCookie(cookies[Object.keys(cookies)[0]]);
    } else if (
      selectedKey &&
      Object.keys(cookies).length !== 0 &&
      Object.keys(cookies).includes(selectedKey)
    ) {
      setSelectedCookie(cookies[selectedKey]);
    }
  }, [cookies, selectedKey]);

  const filteredCookies = filterCookies(cookies, selectedFilters, searchTerm);

  const value = {
    state: {
      cookies,
      filteredCookies,
      selectedKey,
      selectedCookie,
      selectedFilters,
      searchTerm,
    },
    actions: {
      setSelectedKey,
      setSelectedCookie,
      setSelectedFilters,
      setSearchTerm,
    },
  };

  return (
    <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>
  );
};

export default CookiesProvider;
