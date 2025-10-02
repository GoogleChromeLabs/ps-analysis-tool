/*
 * Copyright 2025 Google LLC
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
import {
  type InfoType,
  type TabItem,
  type TableColumn,
  type TableFilter,
} from '@google-psat/design-system';
import React, { useCallback, useMemo, useState } from 'react';
import { isValidURL, type PRTMetadata } from '@google-psat/common';

/**
 * Internal dependencies
 */
import {
  useProbabilisticRevealTokens,
  useScriptBlocking,
} from '../../../../stateProviders';
import MdlCommonPanel from '../../mdlCommon';
import getSignal from '../../../../../../utils/getSignal';
import Glossary from '../../mdlCommon/glossary';
import BottomTray from '../../../privateAdvertising/protectedAudience/auctions/components/table/bottomTray';

const ProbabilisticRevealTokens = () => {
  const [selectedJSON, setSelectedJSON] = useState<PRTMetadata | null>(null);
  const [preSetFilters, setPresetFilters] = useState<{
    [key: string]: Record<string, string[]>;
  }>({ filter: {} });

  const {
    perTokenMetadata,
    decryptedTokensData,
    prtTokensData,
    plainTextTokensData,
    statistics,
  } = useProbabilisticRevealTokens(({ state }) => ({
    perTokenMetadata: state.perTokenMetadata,
    decryptedTokensData: state.decryptedTokens,
    prtTokensData: state.prtTokens,
    plainTextTokensData: state.plainTextTokens,
    statistics: state.statistics,
  }));

  const { scriptBlockingData, isLoading } = useScriptBlocking(({ state }) => ({
    scriptBlockingData: state.scriptBlockingData,
    isLoading: state.isLoading,
  }));

  const stats = useMemo(
    () => [
      {
        title: 'Domains',
        centerCount: perTokenMetadata.length,
        color: '#F3AE4E',
        glossaryText: 'Unique domains on page',
        onClick: () => setPresetFilters({ filter: {} }),
      },
      {
        title: 'MDL',
        centerCount: perTokenMetadata.filter(({ origin }) => {
          let hostname = isValidURL(origin) ? new URL(origin).hostname : '';

          hostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

          if (!hostname) {
            return false;
          }

          return (
            scriptBlockingData.filter((_data) => _data.domain === hostname)
              .length > 0
          );
        }).length,
        onClick: () =>
          setPresetFilters((prev) => ({
            ...prev,
            filter: {
              mdl: ['True'],
            },
          })),
        color: '#4C79F4',
        glossaryText: 'Page domains in MDL',
      },
      {
        title: 'PRT',
        centerCount: statistics.localView.totalTokens,
        color: '#EC7159',
        glossaryText: 'Unique tokens sent in requests',
        onClick: () => setPresetFilters({ filter: {} }),
      },
      {
        title: 'Signals',
        centerCount: statistics.localView.nonZeroSignal,
        color: '#5CC971',
        glossaryText: 'PRTs that decode to IP address',
        onClick: () =>
          setPresetFilters((prev) => ({
            ...prev,
            filter: {
              nonZeroUint8Signal: [
                ...(prev.filter?.nonZeroUint8Signal ?? []),
                'PRTs with signal',
              ],
            },
          })),
      },
    ],
    [perTokenMetadata, scriptBlockingData, statistics]
  );

  const formedJson = useMemo(() => {
    if (!selectedJSON) {
      return null;
    }

    const prtHeader = perTokenMetadata.find(
      (token) => token.prtHeader === selectedJSON?.prtHeader
    );

    const _decryptedToken = structuredClone(
      decryptedTokensData.find(
        (token) => token.prtHeader === selectedJSON?.prtHeader
      )
    );

    const _prtToken = prtTokensData.find((token) => {
      let modifiedPRTHeader = selectedJSON?.prtHeader;

      if (modifiedPRTHeader.startsWith(':')) {
        modifiedPRTHeader = modifiedPRTHeader.substring(1);
      }

      if (modifiedPRTHeader.endsWith(':')) {
        modifiedPRTHeader = modifiedPRTHeader.slice(0, -1);
      }

      return token.prtHeader === modifiedPRTHeader;
    });

    const _plainTextToken = structuredClone(
      plainTextTokensData.find(
        (token) => token.prtHeader === selectedJSON?.prtHeader
      )
    );

    if (!prtHeader || !_prtToken || !_plainTextToken) {
      return null;
    }

    if (!_decryptedToken || !_plainTextToken) {
      return {
        ...prtHeader,
        ..._prtToken,
      };
    }

    delete _decryptedToken.prtHeader;
    delete _plainTextToken.prtHeader;

    const { uint8Signal, ...rest } = _plainTextToken;

    return {
      ...rest,
      ip: getSignal((Object.values(uint8Signal) as unknown as number[]) ?? []),
    };
  }, [
    decryptedTokensData,
    perTokenMetadata,
    plainTextTokensData,
    prtTokensData,
    selectedJSON,
  ]);

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        title: 'JSON View',
        content: {
          Element: BottomTray,
          className: 'p-4',
          props: {
            src: formedJson ?? {},
          },
        },
      },
      {
        title: 'Glossary',
        content: {
          Element: Glossary,
          className: 'p-4',
          props: {
            statItems: stats,
          },
        },
      },
    ],
    [formedJson, stats]
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Domain',
        accessorKey: 'origin',
        cell: (info) => info,
        initialWidth: 120,
      },
      {
        header: 'Owner',
        accessorKey: 'owner',
        cell: (info) => info,
        initialWidth: 100,
      },
      {
        header: 'Decrypted',
        accessorKey: 'decryptionKeyAvailable',
        cell: (info) => {
          return info ? <span className="font-serif">✓</span> : '';
        },
        initialWidth: 60,
      },
      {
        header: 'Signal',
        accessorKey: 'nonZeroUint8Signal',
        cell: (_, details) => {
          const _plainTextToken = structuredClone(
            plainTextTokensData.find(
              (token) => token.prtHeader === (details as PRTMetadata)?.prtHeader
            )
          );

          if (!_plainTextToken?.uint8Signal) {
            return '';
          }

          const ipAddress = getSignal(
            Object.values(_plainTextToken?.uint8Signal as unknown as number[])
          );

          return ipAddress === 'No Signal' ? '' : ipAddress;
        },
        initialWidth: 60,
      },
      {
        header: 'PRT Prefix',
        accessorKey: 'prtHeader',
        cell: (info) => (info as string).slice(0, 10),
        isHiddenByDefault: true,
      },
    ],
    [plainTextTokensData]
  );

  const mdlComparator = useCallback(
    (value: InfoType, filterValue: string, data: typeof scriptBlockingData) => {
      let hostname = isValidURL(value as string)
        ? new URL(value as string).hostname
        : '';

      hostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

      if (!hostname || isLoading) {
        return false;
      }

      switch (filterValue) {
        case 'True':
          return (
            data.filter((_data) => value && hostname === _data.domain).length >
            0
          );
        case 'False':
          return (
            data.filter((_data) => value && hostname === _data.domain)
              .length === 0
          );
        default:
          return true;
      }
    },
    [isLoading]
  );

  const filters = useMemo<TableFilter>(
    () => ({
      nonZeroUint8Signal: {
        title: 'Signal',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues:
          perTokenMetadata.length === 0
            ? undefined
            : {
                'PRTs with signal': {
                  selected: (
                    preSetFilters?.filter?.nonZeroUint8Signal ?? []
                  ).includes('PRTs with signal'),
                  description: "PRT's that reveal IP address",
                },
                'PRTs without signal': {
                  selected: (
                    preSetFilters?.filter?.nonZeroUint8Signal ?? []
                  ).includes('PRTs without signal'),
                  description: "PRT's that do not reveal IP address",
                },
              },
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'PRTs without signal':
              return !value as boolean;
            case 'PRTs with signal':
              return value as boolean;
            default:
              return true;
          }
        },
      },
      decryptionKeyAvailable: {
        title: 'Decrypted',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues:
          perTokenMetadata.length === 0
            ? undefined
            : {
                True: {
                  selected: false,
                  description: "PRT's that have been decrypted",
                },
                False: {
                  selected: false,
                  description: "PRT's that have not been decrypted",
                },
              },
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'True':
              return value as boolean;
            case 'False':
              return !value as boolean;
            default:
              return true;
          }
        },
      },
      mdl: {
        title: 'MDL',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues:
          perTokenMetadata.length === 0
            ? undefined
            : {
                True: {
                  selected: (preSetFilters?.filter?.mdl ?? []).includes('True'),
                  description: 'Domains that are in MDL',
                },
                False: {
                  selected: (preSetFilters?.filter?.mdl ?? []).includes(
                    'False'
                  ),
                  description: 'Domains that are not in MDL',
                },
              },
        comparator: (value: InfoType, filterValue: string) =>
          mdlComparator(value, filterValue, scriptBlockingData),
      },
    }),
    [
      scriptBlockingData,
      preSetFilters?.filter?.mdl,
      preSetFilters?.filter?.nonZeroUint8Signal,
      mdlComparator,
      perTokenMetadata,
    ]
  );

  return (
    <MdlCommonPanel
      tabItems={tabItems}
      tableColumns={tableColumns}
      filters={filters}
      tableSearchKeys={['origin', 'owner']}
      tableData={perTokenMetadata}
      selectedKey={selectedJSON?.origin.toString()}
      onRowClick={(row) => setSelectedJSON(row as PRTMetadata)}
      stats={stats}
      tab="PRT"
      activeTabIndex={() => (formedJson?.version ? 0 : -1)}
      customClearAllFunction={() => setPresetFilters({ filter: {} })}
      customClearFunction={(key: string, value: string) =>
        setPresetFilters((prev) => {
          const updatedFilters = structuredClone(prev);
          updatedFilters.filter[key] = updatedFilters.filter[key]?.filter(
            (filterValue) => filterValue !== value
          );
          return updatedFilters;
        })
      }
    />
  );
};

export default ProbabilisticRevealTokens;
