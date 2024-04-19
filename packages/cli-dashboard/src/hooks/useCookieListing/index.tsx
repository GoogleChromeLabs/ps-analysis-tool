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
import {
  useSidebar,
  type InfoType,
  type TableColumn,
  type TableFilter,
  calculateBlockedReasonsFilterValues,
  calculateDynamicFilterValues,
  evaluateSelectAllOption,
  evaluateStaticFilterValues,
} from '@ps-analysis-tool/design-system';
import {
  calculateEffectiveExpiryDate,
  type CookieTableData,
} from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

const useCookieListing = (
  tabCookies: CookieTableData[],
  selectedFrameUrl: string,
  persistenceKey = 'cookiesListing',
  selectedSite?: string | null
) => {
  const { activePanelQuery, clearActivePanelQuery } = useSidebar(
    ({ state }) => ({
      activePanelQuery: state.activePanel.query,
      clearActivePanelQuery: state.activePanel.clearQuery,
    })
  );

  const parsedQuery = useMemo(
    () => JSON.parse(activePanelQuery || '{}'),
    [activePanelQuery]
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: I18n.getMessage('cdName'),
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 15,
      },
      {
        header: I18n.getMessage('cdScope'),
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info
              ? I18n.getMessage('cdThirdParty')
              : I18n.getMessage('cdFirstParty')}
          </p>
        ),
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('cdDomain'),
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: I18n.getMessage('cdPartitionKey'),
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: I18n.getMessage('cdSameSite'),
        accessorKey: 'parsedCookie.sameSite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('cdCategory'),
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('cdPlatform'),
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('cdHttpOnly'),
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: I18n.getMessage('cdSecure'),
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: I18n.getMessage('cdValue'),
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('cdPath'),
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 4,
      },
      {
        header: I18n.getMessage('cdExpires'),
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) =>
          info
            ? calculateEffectiveExpiryDate(info as string)
            : I18n.getMessage('cdSession'),
        widthWeightagePercentage: 7,
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: I18n.getMessage('cdCategory'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateDynamicFilterValues(
          'analytics.category',
          tabCookies,
          parsedQuery?.filter?.['analytics.category'],
          clearActivePanelQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      isFirstParty: {
        title: I18n.getMessage('cdScope'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('cdFirstParty')]: {
              selected: false,
            },
            [I18n.getMessage('cdThirdParty')]: {
              selected: false,
            },
          },
          'isFirstParty',
          parsedQuery,
          clearActivePanelQuery
        ),
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('cdFirstParty'));
        },
      },
      'parsedCookie.domain': {
        title: I18n.getMessage('cdDomain'),
      },
      'parsedCookie.httponly': {
        title: I18n.getMessage('cdHttpOnly'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('cdTrue')]: {
            selected: false,
          },
          [I18n.getMessage('cdFalse')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('cdTrue'));
        },
      },
      'parsedCookie.samesite': {
        title: I18n.getMessage('cdSameSite'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('clNone')]: {
            selected: false,
          },
          [I18n.getMessage('clLax')]: {
            selected: false,
          },
          [I18n.getMessage('clStrict')]: {
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
        title: I18n.getMessage('cdSecure'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('cdTrue')]: {
            selected: false,
          },
          [I18n.getMessage('cdFalse')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('cdTrue'));
        },
      },
      'parsedCookie.path': {
        title: I18n.getMessage('cdPath'),
      },
      'parsedCookie.expires': {
        title: I18n.getMessage('extRetentionPeriod'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('extSession')]: {
            selected: false,
          },
          [I18n.getMessage('extShortTerm')]: {
            selected: false,
          },
          [I18n.getMessage('extMediumTerm')]: {
            selected: false,
          },
          [I18n.getMessage('extLongTerm')]: {
            selected: false,
          },
          [I18n.getMessage('extExtentedTerm')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          let diff = 0;
          const val = value as string;
          switch (filterValue) {
            case I18n.getMessage('extSession'):
              return val === I18n.getMessage('extSession');

            case I18n.getMessage('extShortTerm'):
              diff = Date.parse(val) - Date.now();
              return diff < 86400000;

            case I18n.getMessage('extMediumTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 86400000 && diff < 604800000;

            case I18n.getMessage('extLongTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 604800000 && diff < 2629743833;

            case I18n.getMessage('extExtentedTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 2629743833;

            default:
              return false;
          }
        },
      },
      'analytics.platform': {
        title: I18n.getMessage('cdPlatform'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateDynamicFilterValues(
          'analytics.platform',
          tabCookies,
          parsedQuery?.filter?.['analytics.platform'],
          clearActivePanelQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      blockedReasons: {
        title: I18n.getMessage('cdBlockedReasons'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        isSelectAllOptionSelected: evaluateSelectAllOption(
          'blockedReasons',
          parsedQuery,
          clearActivePanelQuery
        ),
        filterValues: calculateBlockedReasonsFilterValues(
          tabCookies,
          parsedQuery?.filter?.blockedReasons,
          clearActivePanelQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          return (value as string[])?.includes(filterValue);
        },
      },
    }),
    [clearActivePanelQuery, parsedQuery, tabCookies]
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
    isSidebarOpen: parsedQuery?.filter ? true : false,
  };
};

export default useCookieListing;
