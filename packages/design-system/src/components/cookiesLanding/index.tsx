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
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import MessageBox from '../messageBox';
import { type DataMapping } from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import CookiesLandingContainer from './cookieLandingHeaderContainer';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
} from '../../utils';
interface CookiesLandingProps {
  tabFrames: TabFrames | null;
  tabCookies: TabCookies | null;
  children?: React.ReactNode;
  showInfoIcon?: boolean;
  showHorizontalMatrix?: boolean;
  associatedCookiesCount?: number | null;
  showMessageBoxBody?: boolean;
  showBlockedCookiesSection?: boolean;
}

const CookiesLanding = ({
  tabCookies,
  tabFrames,
  children,
  showInfoIcon = true,
  associatedCookiesCount = null,
  showMessageBoxBody = true,
  showBlockedCookiesSection = false,
  showHorizontalMatrix = false,
}: CookiesLandingProps) => {
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const frameStateCreator = prepareFrameStatsComponent(tabFrames, tabCookies);
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
      className="h-full w-full flex flex-col min-w-[40rem]"
      data-testid="cookies-landing"
    >
      <CookiesLandingContainer
        dataMapping={cookieClassificationDataMapping}
        testId="cookies-insights"
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
      {showBlockedCookiesSection && (
        <CookiesLandingContainer
          dataMapping={blockedCookieDataMapping}
          testId="blocked-cookies-insights"
        >
          {cookiesStatsComponents.blockedCookiesLegend.length > 0 && (
            <CookiesMatrix
              title="Blocked Reasons"
              tabCookies={tabCookies}
              componentData={cookiesStatsComponents.blockedCookiesLegend}
              tabFrames={tabFrames}
              showInfoIcon={showInfoIcon}
              showHorizontalMatrix={false}
              infoIconTitle="Cookies that have been blocked by the browser.(The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
            />
          )}
        </CookiesLandingContainer>
      )}
      {showBlockedCookiesSection && (
        <CookiesLandingContainer
          dataMapping={frameStateCreator.dataMapping}
          testId="frames-insights"
        >
          <CookiesMatrix
            title="Frames"
            componentData={frameStateCreator.legend}
            showMatrix={true}
            tabCookies={tabCookies}
            tabFrames={tabFrames}
            showInfoIcon={showInfoIcon}
            showHorizontalMatrix={false}
            infoIconTitle="The details regarding frames and associated cookies in this page."
          />
        </CookiesLandingContainer>
      )}
    </div>
  );
};

export default CookiesLanding;
