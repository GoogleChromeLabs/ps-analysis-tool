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
import {
  TabCookies,
  TabFrames,
  prepareCookieStatsComponents,
  prepareCookiesCount,
} from '@ps-analysis-tool/common';
import { MessageBox } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';

interface CookiesLandingProps {
  tabFrames: TabFrames | null;
  tabCookies: TabCookies | null;
  children?: React.ReactNode;
  showInfoIcon?: boolean;
  showHorizontalMatrix?: boolean;
  associatedCookiesCount?: number | null;
  showMessageBoxBody?: boolean;
}

const CookiesLanding = ({
  tabCookies,
  tabFrames,
  children,
  showInfoIcon = true,
  showHorizontalMatrix = true,
  associatedCookiesCount = null,
  showMessageBoxBody = true,
}: CookiesLandingProps) => {
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
                bodyText={
                  showMessageBoxBody ? 'Please try reloading the page' : ''
                }
              />
            ))}
        <CookiesMatrix
          tabCookies={tabCookies}
          cookiesStatsComponents={cookiesStatsComponents}
          tabFrames={tabFrames}
          showInfoIcon={showInfoIcon}
          showHorizontalMatrix={showHorizontalMatrix}
          associatedCookiesCount={associatedCookiesCount}
        />
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
};

export default CookiesLanding;
