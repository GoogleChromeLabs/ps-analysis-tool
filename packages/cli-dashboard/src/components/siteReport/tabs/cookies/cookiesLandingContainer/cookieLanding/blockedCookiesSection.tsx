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
import {
  CookiesLandingContainer,
  CookiesMatrix,
  MessageBox,
  prepareCookieStatsComponents,
  prepareCookiesCount,
  type DataMapping,
} from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';

interface BlockedCookiesSectionProps {
  affectedCookies: TabCookies | null;
  tabFrames: TabFrames | null;
}
const BlockedCookiesSection = ({
  affectedCookies,
  tabFrames,
}: BlockedCookiesSectionProps) => {
  const affectedCookiesStats = prepareCookiesCount(affectedCookies);

  const affectedCookiesStatsComponents =
    prepareCookieStatsComponents(affectedCookiesStats);

  const cookieBlockedDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: affectedCookiesStats.blockedCookies.total,
      data: affectedCookiesStatsComponents.blocked,
    },
  ];

  return (
    <CookiesLandingContainer
      dataMapping={cookieBlockedDataMapping}
      testId="cookies-insights"
    >
      {!affectedCookiesStats ||
        (affectedCookiesStats?.firstParty.total === 0 &&
          affectedCookiesStats?.thirdParty.total === 0 && (
            <MessageBox
              headerText="No cookies found on this page"
              bodyText="Please try reloading the page"
            />
          ))}
      <CookiesMatrix
        tabCookies={affectedCookies}
        componentData={affectedCookiesStatsComponents.blockedCookiesLegend}
        tabFrames={tabFrames}
        description=""
        infoIconTitle="Cookies that have been blocked by the browser.(The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
        showInfoIcon={true}
        showHorizontalMatrix={false}
        allowExpand={false}
      />
    </CookiesLandingContainer>
  );
};
export default BlockedCookiesSection;
