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
import { useMemo, useCallback, useState } from 'react';
import { noop, type TabFrames } from '@google-psat/common';
import { type TableFilter } from '@google-psat/design-system';

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
  url?: string;
}

const CookiesTab = ({
  selectedFrameUrl,
  selectedSite,
  query = '',
  clearQuery = noop,
  url = '',
}: CookiesTabProps) => {
  const { tabCookies, completeJson } = useContentStore(({ state }) => ({
    tabCookies: state.tabCookies,
    completeJson: state.completeJson,
  }));

  const [appliedFilters, setAppliedFilters] = useState<TableFilter>({});

  const tabFrames = useMemo(() => {
    const frames = Object.keys(
      completeJson?.[0]?.cookieData ?? {}
    ).reduce<TabFrames>((acc, _url) => {
      if (_url?.includes('http')) {
        acc[_url] = {} as TabFrames[string];
      }

      return acc;
    }, {});

    return frames;
  }, [completeJson]);

  const downloadReport = useCallback(async () => {
    if (!completeJson) {
      return;
    }

    if (completeJson.length > 1) {
      await generateSiteReportandDownload(
        completeJson,
        appliedFilters,
        selectedSite
      );
    } else {
      await generateSiteReportandDownload(completeJson, appliedFilters);
    }
  }, [appliedFilters, completeJson, selectedSite]);

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
            tabCookies={tabCookies}
            tabFrames={tabFrames}
            downloadReport={downloadReport}
            setAppliedFilters={setAppliedFilters}
            query={query}
            clearQuery={clearQuery}
            url={url}
          />
        </div>
      )}
    </div>
  );
};

export default CookiesTab;
