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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Resizable } from 're-resizable';
import {
  filterCookiesByFrame,
  type CookieTableData,
  getCookieKey,
} from '@ps-analysis-tool/common';
import {
  CookieDetails,
  CookieTable,
  RefreshButton,
  type InfoType,
  type TableColumn,
  type TableFilter,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import { BLOCKED_REASON_LIST } from '../../../../../constants';
import RowContextMenu from './rowContextMenu';
import useAllowedList from './useAllowedList';

interface CookiesListingProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

const CookiesListing = ({ setFilteredCookies }: CookiesListingProps) => {
  const {
    selectedFrame,
    cookies,
    tabFrames,
    tabUrl,
    getCookiesSetByJavascript,
  } = useCookieStore(({ state, actions }) => ({
    selectedFrame: state.selectedFrame,
    cookies: state.tabCookies,
    tabFrames: state.tabFrames,
    tabUrl: state.tabUrl,
    getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
  }));

  const [tableData, setTableData] = useState<Record<string, CookieTableData>>(
    {}
  );

  const { domainsInAllowList, setDomainsInAllowListCallback, isIncognito } =
    useAllowedList();

  useEffect(() => {
    setTableData((prevData) =>
      Object.fromEntries(
        Object.entries(cookies || {}).map(([key, cookie]) => {
          const domain = cookie.parsedCookie?.domain || '';
          let _domain = '';

          if (domain) {
            _domain = domain.startsWith('.') ? domain : `.${domain}`;
          }

          let isDomainInAllowList = domainsInAllowList.has(_domain);

          if (!isDomainInAllowList) {
            isDomainInAllowList = [...domainsInAllowList].some(
              (storedDomain) => {
                // For example xyz.bbc.com and .bbc.com
                if (
                  _domain.endsWith(storedDomain) &&
                  _domain !== storedDomain
                ) {
                  return true;
                }

                return false;
              }
            );
          }

          cookie.highlighted = prevData?.[key]?.highlighted;
          cookie.isDomainInAllowList = isDomainInAllowList;

          return [key, cookie];
        })
      )
    );
  }, [cookies, domainsInAllowList]);

  const removeHighlights = useCallback(() => {
    setTableData((prev) =>
      Object.values(prev).reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;
        acc[key] = {
          ...cookie,
          highlighted: false,
        };

        return acc;
      }, {} as Record<string, CookieTableData>)
    );
  }, []);

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(removeHighlights);

    return () => {
      try {
        chrome.storage.session.onChanged.removeListener(removeHighlights);
      } catch (error) {
        /* do nothing */
      }
    };
  }, [removeHighlights]);

  const frameFilteredCookies = useMemo(
    () => filterCookiesByFrame(tableData, tabFrames, selectedFrame),
    [tableData, selectedFrame, tabFrames]
  );

  useEffect(() => {
    setFilteredCookies(frameFilteredCookies);
  }, [frameFilteredCookies, setFilteredCookies]);

  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Partition Key',
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => <span>{info ? info : 'Unknown'}</span>,
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
      },
      {
        header: 'Priority',
        accessorKey: 'parsedCookie.priority',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Size',
        accessorKey: 'parsedCookie.size',
        cell: (info: InfoType) => info,
      },
    ],
    []
  );

  const blockedReasonFilterValues = useMemo<{
    [key: string]: { selected: boolean };
  }>(() => {
    const filterValues: { [key: string]: { selected: boolean } } = {};

    BLOCKED_REASON_LIST.forEach((reason) => {
      filterValues[reason] = { selected: false };
    });
    return filterValues;
  }, []);

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: 'Category',
      },
      isFirstParty: {
        title: 'Scope',
        hasStaticFilterValues: true,
        filterValues: {
          'First Party': {
            selected: false,
          },
          'Third Party': {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'First Party');
        },
      },
      'parsedCookie.domain': {
        title: 'Domain',
      },
      'parsedCookie.httponly': {
        title: 'HttpOnly',
        hasStaticFilterValues: true,
        filterValues: {
          True: {
            selected: false,
          },
          False: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'True');
        },
      },
      'parsedCookie.samesite': {
        title: 'SameSite',
        hasStaticFilterValues: true,
        filterValues: {
          None: {
            selected: false,
          },
          Lax: {
            selected: false,
          },
          Strict: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val?.toLowerCase() === filterValue.toLowerCase();
        },
      },
      'parsedCookie.secure': {
        title: 'Secure',
        hasStaticFilterValues: true,
        filterValues: {
          True: {
            selected: false,
          },
          False: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'True');
        },
      },
      'parsedCookie.path': {
        title: 'Path',
      },
      'parsedCookie.expires': {
        title: 'Retention Period',
        hasStaticFilterValues: true,
        filterValues: {
          Session: {
            selected: false,
          },
          'Short Term (< 24h)': {
            selected: false,
          },
          'Medium Term (24h - 1 week)': {
            selected: false,
          },
          'Long Term (1 week - 1 month)': {
            selected: false,
          },
          'Extended Term (> 1 month)': {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          let diff = 0;
          const val = value as string;
          switch (filterValue) {
            case 'Session':
              return val === 'Session';

            case 'Short Term (< 24h)':
              diff = Date.parse(val) - Date.now();
              return diff < 86400000;

            case 'Medium Term (24h - 1 week)':
              diff = Date.parse(val) - Date.now();
              return diff >= 86400000 && diff < 604800000;

            case 'Long Term (1 week - 1 month)':
              diff = Date.parse(val) - Date.now();
              return diff >= 604800000 && diff < 2629743833;

            case 'Extended Term (> 1 month)':
              diff = Date.parse(val) - Date.now();
              return diff >= 2629743833;

            default:
              return false;
          }
        },
      },
      'analytics.platform': {
        title: 'Platform',
      },
      blockedReasons: {
        title: 'Cookie Blocked Reasons',
        description: 'Reason why the cookies were blocked.',
        hasStaticFilterValues: true,
        filterValues: blockedReasonFilterValues,
        comparator: (value: InfoType, filterValue: string) => {
          return (value as string[])?.includes(filterValue);
        },
      },
      headerType: {
        title: 'Set Via',
        hasStaticFilterValues: true,
        filterValues: {
          HTTP: {
            selected: false,
          },
          JS: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'JS':
              return value === 'javascript';
            case 'HTTP':
              return value === 'request' || value === 'response';
            default:
              return true;
          }
        },
      },
      'parsedCookie.priority': {
        title: 'Priority',
        hasStaticFilterValues: true,
        filterValues: {
          Low: {
            selected: false,
          },
          Medium: {
            selected: false,
          },
          High: {
            selected: false,
          },
        },
      },
    }),
    [blockedReasonFilterValues]
  );

  const searchKeys = useMemo<string[]>(
    () => ['parsedCookie.name', 'parsedCookie.domain'],
    []
  );

  const tablePersistentSettingsKey = useMemo(() => {
    if (!selectedFrame) {
      return 'cookieListing';
    }

    return `cookieListing#${selectedFrame}`;
  }, [selectedFrame]);

  const extraInterfaceToTopBar = useMemo(
    () => <RefreshButton onClick={getCookiesSetByJavascript} />,
    [getCookiesSetByJavascript]
  );

  const cookieTableRef = useRef<React.ElementRef<typeof CookieTable> | null>(
    null
  );

  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenu
  > | null>(null);

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
          data={frameFilteredCookies}
          tableColumns={tableColumns}
          showTopBar={true}
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
      <CookieDetails selectedFrameCookie={selectedFrameCookie} />
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
