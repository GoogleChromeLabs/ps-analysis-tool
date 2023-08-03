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
import {
  useCookieStore,
  type CookieTableData,
} from '../../../stateProviders/syncCookieStore';
import { CookieDetails, CookieTable } from './components';

const Cookies = () => {
  const { cookies, selectedFrame, tabFrames } = useCookieStore(({ state }) => ({
    cookies: state.tabCookies,
    tabUrl: state.tabUrl,
    selectedFrame: state.selectedFrame,
    tabFrames: state.tabFrames,
  }));

  const calculatedCookies = useMemo(() => {
    const frameFilteredCookies: { [key: string]: CookieTableData } = {};
    if (cookies && selectedFrame && tabFrames && tabFrames[selectedFrame]) {
      Object.entries(cookies).forEach(([key, cookie]) => {
        tabFrames[selectedFrame].frameIds?.forEach((frameId) => {
          if (cookie.frameIdList?.includes(frameId)) {
            frameFilteredCookies[key] = cookie;
          }
        });
      });
    }
    return Object.values(frameFilteredCookies);
  }, [cookies, selectedFrame, tabFrames]);

  return (
    <div
      className={`h-full ${
        selectedFrame ? '' : 'flex items-center justify-center'
      }`}
      data-testid="cookies-content"
    >
      {selectedFrame ? (
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
            <CookieTable cookies={calculatedCookies} />
          </Resizable>
          <div className="w-full h-full bg-white border-t-2 border-gray-300 shadow overflow-auto">
            <CookieDetails />
          </div>
        </div>
      ) : (
        <p> landing page placeholder</p>
      )}
    </div>
  );
};

export default Cookies;
