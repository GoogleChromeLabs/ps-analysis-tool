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
} from '@ps-analysis-tool/common';
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
import { I18n } from '@ps-analysis-tool/i18n';

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
        header: I18n.getMessage('extName'),
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
        header: I18n.getMessage('extScope'),
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
        widthWeightagePercentage: 6,
      },
      {
        header: I18n.getMessage('extDomain'),
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('extPartitionKey'),
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 8,
      },
      {
        header: I18n.getMessage('extSameSite'),
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
        widthWeightagePercentage: 6,
      },
      {
        header: I18n.getMessage('extCategory'),
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 7.5,
      },
      {
        header: I18n.getMessage('extPlatform'),
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => <span>{info ? info : 'Unknown'}</span>,
        widthWeightagePercentage: 7.5,
      },
      {
        header: I18n.getMessage('extHttpOnly'),
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 4,
      },
      {
        header: I18n.getMessage('extSecure'),
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
        widthWeightagePercentage: 4,
      },
      {
        header: I18n.getMessage('extValue'),
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 7,
      },
      {
        header: I18n.getMessage('extPath'),
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 3.5,
      },
      {
        header: I18n.getMessage('extExpires'),
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
        widthWeightagePercentage: 6,
      },
      {
        header: I18n.getMessage('extPriority'),
        accessorKey: 'parsedCookie.priority',
        isHiddenByDefault: true,
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 4,
      },
      {
        header: I18n.getMessage('extSize'),
        accessorKey: 'parsedCookie.size',
        isHiddenByDefault: true,
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 3,
      },
      {
        header: I18n.getMessage('extMapping'),
        accessorKey: 'frameIdList',
        isHiddenByDefault: true,
        cell: (info: InfoType) => (
          <OrphanedUnMappedInfoDisplay frameIdList={info as number[]} />
        ),
        widthWeightagePercentage: 6.6,
      },
      {
        header: I18n.getMessage('extBlockingStatus'),
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
                title={I18n.getMessage('extLookAtNetworkTab')}
              >
                <InfoIcon className="fill-granite-gray" />
                {I18n.getMessage('extUndetermined')}
              </span>
            );
          } else if (hasValidBlockedReason) {
            return (
              <span className="flex">{I18n.getMessage('extBlocked')}</span>
            );
          } else {
            return <></>;
          }
        },
      },
    ],
    [isUsingCDP]
  );

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: I18n.getMessage('extCategory'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateDynamicFilterValues(
          'analytics.category',
          Object.values(cookies),
          parsedQuery?.filter?.['analytics.category'],
          clearActivePanelQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      isFirstParty: {
        title: I18n.getMessage('extScope'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('extFirstParty')]: {
              selected: false,
            },
            [I18n.getMessage('extThirdParty')]: {
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
          return val === (filterValue === I18n.getMessage('extFirstParty'));
        },
      },
      'parsedCookie.domain': {
        title: I18n.getMessage('extDomain'),
      },
      'parsedCookie.httponly': {
        title: I18n.getMessage('extHttpOnly'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('extTrue')]: {
            selected: false,
          },
          [I18n.getMessage('extFalse')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('extTrue'));
        },
      },
      'parsedCookie.samesite': {
        title: I18n.getMessage('extSameSite'),
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
        title: I18n.getMessage('extSecure'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('extTrue')]: {
            selected: false,
          },
          [I18n.getMessage('extFalse')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('extTrue'));
        },
      },
      'parsedCookie.path': {
        title: I18n.getMessage('extPath'),
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
        title: I18n.getMessage('extPlatform'),
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
        title: I18n.getMessage('extBlockedReasons'),
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
        title: I18n.getMessage('extPartitionKey'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('extSet')]: {
            selected: false,
          },
          [I18n.getMessage('extNotSet')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val
            ? filterValue === I18n.getMessage('extSet')
            : filterValue === I18n.getMessage('extNotSet');
        },
      },
      headerType: {
        title: I18n.getMessage('extSetVia'),
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('extHttp')]: {
            selected: false,
          },
          [I18n.getMessage('extJS')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case I18n.getMessage('extJS'):
              return value === 'javascript';
            case I18n.getMessage('extHttp'):
              return value === 'request' || value === 'response';
            default:
              return true;
          }
        },
      },
      'parsedCookie.priority': {
        title: I18n.getMessage('extPriority'),
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
    [clearActivePanelQuery, cookies, parsedQuery]
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
        title={I18n.getMessage('extRefreshJSCookies')}
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
