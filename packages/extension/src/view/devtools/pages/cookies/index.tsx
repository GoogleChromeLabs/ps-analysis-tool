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
import React, { memo } from 'react';
import { CookiesLanding } from '@google-psat/design-system';
import { type CookieTableData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { useCookie } from '../../stateProviders';
import CookiesListing from './cookiesListing';
import AssembledCookiesLanding from './cookieLanding';
import SingleTabAnalysisBanner from '../singleTabAnalysisBanner';

interface CookiesProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

const Cookies = ({ setFilteredCookies }: CookiesProps) => {
  const { selectedFrame } = useCookie(({ state }) => ({
    selectedFrame: state.selectedFrame,
  }));

  return (
    <SingleTabAnalysisBanner>
      <div
        className={`h-full ${selectedFrame ? '' : 'flex items-center'}`}
        data-testid="cookies-content"
      >
        {selectedFrame ? (
          <CookiesListing setFilteredCookies={setFilteredCookies} />
        ) : (
          <CookiesLanding>
            <AssembledCookiesLanding />
          </CookiesLanding>
        )}
      </div>
    </SingleTabAnalysisBanner>
  );
};

export default memo(Cookies);
