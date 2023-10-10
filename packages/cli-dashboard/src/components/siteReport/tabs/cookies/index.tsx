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
import React, { useMemo } from 'react';
import {
  prepareCookiesCount,
  prepareCookieStatsComponents,
  type TabFrames,
} from '@cookie-analysis-tool/common';
import {
  CookiesLanding,
  CookiesMatrix,
} from '@cookie-analysis-tool/design-system';
/**
 * Internal dependencies.
 */
import CookiesListing from './cookieListing';
import { useContentStore } from '../../stateProviders/contentStore';

interface CookiesTabProps {
  selectedFrameUrl?: string | null;
}

const CookiesTab = ({ selectedFrameUrl }: CookiesTabProps) => {
  const { tabCookies } = useContentStore(({ state }) => ({
    tabCookies: state.tabCookies,
  }));

  const tabFrames = useMemo<TabFrames>(
    () =>
      Object.values(tabCookies).reduce((acc, cookie) => {
        if (
          cookie.frameUrl?.includes('http') ||
          cookie.frameUrl === 'Unknown Frame'
        ) {
          acc[cookie.frameUrl] = {} as TabFrames[string];
        }
        return acc;
      }, {} as TabFrames),
    [tabCookies]
  );

  const affectedCookies = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tabCookies).filter(([, cookie]) => !cookie.isCookieSet)
      ),
    [tabCookies]
  );

  return (
    <div className="w-full h-full flex items-center justify-center">
      {selectedFrameUrl ? (
        <CookiesListing selectedFrameUrl={selectedFrameUrl} />
      ) : (
        <CookiesLanding
          tabCookies={tabCookies}
          tabFrames={tabFrames}
          showInfoIcon={false}
          showHorizontalMatrix={false}
        >
          <CookiesMatrix
            tabCookies={affectedCookies}
            cookiesStatsComponents={prepareCookieStatsComponents(
              prepareCookiesCount(affectedCookies)
            )}
            tabFrames={tabFrames}
            title="Affected Cookies Insights"
            description="Following are the insights about cookies that will be affected 3P cookie depreciation."
            showInfoIcon={false}
            count={Object.values(affectedCookies).length}
            showHorizontalMatrix={false}
          />
        </CookiesLanding>
      )}
    </div>
  );
};

export default CookiesTab;
