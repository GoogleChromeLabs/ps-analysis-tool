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
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import {
  TabCookies,
  TabFrames,
  prepareCookieStatsComponents,
  prepareCookiesCount,
} from '@cookie-analysis-tool/common';
import { MessageBox } from '@cookie-analysis-tool/design-system';

interface CookiesLandingProps {
  tabFrames: TabFrames | null;
  tabCookies: TabCookies | null;
}

const CookiesLanding = ({ tabCookies, tabFrames }: CookiesLandingProps) => {
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="h-full w-full min-w-[20rem]" data-testid="cookies-landing">
      <LandingHeader
        cookieStats={cookieStats}
        cookiesStatsComponents={cookiesStatsComponents}
      />
      <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-10 pb-28 px-4">
        {!cookieStats ||
          (cookieStats?.firstParty.total === 0 &&
            cookieStats?.thirdParty.total === 0 && (
              <MessageBox
                headerText="No cookies found on this page"
                bodyText="Please try reloading the page"
              />
            ))}
        <CookiesMatrix
          tabCookies={tabCookies}
          cookiesStatsComponents={cookiesStatsComponents}
          tabFrames={tabFrames}
        />
      </div>
    </div>
  );
};

export default CookiesLanding;
