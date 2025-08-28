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
import { useState } from 'react';
import { type CookieTableData } from '@google-psat/common';
import {
  CookieTable,
  CookieDetails,
  ResizableTray,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import useCookieListing from '../../hooks/useCookieListing';

interface CookiesWithIssuesProps {
  cookies: CookieTableData[];
  selectedSite: string | null;
  hostName: string;
}

const CookiesWithIssues = ({
  cookies,
  selectedSite,
  hostName,
}: CookiesWithIssuesProps) => {
  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  const { tableColumns, filters, searchKeys, tablePersistentSettingsKey } =
    useCookieListing(
      cookies,
      'frame',
      'cookiesWithIssuesListing',
      selectedSite
    );

  //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
  const isCLI = globalThis?.PSAT_EXTENSION ? false : true;

  return (
    <div className="w-full h-full flex flex-col">
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="6%"
        maxHeight="95%"
        trayId="cookies-with-issues-table"
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
        }}
        className="h-full flex"
      >
        <CookieTable
          data={cookies}
          tableColumns={tableColumns}
          tableFilters={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          selectedFrame={selectedSite}
          selectedFrameCookie={selectedFrameCookie}
          hideExport={true}
          setSelectedFrameCookie={setSelectedFrameCookie}
          isCLI={isCLI}
          hostname={hostName}
        />
      </ResizableTray>
      <CookieDetails
        showBlockedCookies
        selectedFrameCookie={selectedFrameCookie}
        isUsingCDP={true}
      />
    </div>
  );
};

export default CookiesWithIssues;
