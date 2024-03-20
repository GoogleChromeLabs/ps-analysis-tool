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
/**
 * Internal dependencies
 */
import './app.css';
import {
  CookiesLandingContainer,
  CookiesMatrix,
} from '@ps-analysis-tool/design-system';

const App = ({ data }: { data: any }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <CookiesLandingContainer
        dataMapping={data.cookieClassificationDataMapping}
        testId="cookies-insights"
      >
        <CookiesMatrix
          title={data.cookieClassificationTitle}
          tabCookies={data.tabCookies}
          componentData={data.cookiesStatsComponents.legend}
          tabFrames={data.tabFrames}
          showInfoIcon={data.showInfoIcon}
          showHorizontalMatrix={data.showHorizontalMatrix}
          associatedCookiesCount={data.associatedCookiesCount}
        />
      </CookiesLandingContainer>
      <CookiesLandingContainer
        dataMapping={data.blockedCookieDataMapping}
        testId="blocked-cookies-insights"
      >
        {data.cookiesStatsComponents.blockedCookiesLegend.length > 0 && (
          <>
            <CookiesMatrix
              title="Blocked Reasons"
              tabCookies={data.tabCookies}
              componentData={data.cookiesStatsComponents.blockedCookiesLegend}
              tabFrames={data.tabFrames}
              showInfoIcon={data.showBlockedInfoIcon}
              showHorizontalMatrix={false}
              infoIconTitle="Cookies that have been blocked by the browser.(The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
            />
          </>
        )}
      </CookiesLandingContainer>
      <CookiesLandingContainer
        dataMapping={data.frameStateCreator.dataMapping}
        testId="frames-insights"
      >
        <CookiesMatrix
          title="Frames"
          componentData={data.frameStateCreator.legend}
          showMatrix={true}
          tabCookies={data.tabCookies}
          tabFrames={data.tabFrames}
          showInfoIcon={data.showInfoIcon}
          showHorizontalMatrix={false}
          infoIconTitle="The details regarding frames and associated cookies in this page."
        />
      </CookiesLandingContainer>
    </div>
  );
};

export default App;
