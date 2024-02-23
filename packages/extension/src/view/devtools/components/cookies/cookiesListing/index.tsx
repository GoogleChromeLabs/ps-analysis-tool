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
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Resizable } from 're-resizable';
import {
  filterCookiesByFrame,
  type CookieTableData,
} from '@ps-analysis-tool/common';
import { CookieDetails, CookieTable } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import useCookieListing from './useCookieListing';
import RowContextMenu from './rowContextMenu';
import useAllowedList from './useAllowedList';
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';

interface CookiesListingProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

const CookiesListing = ({ setFilteredCookies }: CookiesListingProps) => {
  const { selectedFrame, tabFrames, tabUrl } = useCookieStore(({ state }) => ({
    selectedFrame: state.selectedFrame,
    tabFrames: state.tabFrames,
    tabUrl: state.tabUrl,
  }));

  const isUsingCDP = useSettingsStore(({ state }) => state.isUsingCDP);

  const { domainsInAllowList, setDomainsInAllowListCallback, isIncognito } =
    useAllowedList();

  const {
    tableData,
    tableColumns,
    filters,
    searchKeys,
    tablePersistentSettingsKey,
    extraInterfaceToTopBar,
  } = useCookieListing(domainsInAllowList);

  const frameFilteredCookies = useMemo(
    () => filterCookiesByFrame(tableData, tabFrames, selectedFrame),
    [tableData, selectedFrame, tabFrames]
  );

  const cookieTableRef = useRef<React.ElementRef<typeof CookieTable> | null>(
    null
  );
  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenu
  > | null>(null);

  useEffect(() => {
    setFilteredCookies(frameFilteredCookies);
  }, [frameFilteredCookies, setFilteredCookies]);

  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
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
          queryIsBlockedToHighlight={!isUsingCDP} // TODO: Remove this, and mend cookie object, as it should not have data in blockedStatus when isUsingCDP is false.
          data={frameFilteredCookies}
          tableColumns={tableColumns}
          tableFilters={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          selectedFrame={selectedFrame}
          selectedFrameCookie={selectedFrameCookie}
          setSelectedFrameCookie={setSelectedFrameCookie}
          extraInterfaceToTopBar={extraInterfaceToTopBar}
          onRowContextMenu={rowContextMenuRef.current?.onRowContextMenu}
          ref={cookieTableRef}
        />
      </Resizable>
      <CookieDetails
        isUsingCDP={isUsingCDP}
        selectedFrameCookie={selectedFrameCookie}
      />
      <RowContextMenu
        domainsInAllowList={domainsInAllowList}
        isIncognito={isIncognito}
        tabUrl={tabUrl || ''}
        setDomainsInAllowListCallback={setDomainsInAllowListCallback}
        removeSelectedRow={cookieTableRef.current?.removeSelectedRow}
        ref={rowContextMenuRef}
      />
    </div>
  );
};

export default CookiesListing;
