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
import filterCookies from './utils/filterCookies';
import getFilters from './utils/getFilters';
import saveSelectedCookies from './utils/saveSelectedCookies';
import getSavedSelectedCookies from './utils/getSavedSelectedCookies';
import { type CookieData } from '../../../../../localStore';
import type {
  UseCookieStoreReturnType,
  SelectedFilters,
  Filter,
} from './types';

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
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    (async () => {
      const savedFilters = await getSavedSelectedCookies();

      if (savedFilters) {
        setSelectedFilters(savedFilters);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await saveSelectedCookies(selectedFilters);
    })();
  }, [selectedFilters]);

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

  useEffect(() => {
    const updatedFilters = getFilters(cookies);
    setFilters(updatedFilters);
  }, [cookies]);

  const filteredCookies = filterCookies(cookies, selectedFilters, searchTerm);

  const value = {
    state: {
      cookies,
      filteredCookies,
      selectedKey,
      selectedCookie,
      selectedFilters,
      filters,
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
