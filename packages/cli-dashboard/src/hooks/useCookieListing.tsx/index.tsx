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
import React, { useMemo } from 'react';
import type {
  InfoType,
  TableColumn,
  TableFilter,
} from '@ps-analysis-tool/design-system';
import { type CookieTableData } from '@ps-analysis-tool/common';
import calculateDynamicFilterValues from './utils/calculateDynamicFilterValues';
import calculateBlockedReasonsFilterValues from './utils/calculateBlockedReasonsFilterValues';

const useCookieListing = (
  tabCookies: CookieTableData[],
  selectedFrameUrl: string,
  persistenceKey = 'cookiesListing',
  selectedSite?: string | null
) => {
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
        widthWeightagePercentage: 8,
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
        widthWeightagePercentage: 8,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => info,
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
        widthWeightagePercentage: 10,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 4,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
        widthWeightagePercentage: 7,
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: 'Category',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateDynamicFilterValues(
          'analytics.category',
          tabCookies
        ),
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
        filterValues: calculateDynamicFilterValues(
          'analytics.platform',
          tabCookies
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      blockedReasons: {
        title: 'Blocked Reasons',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        filterValues: calculateBlockedReasonsFilterValues(tabCookies),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          return (value as string[])?.includes(filterValue);
        },
      },
    }),
    [tabCookies]
  );

  const searchKeys = useMemo<string[]>(
    () => ['parsedCookie.name', 'parsedCookie.domain'],
    []
  );

  const tablePersistentSettingsKey = useMemo(() => {
    if (selectedSite) {
      return persistenceKey + '#' + selectedSite + selectedFrameUrl;
    }

    return persistenceKey + '#' + selectedFrameUrl;
  }, [persistenceKey, selectedFrameUrl, selectedSite]);

  return {
    tableColumns,
    filters,
    searchKeys,
    tablePersistentSettingsKey,
  };
};

export default useCookieListing;
