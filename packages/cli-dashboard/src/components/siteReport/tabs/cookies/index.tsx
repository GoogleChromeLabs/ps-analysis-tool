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
import React, { useMemo, useCallback } from 'react';
import { UNKNOWN_FRAME_KEY, type TabFrames } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import CookiesListing from './cookiesListing';
import { useContentStore } from '../../stateProviders/contentStore';
import { generateSiteReportandDownload } from '../../../utils/reportDownloader';
import CookiesLandingContainer from './cookiesLandingContainer';

interface CookiesTabProps {
  selectedFrameUrl?: string | null;
  selectedSite?: string | null;
}

const CookiesTab = ({ selectedFrameUrl, selectedSite }: CookiesTabProps) => {
  const { tabCookies, completeJson, libraryMatches } = useContentStore(
    ({ state }) => ({
      tabCookies: state.tabCookies,
      completeJson: state.completeJson,
      libraryMatches: state.libraryMatches,
    })
  );

  const tabFrames = useMemo<TabFrames>(
    () =>
      Object.values(tabCookies).reduce((acc, cookie) => {
        (cookie.frameUrls as string[]).forEach((url) => {
          if (url?.includes('http') || url === UNKNOWN_FRAME_KEY) {
            acc[url] = {} as TabFrames[string];
          }
        });
        return acc;
      }, {} as TabFrames),
    [tabCookies]
  );

  const cookiesWithIssues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tabCookies).filter(([, cookie]) => cookie.isBlocked)
      ),
    [tabCookies]
  );
  const downloadReport = useCallback(() => {
    if (!completeJson) {
      return;
    }
    if (completeJson.length > 1) {
      generateSiteReportandDownload(
        completeJson,
        //@ts-ignore
        atob(globalThis.PSAT_REPORT),
        selectedSite
      );
    } else {
      //@ts-ignore
      generateSiteReportandDownload(completeJson, atob(globalThis.PSAT_REPORT));
    }
  }, [completeJson, selectedSite]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {selectedFrameUrl ? (
        <CookiesListing
          selectedFrameUrl={selectedFrameUrl}
          selectedSite={selectedSite}
        />
      ) : (
        <div className="flex flex-col h-full w-full">
          <CookiesLandingContainer
            libraryMatches={libraryMatches}
            tabFrames={tabFrames}
            tabCookies={tabCookies}
            cookiesWithIssues={cookiesWithIssues}
            downloadReport={downloadReport}
          />
        </div>
      )}
    </div>
  );
};

export default CookiesTab;
