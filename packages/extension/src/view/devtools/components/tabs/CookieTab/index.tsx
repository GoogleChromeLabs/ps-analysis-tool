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
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import CookieList from './cookieList';

export const CookieTab = () => {
  const { cookies: _cookies, url: tabURL } = useCookieStore(
    ({ state: { cookies, url } }) => ({
      cookies,
      url,
    })
  );

  if (!_cookies || !tabURL) {
    return <></>;
  }

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex-1 overflow-y-scroll ">
        <CookieList cookies={_cookies} tabURL={tabURL} />
      </div>
    </div>
  );
};
