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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import { CookieList, CookieDetails, FiltersList } from './components';
import type {
  CookieData,
  Cookies as CookiesType,
} from '../../../../../localStore';
import filterCookies from './components/cookieFilter/filterCookies';
import type { SelectedFilters } from './components/cookieFilter/types';
import CookiesProvider from './cookiesProvider';

type UseCookieStoreReturnType = {
  cookies: CookiesType;
};

const Cookies = () => {
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

  if (!cookies) {
    return null;
  }

  const filteredCookies = filterCookies(cookies, selectedFilters, searchTerm);

  return (
    <CookiesProvider>
      <div className="p-2 px-3 border-b">Header Bar</div>
      <div
        className="w-full h-full flex flex-col lg:flex-row"
        data-testid="cookies-content"
      >
        <div className="h-1/2 lg:w-2/5 lg:h-auto flex">
          <div className="w-1/3 border-r p-3 pt-1 overflow-y-scroll">
            <FiltersList
              cookies={cookies}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className="w-2/3 overflow-y-scroll border-r ">
            <CookieList
              cookies={filteredCookies}
              selectedKey={selectedKey}
              onClickItem={setSelectedKey}
            />
          </div>
        </div>
        <div className="h-1/2 lg:w-3/5 lg:h-auto overflow-y-scroll pb-28">
          <div className="border-t-gray-300 border-t-2 lg:border-t-0 ">
            {selectedCookie && (
              <CookieDetails
                data={selectedCookie.parsedCookie}
                analytics={selectedCookie.analytics}
              />
            )}
          </div>
        </div>
      </div>
    </CookiesProvider>
  );
};

export default Cookies;
