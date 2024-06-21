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
  calculateExemptionReason,
  type TableRow,
} from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';
import { type CookieTableData, BLOCK_STATUS } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import NamePrefixIconSelector from '../../components/utils/NamePrefixIconSelector';

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
        header: I18n.getMessage('name'),
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 13,
        enableBodyCellPrefixIcon: true,
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
        header: I18n.getMessage('scope'),
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) =>
          !info ? I18n.getMessage('thirdParty') : I18n.getMessage('firstParty'),
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('domain'),
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: I18n.getMessage('partitionKey'),
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 9,
      },
      {
        header: I18n.getMessage('sameSite'),
        accessorKey: 'parsedCookie.sameSite',
        cell: (info: InfoType) =>
          I18n.getMessage((info?.toString() || '').toLowerCase()),
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('category'),
        accessorKey: 'analytics.category',
        cell: (info: InfoType) =>
          I18n.getMessage((info as string).toLowerCase() || 'uncategorized'),
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('platform'),
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => (info ? info : I18n.getMessage('unknown')),
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('httpOnly'),
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: I18n.getMessage('secure'),
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 5,
      },
      {
        header: I18n.getMessage('value'),
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: I18n.getMessage('path'),
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 4,
      },
      {
        header: I18n.getMessage('expires'),
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) =>
          info === 'Session' || !info ? I18n.getMessage('session') : info,
        widthWeightagePercentage: 7,
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: I18n.getMessage('category'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateDynamicFilterValues(
          'analytics.category',
          tabCookies,
          parsedQuery?.filter?.['analytics.category'],
          clearActivePanelQuery,
          true
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return (
            I18n.getMessage(val?.toLowerCase() || 'uncategorized') ===
            filterValue
          );
        },
      },
      isFirstParty: {
        title: I18n.getMessage('scope'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('firstParty')]: {
              selected: false,
            },
            [I18n.getMessage('thirdParty')]: {
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
          return val === (filterValue === I18n.getMessage('firstParty'));
        },
      },
      'parsedCookie.domain': {
        title: I18n.getMessage('domain'),
      },
      'parsedCookie.httponly': {
        title: I18n.getMessage('httpOnly'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('true')]: {
            selected: false,
          },
          [I18n.getMessage('false')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('true'));
        },
      },
      'parsedCookie.sameSite': {
        title: I18n.getMessage('sameSite'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('none')]: {
            selected: false,
          },
          [I18n.getMessage('lax')]: {
            selected: false,
          },
          [I18n.getMessage('strict')]: {
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
        title: I18n.getMessage('secure'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('true')]: {
            selected: false,
          },
          [I18n.getMessage('false')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('true'));
        },
      },
      'parsedCookie.path': {
        title: I18n.getMessage('path'),
      },
      'parsedCookie.expires': {
        title: I18n.getMessage('retentionPeriod'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('session')]: {
            selected: false,
          },
          [I18n.getMessage('shortTerm')]: {
            selected: false,
          },
          [I18n.getMessage('mediumTerm')]: {
            selected: false,
          },
          [I18n.getMessage('longTerm')]: {
            selected: false,
          },
          [I18n.getMessage('extentedTerm')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          let diff = 0;
          const val = value as string;
          switch (filterValue) {
            case I18n.getMessage('session'):
              return val === 'Session';

            case I18n.getMessage('shortTerm'):
              diff = Date.parse(val) - Date.now();
              return diff < 86400000;

            case I18n.getMessage('mediumTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 86400000 && diff < 604800000;

            case I18n.getMessage('longTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 604800000 && diff < 2629743833;

            case I18n.getMessage('extentedTerm'):
              diff = Date.parse(val) - Date.now();
              return diff >= 2629743833;

            default:
              return false;
          }
        },
      },
      'analytics.platform': {
        title: I18n.getMessage('platform'),
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
        title: I18n.getMessage('blockedReasons'),
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
      exemptionReason: {
        title: 'Exemption Reason',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        isSelectAllOptionSelected: evaluateSelectAllOption(
          'exemptionReason',
          parsedQuery
        ),
        filterValues: calculateExemptionReason(
          tabCookies,
          clearActivePanelQuery,
          parsedQuery?.filter?.exemptionReason
        ),
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val === filterValue;
        },
        useGenericPersistenceKey: true,
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
