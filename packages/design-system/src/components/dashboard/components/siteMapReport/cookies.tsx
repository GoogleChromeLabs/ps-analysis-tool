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
import React, { useCallback, useMemo, useState } from 'react';
import {
  noop,
  type CompleteJson,
  type LibraryData,
  type TabCookies,
  type TabFrames,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import AssembledCookiesLanding from '../siteReport/tabs/cookies/cookiesLandingContainer';
import SiteReport from '../siteReport';
import { generateSiteMapReportandDownload } from '../utils/reportDownloader';
import extractCookies from '../utils/extractCookies';
import { useSidebar } from '../../../sidebar';
import { TableFilter } from '../../../table';

interface CookiesTabProps {
  selectedSite?: string;
  tabCookies: TabCookies;
  tabFrames: TabFrames;
  completeJson: CompleteJson[] | null;
  path: string;
  libraryMatches: { [url: string]: LibraryData } | null;
  query?: string;
  clearQuery?: () => void;
}

const CookiesTab = ({
  selectedSite,
  tabCookies,
  tabFrames,
  completeJson,
  path,
  libraryMatches,
  query = '',
  clearQuery = noop,
}: CookiesTabProps) => {
  const isKeySelected = useSidebar(({ actions }) => actions.isKeySelected);
  const [appliedFilters, setAppliedFilters] = useState<TableFilter>({});

  const [siteMapLibraryMatches, libraryMatchesUrlCount] = useMemo(() => {
    const _libraryMatchesUrlCount: {
      [key: string]: number;
    } = {};

    const _siteMapLibraryMatches =
      completeJson?.reduce<CompleteJson['libraryMatches']>((acc, data) => {
        const _libraryMatches = data.libraryMatches;

        Object.keys(_libraryMatches).forEach((key) => {
          acc[key] =
            // @ts-ignore
            acc[key]?.matches?.length || acc[key]?.domQuerymatches?.length
              ? acc[key]
              : _libraryMatches[key];

          if (
            Object.keys(_libraryMatches[key]?.matches ?? {}).length ||
            Object.keys(_libraryMatches[key]?.domQuerymatches ?? {}).length
          ) {
            _libraryMatchesUrlCount[key] =
              (_libraryMatchesUrlCount[key] || 0) + 1;
          }
        });

        return acc;
      }, {}) || {};

    return [_siteMapLibraryMatches, _libraryMatchesUrlCount];
  }, [completeJson]);

  const downloadReport = useCallback(async () => {
    if (!Array.isArray(completeJson)) {
      return;
    }

    await generateSiteMapReportandDownload(completeJson, appliedFilters, path);
  }, [appliedFilters, completeJson, path]);

  const [
    siteFilteredCookies,
    siteFilteredTechnologies,
    siteFilteredCompleteJson,
  ] = useMemo(() => {
    const reportData = completeJson?.find((data) =>
      isKeySelected(data.pageUrl)
    );

    if (!reportData) {
      return [{}, [], null];
    }

    const _cookies = extractCookies(reportData.cookieData, '', true);
    const _technologies = reportData.technologyData;

    return [_cookies, _technologies, [reportData]];
  }, [completeJson, isKeySelected]);

  return (
    <>
      {!selectedSite ? (
        <AssembledCookiesLanding
          tabCookies={tabCookies}
          tabFrames={tabFrames}
          libraryMatches={siteMapLibraryMatches}
          libraryMatchesUrlCount={libraryMatchesUrlCount}
          downloadReport={downloadReport}
          menuBarScrollContainerId="dashboard-sitemap-layout-container"
          setAppliedFilters={setAppliedFilters}
          query={query}
          clearQuery={clearQuery}
        />
      ) : (
        <SiteReport
          cookies={siteFilteredCookies}
          technologies={siteFilteredTechnologies}
          completeJson={siteFilteredCompleteJson}
          selectedSite={selectedSite || ''}
          path={path}
          libraryMatches={
            libraryMatches && selectedSite ? libraryMatches[selectedSite] : {}
          }
          query={query}
          clearQuery={clearQuery}
        />
      )}
    </>
  );
};

export default CookiesTab;
