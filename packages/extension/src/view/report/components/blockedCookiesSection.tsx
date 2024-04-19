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
  CookiesLandingWrapper,
  CookiesMatrix,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useData } from '../stateProviders/data';
import { I18n } from '@ps-analysis-tool/i18n';

const CookiesSection = () => {
  const data = useData(({ state }) => state.data);

  if (!data) {
    return <></>;
  }

  return (
    <CookiesLandingWrapper
      dataMapping={data.blockedCookieDataMapping}
      testId="blocked-cookies-insights"
    >
      {data.cookiesStatsComponents.blockedCookiesLegend.length > 0 && (
        <CookiesMatrix
          title={I18n.getMessage('blockedReasons')}
          tabCookies={data.tabCookies}
          componentData={data.cookiesStatsComponents.blockedCookiesLegend}
          tabFrames={data.tabFrames}
          showHorizontalMatrix={false}
          infoIconTitle={I18n.getMessage('cookiesBlockedNote')}
        />
      )}
    </CookiesLandingWrapper>
  );
};

export default CookiesSection;
