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
import React, { useCallback, useMemo, useState } from 'react';
import {
  type CookieTableData,
  type TabCookies,
  BLOCK_STATUS,
} from '@google-psat/common';
import {
  RefreshButton,
  type InfoType,
  type TableColumn,
  type TableFilter,
  type TableRow,
  useSidebar,
  calculateDynamicFilterValues,
  evaluateStaticFilterValues,
  evaluateSelectAllOption,
  calculateBlockedReasonsFilterValues,
  calculateExemptionReason,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import { useCookie, useSettings } from '../../../../stateProviders';
import useHighlighting from './useHighlighting';
import NamePrefixIconSelector from './namePrefixIconSelector';

const useCookieListing = (domainsInAllowList: Set<string>) => {
  const { selectedFrame, cookies, getCookiesSetByJavascript } = useCookie(
    ({ state, actions }) => ({
      selectedFrame: state.selectedFrame,
      cookies: state.tabCookies || {},
      getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
    })
  );

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

  const isUsingCDP = useSettings(({ state }) => state.isUsingCDP);

  const [tableData, setTableData] = useState<TabCookies>(cookies);

  useHighlighting(cookies, domainsInAllowList, setTableData);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: I18n.getMessage('name'),
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
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
        minWidth: 45,
      },
      {
        header: I18n.getMessage('scope'),
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) =>
          I18n.getMessage(!info ? 'thirdParty' : 'firstParty'),
        minWidth: 50,
      },
      {
        header: I18n.getMessage('domain'),
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        minWidth: 55,
      },
      {
        header: I18n.getMessage('partitionKey'),
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        minWidth: 95,
      },
      {
        header: I18n.getMessage('sameSite'),
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) =>
          I18n.getMessage((info?.toString() || '').toLowerCase()),
        minWidth: 80,
      },
      {
        header: I18n.getMessage('category'),
        accessorKey: 'analytics.category',
        cell: (info: InfoType) =>
          I18n.getMessage((info as string).toLowerCase() || 'uncategorized'),
      },
      {
        header: I18n.getMessage('platform'),
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => (info ? info : I18n.getMessage('unknown')),
        initialWidth: 80,
        minWidth: 80,
      },
      {
        header: I18n.getMessage('httpOnly'),
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        minWidth: 80,
        initialWidth: 80,
      },
      {
        header: I18n.getMessage('secure'),
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        initialWidth: 50,
        minWidth: 70,
      },
      {
        header: I18n.getMessage('value'),
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        initialWidth: 80,
      },
      {
        header: I18n.getMessage('path'),
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        minWidth: 50,
        initialWidth: 50,
      },
      {
        header: I18n.getMessage('expires'),
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) =>
          info === 'Session' || !info ? I18n.getMessage('session') : info,
      },
      {
        header: I18n.getMessage('priority'),
        accessorKey: 'parsedCookie.priority',
        isHiddenByDefault: true,
        cell: (info: InfoType) =>
          I18n.getMessage((info as string)?.toLowerCase()),
      },
      {
        header: I18n.getMessage('size'),
        accessorKey: 'parsedCookie.size',
        isHiddenByDefault: true,
        cell: (info: InfoType) => info,
        minWidth: 120,
      },
    ],
    [isUsingCDP]
  );

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: I18n.getMessage('category'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('analytics')]: {
              selected: false,
            },
            [I18n.getMessage('functional')]: {
              selected: false,
            },
            [I18n.getMessage('marketing')]: {
              selected: false,
            },
            [I18n.getMessage('uncategorized')]: {
              selected: false,
            },
          },
          'analytics.category',
          parsedQuery,
          clearActivePanelQuery
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
      'parsedCookie.samesite': {
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
          return I18n.getMessage(val?.toLowerCase()) === filterValue;
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
          Object.values(cookies),
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
          parsedQuery
        ),
        filterValues: calculateBlockedReasonsFilterValues(
          Object.values(cookies),
          parsedQuery?.filter?.blockedReasons,
          clearActivePanelQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string[];
          return val?.includes(filterValue);
        },
      },
      'parsedCookie.partitionKey': {
        title: I18n.getMessage('partitionKey'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('set')]: {
            selected: false,
          },
          [I18n.getMessage('notSet')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val
            ? filterValue === I18n.getMessage('set')
            : filterValue === I18n.getMessage('notSet');
        },
      },
      headerType: {
        title: I18n.getMessage('setVia'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('http')]: {
            selected: false,
          },
          [I18n.getMessage('jS')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case I18n.getMessage('jS'):
              return value === 'javascript';
            case I18n.getMessage('http'):
              return (
                value === 'request' || value === 'response' || value === 'http'
              );
            default:
              return true;
          }
        },
      },
      'parsedCookie.priority': {
        title: I18n.getMessage('priority'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('low')]: {
            selected: false,
          },
          [I18n.getMessage('medium')]: {
            selected: false,
          },
          [I18n.getMessage('high')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = I18n.getMessage((value as string)?.toLowerCase());
          return val === filterValue;
        },
      },
      exemptionReason: {
        title: I18n.getMessage('exemptionReasons'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        isSelectAllOptionSelected: evaluateSelectAllOption(
          'exemptionReason',
          parsedQuery
        ),
        filterValues: calculateExemptionReason(
          Object.values(cookies),
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
    [clearActivePanelQuery, cookies, parsedQuery]
  );

  const searchKeys = useMemo<string[]>(
    () => ['parsedCookie.name', 'parsedCookie.domain'],
    []
  );

  const tablePersistentSettingsKey = useMemo(() => {
    if (!selectedFrame) {
      return 'cookiesListing';
    }

    return `cookiesListing#${selectedFrame}`;
  }, [selectedFrame]);

  const extraInterfaceToTopBar = useCallback(() => {
    return (
      <RefreshButton
        onClick={getCookiesSetByJavascript}
        title={I18n.getMessage('refreshJSCookies')}
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
    isSidebarOpen: parsedQuery?.filter ? true : false,
  };
};

export default useCookieListing;
