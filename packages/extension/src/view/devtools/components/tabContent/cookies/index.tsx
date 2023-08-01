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
//@todo remove justify-center and align-center after landing page PR is merged.
/**
 * External dependencies.
 */
import React, { useEffect, useState, useMemo } from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import { CookieList, CookieDetails } from './components';
import type { CookieData } from '../../../../../localStore';

const Cookies = () => {
  const { cookies, tabUrl, selectedFrame, tabFrames } = useCookieStore(
    ({ state }) => ({
      cookies: state.tabCookies,
      tabUrl: state.tabUrl,
      selectedFrame: state.selectedFrame,
      tabFrames: state.tabFrames,
    })
  );

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedCookie, setSelectedCookie] = useState<
    | (CookieData & {
        isIbcCompliant: boolean | null;
        isCookieSet: boolean | null;
      })
    | null
  >(null);

  useEffect(() => {
    if (!selectedKey && cookies !== null && Object.keys(cookies).length !== 0) {
      setSelectedKey(Object.keys(cookies)[0]);
      setSelectedCookie(cookies[Object.keys(cookies)[0]]);
    } else if (
      selectedKey &&
      cookies !== null &&
      Object.keys(cookies).length !== 0 &&
      Object.keys(cookies).includes(selectedKey)
    ) {
      setSelectedCookie(cookies[selectedKey]);
    }
  }, [cookies, selectedKey]);

  const calculatedCookies = useMemo(() => {
    const frameFilteredCookies: { [key: string]: CookieData } = {};
    if (cookies && selectedFrame && tabFrames && tabFrames[selectedFrame]) {
      Object.entries(cookies).forEach(([key, cookie]) => {
        tabFrames[selectedFrame].frameIds?.forEach((frameId) => {
          if (cookie.frameIdList?.includes(frameId)) {
            frameFilteredCookies[key] = cookie;
          }
        });
      });
    }
    return frameFilteredCookies;
  }, [cookies, selectedFrame, tabFrames]);

  return (
    <div
      className={`w-full h-full flex flex-col lg:flex-row ${
        selectedFrame ? '' : 'items-center justify-center'
      }`}
      data-testid="cookies-content"
    >
      {selectedFrame ? (
        <>
          <div className="basis-1/2 lg:basis-1/3 overflow-y-scroll border-r ">
            <CookieList
              cookies={calculatedCookies || {}}
              tabUrl={tabUrl}
              selectedKey={selectedKey}
              onClickItem={setSelectedKey}
            />
          </div>
          <div className=" basis-1/2 lg:basis-2/3 overflow-y-scroll pb-28">
            <div className="border-t-gray-300 border-t-2 lg:border-t-0 ">
              {selectedCookie && (
                <CookieDetails
                  data={selectedCookie.parsedCookie}
                  analytics={selectedCookie.analytics}
                  isIbcCompliant={selectedCookie.isIbcCompliant}
                  isCookieSet={selectedCookie.isCookieSet}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <p> landing page placeholder</p>
      )}
    </div>
  );
};

export default Cookies;
