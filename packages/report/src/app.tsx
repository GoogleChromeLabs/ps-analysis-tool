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
 * External dependencies
 */
import React from 'react';
import { LibraryDetection } from '@google-psat/library-detection';
import { PrivacySandboxColoredIcon } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import './app.css';
import {
  CookiesSection,
  BlockedCookiesSection,
  FramesSection,
  ExemptedCookiesSection,
} from './components';
import { useData } from './stateProviders/data';

const App = () => {
  const data = useData(({ state }) => state.data);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between gap-3 px-4 py-2">
        <div className="flex gap-2 items-center">
          <PrivacySandboxColoredIcon className="w-[65px] h-[65px]" />
          <div>
            {data?.url && <p className="text-xs mb-[1px]">{data.url}</p>}
            <p className="text-xs mb-[1px]">08 July,2024, 4:18pm</p>
            <p className="text-xs">
              <span className="mr-1">Applied Filters:</span>
              <span>
                Domain:bbc.com | Scope: Third Party | Category: Analytics
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center text-cente">PSAT CLI Analysis</div>
      </div>
      <CookiesSection />
      <BlockedCookiesSection />
      <ExemptedCookiesSection />
      {data?.libraryMatches && (
        <div className="text-xs">
          <LibraryDetection />
        </div>
      )}
      {data?.showFramesSection && <FramesSection />}
    </div>
  );
};

export default App;
