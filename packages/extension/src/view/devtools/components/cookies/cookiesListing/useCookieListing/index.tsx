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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getValueByKey,
  type CookieTableData,
  type TabCookies,
  BLOCK_STATUS,
} from '@ps-analysis-tool/common';
import {
  RefreshButton,
  type InfoType,
  type TableColumn,
  type TableFilter,
  type TableRow,
  type TableData,
  InfoIcon,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies
 */
import { useCookie, useSettings } from '../../../../stateProviders';
import useHighlighting from './useHighlighting';
import NamePrefixIconSelector from './namePrefixIconSelector';
import OrphanedUnMappedInfoDisplay from './orphanedUnMappedInfoDisplay';

const useCookieListing = (domainsInAllowList: Set<string>) => {
  const { selectedFrame, cookies, getCookiesSetByJavascript } = useCookie(
    ({ state, actions }) => ({
      selectedFrame: state.selectedFrame,
      cookies: state.tabCookies || {},
      getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
    })
  );

  const isUsingCDP = useSettings(({ state }) => state.isUsingCDP);

  const [tableData, setTableData] = useState<TabCookies>(cookies);

  useHighlighting(cookies, domainsInAllowList, setTableData);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 13,
        enableBodyCellPrefixIcon: isUsingCDP,
        bodyCellPrefixIcon: {
          Element: NamePrefixIconSelector,
        },
        showBodyCellPrefixIcon: (row: TableRow) => {
          const isBlocked = Boolean(
            (row.originalData as CookieTableData)?.blockingStatus
              ?.inboundBlock !== BLOCK_STATUS.NOT_BLOCKED ||
              (row.originalData as CookieTableData)?.blockingStatus
                ?.outboundBlock !== BLOCK_STATUS.NOT_BLOCKED
          );
          const isDomainInAllowList = Boolean(
            (row.originalData as CookieTableData)?.isDomainInAllowList
          );

          return isBlocked || isDomainInAllowList;
        },
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
        widthWeightagePercentage: 6,
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 8,
      },
      {
        header: 'Partition Key',
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 8,
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
        widthWeightagePercentage: 6,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 7.5,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => <span>{info ? info : 'Unknown'}</span>,
        widthWeightagePercentage: 7.5,
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 4,
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 4,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 7,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 3.5,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
        widthWeightagePercentage: 6,
      },
      {
        header: 'Priority',
        accessorKey: 'parsedCookie.priority',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 4,
      },
      {
        header: 'Size',
        accessorKey: 'parsedCookie.size',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 3,
      },
      {
        header: 'Mapping',
        accessorKey: 'frameIdList',
        isHiddenByDefault: true,
        cell: (info: InfoType) => (
          <OrphanedUnMappedInfoDisplay frameIdList={info as number[]} />
        ),
        widthWeightagePercentage: 6.6,
      },
      {
        header: 'Blocking Status',
        accessorKey: 'isBlocked',
        isHiddenByDefault: true,
        widthWeightagePercentage: 5.4,
        cell: (_, details: TableData | undefined) => {
          //skip calculation of blocking status when not using CDP
          if (!isUsingCDP) {
            return <></>;
          }
          const cookieData = details as CookieTableData;

          const isInboundBlocked =
            cookieData.blockingStatus?.inboundBlock !==
            BLOCK_STATUS.NOT_BLOCKED;
          const isOutboundBlocked =
            cookieData.blockingStatus?.outboundBlock !==
            BLOCK_STATUS.NOT_BLOCKED;
          const hasValidBlockedReason =
            cookieData?.blockedReasons &&
            cookieData.blockedReasons.length !== 0;

          if (
            (isInboundBlocked || isOutboundBlocked) &&
            !hasValidBlockedReason
          ) {
            return (
              <span
                className="flex"
                title="Please take a look at the network tab to get this cookie's blocking information."
              >
                <InfoIcon className="fill-granite-gray" />
                Undetermined
              </span>
            );
          } else if (hasValidBlockedReason) {
            return <span className="flex">Blocked</span>;
          } else {
            return <></>;
          }
        },
      },
    ],
    [isUsingCDP]
  );

  const [preCalculatedFilters, setPreCalculatedFilters] = useState<{
    categories: TableFilter[keyof TableFilter]['filterValues'];
    platforms: TableFilter[keyof TableFilter]['filterValues'];
    blockedReasons: TableFilter[keyof TableFilter]['filterValues'];
  }>({
    categories: {},
    platforms: {},
    blockedReasons: {},
  });

  useEffect(() => {
    const calculate = (
      key: string
    ): TableFilter[keyof TableFilter]['filterValues'] =>
      Object.values(cookies).reduce<
        TableFilter[keyof TableFilter]['filterValues']
      >((acc, cookie) => {
        const value = getValueByKey(key, cookie);

        if (!acc) {
          acc = {};
        }

        if (value) {
          acc[value] = {
            selected: false,
          };
        }

        return acc;
      }, {});

    const blockedReasonFilterValues = Object.values(cookies).reduce<
      TableFilter[keyof TableFilter]['filterValues']
    >((acc, cookie) => {
      const blockedReason = getValueByKey('blockedReasons', cookie);

      if (!cookie.frameIdList || cookie?.frameIdList?.length === 0) {
        return acc;
      }

      blockedReason?.forEach((reason: string) => {
        if (!acc) {
          acc = {};
        }

        acc[reason] = {
          selected: false,
        };
      });

      return acc;
    }, {});

    setPreCalculatedFilters({
      categories: calculate('analytics.category'),
      platforms: calculate('analytics.platform'),
      blockedReasons: blockedReasonFilterValues,
    });
  }, [cookies]);

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: 'Category',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: preCalculatedFilters.categories,
        sortValues: true,
        useGenericPersistenceKey: true,
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
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
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
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
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
        useGenericPersistenceKey: true,
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
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
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
        useGenericPersistenceKey: true,
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
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: preCalculatedFilters.platforms,
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      blockedReasons: {
        title: 'Blocked Reasons',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        filterValues: preCalculatedFilters.blockedReasons,
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string[];
          return val?.includes(filterValue);
        },
      },
      'parsedCookie.partitionKey': {
        title: 'Partition Key',
        hasStaticFilterValues: true,
        filterValues: {
          Set: {
            selected: false,
          },
          'Not Set': {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val ? filterValue === 'Set' : filterValue === 'Not Set';
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
        useGenericPersistenceKey: true,
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
        useGenericPersistenceKey: true,
      },
    }),
    [
      preCalculatedFilters.blockedReasons,
      preCalculatedFilters.categories,
      preCalculatedFilters.platforms,
    ]
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

  const extraInterfaceToTopBar = useCallback(() => {
    return (
      <RefreshButton
        onClick={getCookiesSetByJavascript}
        title="Refresh Cookies Set via Javascript"
      />
    );
  }, [getCookiesSetByJavascript]);

  return {
    tableData,
    tableColumns,
    filters,
    searchKeys,
    tablePersistentSettingsKey,
    extraInterfaceToTopBar,
  };
};

export default useCookieListing;
