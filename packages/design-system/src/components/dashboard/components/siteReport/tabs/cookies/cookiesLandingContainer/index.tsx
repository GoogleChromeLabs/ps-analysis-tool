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
import React, { useEffect, useMemo, useState } from 'react';
import {
  CookieTableData,
  getCookieKey,
  noop,
  type LibraryData,
  type TabCookies,
  type TabFrames,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  ChipsBar,
  FilterIcon,
  FiltersSidebar,
  useGlobalFiltering,
  type TableFilter,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Landing from './cookieLanding/landing';

interface AssembledCookiesLandingProps {
  tabCookies: TabCookies;
  tabFrames: TabFrames;
  setFilteredData: React.Dispatch<React.SetStateAction<TabCookies>>;
  setAppliedFilters: React.Dispatch<React.SetStateAction<TableFilter>>;
  downloadReport?: () => void;
  libraryMatches: LibraryData | null;
  libraryMatchesUrlCount?: {
    [url: string]: number;
  };
  isSiteMapLandingContainer?: boolean;
  menuBarScrollContainerId?: string;
  query?: string;
  clearQuery?: () => void;
}

const AssembledCookiesLanding = ({
  tabCookies,
  tabFrames,
  setFilteredData,
  setAppliedFilters,
  downloadReport,
  libraryMatches,
  libraryMatchesUrlCount,
  menuBarScrollContainerId = 'dashboard-layout-container',
  query = '',
  clearQuery = noop,
}: AssembledCookiesLandingProps) => {
  const cookies = useMemo(() => Object.values(tabCookies || {}), [tabCookies]);
  const filterOutput = useGlobalFiltering(cookies, query, clearQuery);

  const cookiesByKey = useMemo(() => {
    return (
      filterOutput?.filteredData.reduce<TabCookies>((acc, cookie) => {
        const cookieKey = getCookieKey(
          (cookie as CookieTableData).parsedCookie
        );

        if (!cookieKey) {
          return acc;
        }

        acc[cookieKey] = cookie as CookieTableData;

        return acc;
      }, {}) || {}
    );
  }, [filterOutput?.filteredData]);

  useEffect(() => {
    setFilteredData(cookiesByKey);
  }, [cookiesByKey, setFilteredData]);

  const cookiesWithIssues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(cookiesByKey).filter(([, cookie]) => cookie.isBlocked)
      ),
    [cookiesByKey]
  );

  useEffect(() => {
    setAppliedFilters(filterOutput?.selectedFilters);
  }, [filterOutput?.selectedFilters, setAppliedFilters]);

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center items-center flex-1 border-b border-gray-300 dark:border-quartz bg-anti-flash-white dark:bg-raisin-black">
        <button
          className="w-3 h-3 m-1 pl-1"
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
          title={I18n.getMessage('openFilterOptions')}
        >
          <FilterIcon
            className={
              showFilterSidebar
                ? 'text-royal-blue dark:text-medium-persian-blue'
                : 'text-mischka'
            }
          />
        </button>
        <ChipsBar
          selectedFilters={filterOutput?.selectedFilters || {}}
          resetFilters={filterOutput?.resetFilters || noop}
          toggleFilterSelection={filterOutput?.toggleFilterSelection || noop}
        />
      </div>
      <div
        className="flex grow-0"
        style={{
          height: 'calc(100% - 26px)',
        }}
      >
        {showFilterSidebar && (
          <Resizable
            minWidth="100px"
            maxWidth="50%"
            enable={{
              right: true,
            }}
            className="border border-r border-gray-300 dark:border-quartz"
          >
            <FiltersSidebar
              filters={filterOutput?.filters || {}}
              toggleFilterSelection={
                filterOutput?.toggleFilterSelection || noop
              }
              toggleSelectAllFilter={
                filterOutput?.toggleSelectAllFilter || noop
              }
              isSelectAllFilterSelected={
                filterOutput?.isSelectAllFilterSelected || noop
              }
            />
          </Resizable>
        )}
        <div
          className="flex-1 overflow-auto h-full"
          id="cookies-landing-scroll-container"
        >
          <Landing
            tabCookies={cookiesByKey}
            tabFrames={tabFrames}
            cookiesWithIssues={cookiesWithIssues}
            downloadReport={downloadReport}
            libraryMatches={libraryMatches}
            libraryMatchesUrlCount={libraryMatchesUrlCount}
            menuBarScrollContainerId={menuBarScrollContainerId}
          />
        </div>
      </div>
    </div>
  );
};

export default AssembledCookiesLanding;
