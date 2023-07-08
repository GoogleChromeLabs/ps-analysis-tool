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
import React from 'react';

/**
 * Internal dependencies.
 */
import { CookieList, CookieDetails, FiltersList } from './components';
import type { Cookies as CookiesType } from '../../../../../localStore';
import useCookies from './useCookies';
import CookieHeaderBar from './components/cookieHeaderBar';

type UseCookieStoreReturnType = {
  cookies: CookiesType;
};

const Layout = () => {
  const { cookies } = useCookies(
    ({ state }) =>
      ({
        cookies: state?.cookies,
      } as UseCookieStoreReturnType)
  );

  if (!cookies) {
    return <p>No cookies found on this page</p>;
  }

  return (
    <>
      <CookieHeaderBar />
      <div
        className="w-full h-full flex flex-col lg:flex-row"
        data-testid="cookies-content"
      >
        <div className="h-1/2 lg:w-2/5 lg:h-auto flex">
          <div className="w-1/3 border-r p-3 pt-1 overflow-y-scroll">
            <FiltersList />
          </div>
          <div className="w-2/3 overflow-y-scroll border-r ">
            <CookieList />
          </div>
        </div>
        <div className="h-1/2 lg:w-3/5 lg:h-auto overflow-y-scroll pb-28">
          <div className="border-t-gray-300 border-t-2 lg:border-t-0 ">
            <CookieDetails />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
