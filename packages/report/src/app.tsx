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
import {
  PrivacySandboxColoredIcon,
  ChipsBar,
} from '@google-psat/design-system';

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
import { noop } from '@google-psat/common';

const App = () => {
  const data = useData(({ state }) => state.data);

  return (
    <div className="h-full w-full flex flex-col">
      {data?.url && (
        <div className="flex gap-2 items-center px-4 py-2">
          <PrivacySandboxColoredIcon className="w-6 h-6" />
          <p className="text-sm">{data.url}</p>
        </div>
      )}
      <div className="h-fit border border-t border-gray-300 bg-anti-flash-white flex gap-2 items-center px-4">
        <p className="text-xs">Applied Filters:</p>
        <div className="overflow-auto">
          <ChipsBar
            selectedFilters={data?.filters || {}}
            resetFilters={noop}
            toggleFilterSelection={noop}
            hideClearAll
          />
        </div>
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
