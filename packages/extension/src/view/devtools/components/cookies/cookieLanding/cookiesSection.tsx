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
import React, { useCallback, useMemo } from 'react';
import {
  CookiesLandingWrapper,
  CookiesMatrix,
  MessageBox,
  prepareCookieDataMapping,
  prepareCookieStatsComponents,
  prepareCookiesCount,
  useSidebar,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

const CookiesSection = () => {
  const { tabCookies, tabFrames } = useCookieStore(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
  }));
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const cookieClassificationDataMapping = prepareCookieDataMapping(
    cookieStats,
    cookiesStatsComponents
  );

  const firstFrame = useMemo(
    () => Object.keys(tabFrames || {})?.[0] || '',
    [tabFrames]
  );

  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  const selectedItemUpdater = useCallback(
    (query: string) => {
      const queryObject = JSON.parse(query) as Record<string, Array<string>>;

      const modifiedQuery = {
        filter: {
          ...queryObject,
        },
      };

      updateSelectedItemKey(firstFrame, JSON.stringify(modifiedQuery));
    },
    [firstFrame, updateSelectedItemKey]
  );

  return (
    <CookiesLandingWrapper
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
        showHorizontalMatrix={false}
        onClick={selectedItemUpdater}
      />
    </CookiesLandingWrapper>
  );
};
export default CookiesSection;
