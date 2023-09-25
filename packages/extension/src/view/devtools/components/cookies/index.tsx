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
import { useCookieStore } from '../../stateProviders/syncCookieStore';
import CookiesListing from './cookiesListing';
import { CookiesLanding } from '@cookie-analysis-tool/design-system';

const Cookies = () => {
  const { selectedFrame, tabCookies, tabFrames, tabUrl } = useCookieStore(
    ({ state }) => ({
      selectedFrame: state.selectedFrame,
      tabFrames: state.tabFrames,
      tabCookies: state.tabCookies,
      tabUrl: state.tabUrl,
    })
  );

  return (
    <div
      className={`h-full ${selectedFrame ? '' : 'flex items-center'}`}
      data-testid="cookies-content"
    >
      {selectedFrame ? (
        <CookiesListing />
      ) : (
        <CookiesLanding
          cookies={tabCookies}
          frames={tabFrames}
          topUrl={tabUrl}
        />
      )}
    </div>
  );
};

export default Cookies;
