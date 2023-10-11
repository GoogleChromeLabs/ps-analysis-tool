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
  CookiesLanding,
  CookiesMatrix,
} from '@cookie-analysis-tool/design-system';
import {
  prepareCookiesCount,
  prepareCookieStatsComponents,
  type TabCookies,
  type TabFrames,
} from '@cookie-analysis-tool/common';

interface CookiesLandingContainerProps {
  tabFrames: TabFrames;
  tabCookies: TabCookies;
  affectedCookies: TabCookies;
}

const CookiesLandingContainer = ({
  tabFrames,
  tabCookies,
  affectedCookies,
}: CookiesLandingContainerProps) => {
  return (
    <CookiesLanding
      tabFrames={tabFrames}
      tabCookies={tabCookies}
      showInfoIcon={false}
      associatedCookiesCount={Object.values(tabFrames).length}
    >
      <div className="flex flex-col">
        <h3 className="text-xs font-bold text-darkest-gray dark:text-bright-gray uppercase">
          Comparative Insights
        </h3>
        <div className="pt-2">
          <CookiesMatrix
            tabCookies={affectedCookies}
            cookiesStatsComponents={prepareCookieStatsComponents(
              prepareCookiesCount(affectedCookies)
            )}
            tabFrames={tabFrames}
            title="Affected Cookies"
            description="Following are the insights about cookies that will be affected by 3P cookie depreciation."
            showInfoIcon={false}
            showHorizontalMatrix={false}
            count={Object.values(affectedCookies).length}
            allowExpand={false}
            highlightTitle={true}
            capitalizeTitle={true}
          />
        </div>
      </div>
    </CookiesLanding>
  );
};

export default CookiesLandingContainer;
