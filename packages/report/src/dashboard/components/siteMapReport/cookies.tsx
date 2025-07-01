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
import { useCallback, useMemo, useState } from 'react';
import {
  noop,
  type CompleteJson,
  type TabCookies,
  type TabFrames,
  extractCookies,
} from '@google-psat/common';
import { useSidebar, type TableFilter } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import AssembledCookiesLanding from '../siteReport/tabs/cookies/cookiesLandingContainer';
import SiteReport from '../siteReport';
import { generateSiteMapReportandDownload } from '../utils/reportDownloader';

interface CookiesTabProps {
  selectedSite?: string;
  tabCookies: TabCookies;
  tabFrames: TabFrames;
  completeJson: CompleteJson[] | null;
  path: string;
  query?: string;
  clearQuery?: () => void;
}

const CookiesTab = ({
  selectedSite,
  tabCookies,
  tabFrames,
  completeJson,
  path,
  query = '',
  clearQuery = noop,
}: CookiesTabProps) => {
  const isKeySelected = useSidebar(({ actions }) => actions.isKeySelected);
  const [appliedFilters, setAppliedFilters] = useState<TableFilter>({});

  const downloadReport = useCallback(async () => {
    if (!Array.isArray(completeJson)) {
      return;
    }

    await generateSiteMapReportandDownload(completeJson, appliedFilters, path);
  }, [appliedFilters, completeJson, path]);

  const [siteFilteredCookies, siteFilteredCompleteJson] = useMemo(() => {
    const reportData = completeJson?.find((data) =>
      isKeySelected(data.pageUrl)
    );

    if (!reportData) {
      return [{}, [], null];
    }

    const _cookies = extractCookies(reportData.cookieData, '', true);

    return [_cookies, [reportData]];
  }, [completeJson, isKeySelected]);

  const sitemapPath =
    // @ts-ignore - Global object
    globalThis?.PSAT_DATA?.siteMapUrl || globalThis?.PSAT_DATA?.selectedSite;

  return (
    <>
      {!selectedSite ? (
        <AssembledCookiesLanding
          tabCookies={tabCookies}
          tabFrames={tabFrames}
          downloadReport={downloadReport}
          menuBarScrollContainerId="dashboard-sitemap-layout-container"
          setAppliedFilters={setAppliedFilters}
          query={query}
          clearQuery={clearQuery}
          url={sitemapPath}
        />
      ) : (
        <SiteReport
          cookies={siteFilteredCookies}
          completeJson={siteFilteredCompleteJson}
          selectedSite={selectedSite || ''}
          path={path}
          query={query}
          clearQuery={clearQuery}
        />
      )}
    </>
  );
};

export default CookiesTab;
