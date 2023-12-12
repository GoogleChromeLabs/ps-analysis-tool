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
import { type DataMapping } from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import CookiesLandingContainer from './cookieLandingHeaderContainer';

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

  cookiesStatsComponents?.blockedCookiesLegend.map((singleLegend) => {
    singleLegend.count = cookieStats.blockedCookies[singleLegend.label];
    return singleLegend;
  });

  const cookieClassificationDataMapping: DataMapping[] = [
    {
      title: 'Total cookies',
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
    },
    {
      title: '1st party cookies',
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: '3rd party cookies',
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
    },
  ];

  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];

  return (
    <div
      className="h-full w-full flex flex-col min-w-[20rem]"
      data-testid="cookies-landing"
    >
      <CookiesLandingContainer
        dataMapping={cookieClassificationDataMapping}
        testId="cookies-landing-insights"
      >
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
          componentData={cookiesStatsComponents.legend}
          tabFrames={tabFrames}
          showInfoIcon={showInfoIcon}
          showHorizontalMatrix={showHorizontalMatrix}
          associatedCookiesCount={associatedCookiesCount}
        />
        {children && <div className="mt-8">{children}</div>}
      </CookiesLandingContainer>
      <CookiesLandingContainer
        dataMapping={blockedCookieDataMapping}
        testId="cookies-landing-insights"
      >
        <CookiesMatrix
          title="Blocked cookie insights"
          tabCookies={tabCookies}
          componentData={cookiesStatsComponents.blockedCookiesLegend}
          tabFrames={tabFrames}
          showInfoIcon={showInfoIcon}
          showHorizontalMatrix={false}
        />
      </CookiesLandingContainer>
    </div>
  );
};

export default CookiesLanding;
