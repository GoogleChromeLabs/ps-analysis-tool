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
import { getValueByKey, type TabCookies } from '@ps-analysis-tool/common';
import {
  RefreshButton,
  type InfoType,
  type TableColumn,
  type TableFilter,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies
 */
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import useHighlighting from './useHighlighting';

const useCookieListing = (domainsInAllowList: Set<string>) => {
  const { selectedFrame, cookies, getCookiesSetByJavascript } = useCookieStore(
    ({ state, actions }) => ({
      selectedFrame: state.selectedFrame,
      cookies: state.tabCookies || {},
      getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
    })
  );

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
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
        widthWeightagePercentage: 6.6,
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: 'Partition Key',
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
        widthWeightagePercentage: 6.5,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 8,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => <span>{info ? info : 'Unknown'}</span>,
        widthWeightagePercentage: 10,
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 7.8,
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
        widthWeightagePercentage: 7.8,
      },
      {
        header: 'Priority',
        accessorKey: 'parsedCookie.priority',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 5.4,
      },
      {
        header: 'Size',
        accessorKey: 'parsedCookie.size',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 3.4,
      },
    ],
    []
  );

  const preCalculatedFilters = useMemo<{
    category: TableFilter[keyof TableFilter]['filterValues'];
    platform: TableFilter[keyof TableFilter]['filterValues'];
    blockedReason: TableFilter[keyof TableFilter]['filterValues'];
  }>(() => {
    const calculate = (
      key: string
    ): TableFilter[keyof TableFilter]['filterValues'] =>
      Object.values(cookies).reduce((acc, cookie) => {
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
      }, {} as TableFilter[keyof TableFilter]['filterValues']);

    const blockedReasonFilterValues = Object.values(cookies).reduce(
      (acc, cookie) => {
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
      },
      {} as TableFilter[keyof TableFilter]['filterValues']
    );

    return {
      category: calculate('analytics.category'),
      platform: calculate('analytics.platform'),
      blockedReason: blockedReasonFilterValues,
    };
  }, [cookies]);

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: 'Category',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: preCalculatedFilters.category,
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
        useGenericPersistenceKey: true,
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
        filterValues: preCalculatedFilters.platform,
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      blockedReasons: {
        title: 'Blocked Reasons',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        filterValues: preCalculatedFilters.blockedReason,
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
      preCalculatedFilters.blockedReason,
      preCalculatedFilters.category,
      preCalculatedFilters.platform,
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

  const extraInterfaceToTopBar = useMemo(() => {
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
