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
import { type TabFrames } from '@cookie-analysis-tool/common';

/**
 * Internal dependencies.
 */
import CookiesListing from './cookiesListing';
import { useContentStore } from '../../stateProviders/contentStore';
import CookiesLandingContainer from './cookiesLandingContainer';

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
        <CookiesLandingContainer
          tabFrames={tabFrames}
          tabCookies={tabCookies}
          affectedCookies={affectedCookies}
        />
      )}
    </div>
  );
};

export default CookiesTab;
