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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import { CookieDetails, CookieTable } from '@ps-analysis-tool/design-system';
import { type CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import useCookieListing from '../../hooks/useCookieListing';

interface CookiesWithIssuesProps {
  cookies: CookieTableData[];
  selectedSite: string | null;
}

const CookiesWithIssues = ({
  cookies,
  selectedSite,
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
        />
      </Resizable>
      <CookieDetails
        selectedFrameCookie={selectedFrameCookie}
        isUsingCDP={true}
      />
    </div>
  );
};

export default CookiesWithIssues;
