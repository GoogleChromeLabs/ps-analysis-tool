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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import { CookieDetails, CookieTable } from '@ps-analysis-tool/design-system';
import type { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import useCookieListing from './useCookieListing';

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

  const {
    cookies,
    tableColumns,
    filters,
    searchKeys,
    tablePersistentSettingsKey,
  } = useCookieListing(selectedFrameUrl, selectedSite);

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
          showTopBar={true}
          tableFilters={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          selectedFrame={selectedFrameUrl}
          selectedFrameCookie={selectedFrameCookie}
          hideExport
          setSelectedFrameCookie={setSelectedFrameCookie}
        />
      </Resizable>
      <CookieDetails selectedFrameCookie={selectedFrameCookie} />
    </div>
  );
};

export default CookiesListing;
