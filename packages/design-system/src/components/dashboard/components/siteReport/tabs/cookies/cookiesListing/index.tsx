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
import React, { useMemo, useState } from 'react';
import { Resizable } from 're-resizable';
import { type CookieTableData } from '@google-psat/common';

/**
 * Internal dependencies
 */
import CookieTable from '../../../../../../cookieTable';
import CookieDetails from '../../../../../../cookieDetails';
import useCookieListing from '../../../../../hooks/useCookieListing';
import { useContentStore } from '../../../stateProviders/contentStore';

/**
 * Internal dependencies
 */

interface CookiesListingProps {
  selectedFrameUrl: string;
  selectedSite?: string | null;
}

const CookiesListing = ({
  selectedFrameUrl,
  selectedSite,
}: CookiesListingProps) => {
  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  const { tabCookies, path } = useContentStore(({ state }) => ({
    tabCookies: state.tabCookies,
    path: state.path,
  }));

  const cookies = useMemo(
    () =>
      Object.values(tabCookies).filter((cookie) =>
        (cookie.frameUrls as string[]).includes(selectedFrameUrl)
      ),
    [tabCookies, selectedFrameUrl]
  );

  const memoTabCookies = useMemo(() => Object.values(tabCookies), [tabCookies]);

  const {
    tableColumns,
    filters,
    searchKeys,
    tablePersistentSettingsKey,
    isSidebarOpen,
  } = useCookieListing(
    memoTabCookies,
    selectedFrameUrl,
    'cookiesListing',
    selectedSite
  );
  //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
  const isCLI = globalThis?.PSAT_EXTENSION ? false : true;

  return (
    <div className="w-full h-full flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="6%"
        maxHeight="95%"
        enable={{
          bottom: true,
        }}
        className="h-full flex"
      >
        <CookieTable
          data={cookies}
          tableColumns={tableColumns}
          tableFilters={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          selectedFrame={selectedFrameUrl}
          selectedFrameCookie={selectedFrameCookie}
          setSelectedFrameCookie={setSelectedFrameCookie}
          isFiltersSidebarOpen={isSidebarOpen}
          isCLI={isCLI}
          hostname={path}
        />
      </Resizable>
      <CookieDetails
        isUsingCDP={true}
        selectedFrameCookie={selectedFrameCookie}
      />
    </div>
  );
};

export default CookiesListing;
