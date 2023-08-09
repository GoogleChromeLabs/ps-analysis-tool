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
import React, { useMemo } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import CookieDetails from './cookieDetails';
import CookieTable from './cookieTable';
import { filterCookiesByFrame } from '../utils/filterCookiesByFrame';

const CookiesListing = () => {
  const { cookies, selectedFrame, tabFrames } = useCookieStore(({ state }) => ({
    cookies: state.tabCookies,
    selectedFrame: state.selectedFrame,
    tabFrames: state.tabFrames,
  }));

  const filteredCookies = useMemo(
    () => filterCookiesByFrame(cookies, tabFrames, selectedFrame),
    [cookies, selectedFrame, tabFrames]
  );

  return (
    <div className="h-full flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="6%"
        maxHeight="98%"
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
        }}
      >
        <CookieTable cookies={filteredCookies} />
      </Resizable>
      <div className="w-full h-full bg-white border-2 border-gray-300 shadow overflow-auto">
        <CookieDetails />
      </div>
    </div>
  );
};

export default CookiesListing;
