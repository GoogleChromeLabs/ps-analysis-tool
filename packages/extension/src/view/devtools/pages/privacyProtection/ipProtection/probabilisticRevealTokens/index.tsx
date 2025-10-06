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
import React, { useMemo, useRef, useState } from 'react';
import { noop, type PRTMetadata } from '@google-psat/common';

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
    ['filter']: string[];
  }>({
    filter: [],
  });

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

  const filterClearFunction = useRef<{
    resetFilters: () => void;
    toggleFilterSelection: (
      filterKey: string,
      filterValue: string,
      isRemovalAction?: boolean
    ) => void;
  }>({
    resetFilters: noop,
    toggleFilterSelection: noop,
  });

  const { scriptBlockingData } = useScriptBlocking(({ state }) => ({
    scriptBlockingData: state.scriptBlockingData,
  }));

  const stats = useMemo(
    () => [
      {
        title: 'Domains',
        centerCount: perTokenMetadata.length,
        color: '#F3AE4E',
        onClick: () => filterClearFunction.current.resetFilters(),
        glossaryText: 'Top-level domains on page',
      },
      {
        title: 'MDL',
        centerCount: perTokenMetadata.filter(({ origin }) => {
          if (!origin) {
            return false;
          }

          return (
            scriptBlockingData.filter((_data) => _data.domain === origin)
              .length > 0
          );
        }).length,
        onClick: () => {
          filterClearFunction.current.resetFilters();
          setPresetFilters((prev) => ({
            ...prev,
            filter: ['mdl:True'],
          }));
        },
        color: '#4C79F4',
        glossaryText: 'Domains in MDL',
      },
      {
        title: 'PRT',
        centerCount: statistics.localView.totalTokens,
        color: '#EC7159',
        onClick: () => filterClearFunction.current.resetFilters(),
        glossaryText: 'PRT tokens sent in requests',
      },
      {
        title: 'Signals',
        centerCount: statistics.localView.nonZeroSignal,
        color: '#5CC971',
        glossaryText: 'PRTs with IP Address',
        onClick: () => {
          filterClearFunction.current.resetFilters();
          setPresetFilters((prev) => ({
            ...prev,
            filter: ['nonZeroUint8Signal:PRTs with signal'],
          }));
        },
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
      prtHeader: prtHeader,
      epochIdBase64: _prtToken.epochIdBase64,
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
            selectedJSON: formedJson,
            containerClassname: 'h-full',
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
        cell: (info) => String(info).split('https://')?.[1] || String(info),
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
        cell: (info) => {
          return info ? <span className="font-serif">✓</span> : '';
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
    []
  );

  const filters = {
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
                  preSetFilters?.filter
                    .find((filter) => filter.startsWith('nonZeroUint8Signal'))
                    ?.split(':')[1] ?? ''
                ).includes('PRTs with signal'),
                description: "PRT's that reveal IP address",
              },
              'PRTs without signal': {
                selected: (
                  preSetFilters?.filter
                    .find((filter) => filter.startsWith('nonZeroUint8Signal'))
                    ?.split(':')[1] ?? ''
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
    owner: {
      title: 'MDL',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      filterValues:
        perTokenMetadata.length === 0
          ? undefined
          : {
              True: {
                selected: (
                  preSetFilters?.filter
                    .find((filter) => filter.startsWith('mdl'))
                    ?.split(':')[1] ?? ''
                ).includes('True'),
                description: 'Domains that are in MDL',
              },
              False: {
                selected: (
                  preSetFilters?.filter
                    .find((filter) => filter.startsWith('mdl'))
                    ?.split(':')[1] ?? ''
                ).includes('False'),
                description: 'Domains that are not in MDL',
              },
            },
      comparator: (value: InfoType, filterValue: string) => {
        switch (filterValue) {
          case 'True':
            return Boolean(value);
          case 'False':
            return !value;
          default:
            return true;
        }
      },
    },
  } as TableFilter;

  return (
    <MdlCommonPanel
      filterRef={filterClearFunction}
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
      customClearAllFunction={() => setPresetFilters({ filter: [] })}
      customClearFunction={(key: string, value: string) =>
        setPresetFilters((prev) => {
          const updatedFilters = structuredClone(prev);
          updatedFilters.filter = updatedFilters.filter?.filter(
            (filterValue) => {
              const filter = filterValue.split(':')[1];
              return filter !== value;
            }
          );
          return updatedFilters;
        })
      }
    />
  );
};

export default ProbabilisticRevealTokens;
