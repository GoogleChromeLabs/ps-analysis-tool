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
import React, { useMemo, useCallback, useState } from 'react';
import { noop, type TabCookies, type TabFrames } from '@google-psat/common';
import type { TableFilter } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import CookiesListing from './cookiesListing';
import { useContentStore } from '../../stateProviders/contentStore';
import { generateSiteReportandDownload } from '../../../utils/reportDownloader';
import AssembledCookiesLanding from './cookiesLandingContainer';

interface CookiesTabProps {
  selectedFrameUrl?: string | null;
  selectedSite?: string | null;
  query?: string;
  clearQuery?: () => void;
}

const CookiesTab = ({
  selectedFrameUrl,
  selectedSite,
  query = '',
  clearQuery = noop,
}: CookiesTabProps) => {
  const { tabCookies, completeJson, libraryMatches } = useContentStore(
    ({ state }) => ({
      tabCookies: state.tabCookies,
      completeJson: state.completeJson,
      libraryMatches: state.libraryMatches,
    })
  );

  const [filteredData, setFilteredData] = useState<TabCookies>({});
  const [appliedFilters, setAppliedFilters] = useState<TableFilter>({});

  const tabFrames = useMemo(() => {
    const frames = Object.keys(
      completeJson?.[0].cookieData ?? {}
    ).reduce<TabFrames>((acc, url) => {
      if (url?.includes('http')) {
        acc[url] = {} as TabFrames[string];
      }

      return acc;
    }, {});

    return frames;
  }, [completeJson]);

  const downloadReport = useCallback(() => {
    if (!completeJson) {
      return;
    }

    if (completeJson.length > 1) {
      generateSiteReportandDownload(
        completeJson,
        filteredData,
        appliedFilters,
        //@ts-ignore
        atob(globalThis.PSAT_REPORT_HTML),
        selectedSite
      );
    } else {
      generateSiteReportandDownload(
        completeJson,
        filteredData,
        appliedFilters,
        //@ts-ignore
        atob(globalThis.PSAT_REPORT_HTML)
      );
    }
  }, [appliedFilters, completeJson, filteredData, selectedSite]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {selectedFrameUrl ? (
        <CookiesListing
          selectedFrameUrl={selectedFrameUrl}
          selectedSite={selectedSite}
        />
      ) : (
        <div className="flex flex-col h-full w-full">
          <AssembledCookiesLanding
            libraryMatches={libraryMatches}
            tabFrames={tabFrames}
            tabCookies={tabCookies}
            downloadReport={downloadReport}
            setAppliedFilters={setAppliedFilters}
            setFilteredData={setFilteredData}
            query={query}
            clearQuery={clearQuery}
          />
        </div>
      )}
    </div>
  );
};

export default CookiesTab;
