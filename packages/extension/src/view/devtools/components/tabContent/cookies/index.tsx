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
import filterCookies from './components/filtersList/filterCookies';

type UseCookieStoreReturnType = {
  cookies: CookiesType;
};

type SelectedFilters = {
  [key: string]: Set<string>;
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

  const filteredCookies = filterCookies(cookies, selectedFilters);

  return (
    <div
      className="w-full h-full flex flex-col lg:flex-row"
      data-testid="cookies-content"
    >
      <div className="basis-1/6 border-r p-3 pt-1 overflow-y-scroll">
        <FiltersList
          cookies={cookies}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
      <div className="basis-3/10 lg:basis-1/3 overflow-y-scroll border-r ">
        <CookieList
          cookies={filteredCookies}
          selectedKey={selectedKey}
          onClickItem={setSelectedKey}
        />
      </div>
      <div className="flex-1 lg:basis-2/3 overflow-y-scroll pb-28">
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
  );
};

export default Cookies;
