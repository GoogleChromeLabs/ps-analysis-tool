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
  prepareCookieDataMapping,
  prepareCookieStatsComponents,
  prepareCookiesCount,
} from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */

interface CookiesSectionProps {
  tabCookies: TabCookies | null;
  tabFrames: TabFrames | null;
}
const CookiesSection = ({ tabCookies, tabFrames }: CookiesSectionProps) => {
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const cookieClassificationDataMapping = prepareCookieDataMapping(
    cookieStats,
    cookiesStatsComponents
  );

  return (
    <CookiesLandingContainer
      dataMapping={cookieClassificationDataMapping}
      testId="cookies-insights"
    >
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
        componentData={cookiesStatsComponents.legend}
        tabFrames={tabFrames}
        description=""
        showInfoIcon={true}
        showHorizontalMatrix={false}
        allowExpand={true}
      />
    </CookiesLandingContainer>
  );
};
export default CookiesSection;
