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
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useData } from '../stateProviders/data';

const CookiesSection = () => {
  const data = useData(({ state }) => state.data);

  if (!data) {
    return <></>;
  }

  return (
    <CookiesLandingContainer
      dataMapping={data.blockedCookieDataMapping}
      testId="blocked-cookies-insights"
    >
      {data.cookiesStatsComponents.blockedCookiesLegend.length > 0 && (
        <CookiesMatrix
          title="Blocked Reasons"
          tabCookies={data.tabCookies}
          componentData={data.cookiesStatsComponents.blockedCookiesLegend}
          tabFrames={data.tabFrames}
          showInfoIcon={data.showBlockedInfoIcon}
          showHorizontalMatrix={false}
          infoIconTitle="Cookies that have been blocked by the browser.(The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
        />
      )}
    </CookiesLandingContainer>
  );
};

export default CookiesSection;
