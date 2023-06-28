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
import { CookieList, CookieDetails } from './components';

export const CookieTab = () => {
  const { cookies, tabUrl } = useCookieStore(({ state }) => ({
    cookies: state?.cookies,
    tabUrl: state?.url,
  }));

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedKey && Object.keys(cookies).length !== 0) {
      setSelectedKey(Object.keys(cookies)[0]);
    }
  }, [cookies, selectedKey]);

  const selectedCookie = selectedKey ? cookies[selectedKey] : null;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="flex-1 overflow-y-scroll ">
        <CookieList
          cookies={cookies}
          tabUrl={tabUrl}
          selectedKey={selectedKey}
          onClickItem={setSelectedKey}
        />
      </div>
      <div className="flex-1 overflow-y-scroll border-t-gray-300 border-t-2 lg:border-t-0">
        {selectedCookie && (
          <CookieDetails
            data={selectedCookie.parsedCookie}
            analytics={selectedCookie.analytics}
          />
        )}
      </div>
    </div>
  );
};
