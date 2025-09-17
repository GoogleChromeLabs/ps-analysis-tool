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
  type TableColumn,
  type TableFilter,
} from '@google-psat/design-system';
import React, { useMemo, useState } from 'react';
import { type PRTMetadata } from '@google-psat/common';

/**
 * Internal dependencies
 */
import { useProbabilisticRevealTokens } from '../../../../stateProviders';
import MdlCommonPanel from '../../mdlCommonPanel';

const ProbabilisticRevealTokens = () => {
  const [selectedJSON, setSelectedJSON] = useState<PRTMetadata | null>(null);

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

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Domain',
        accessorKey: 'origin',
        cell: (info) => info,
      },
      {
        header: 'Owner',
        accessorKey: 'owner',
        cell: (info) => info,
      },
      {
        header: 'Decrypted',
        accessorKey: 'decryptionKeyAvailable',
        cell: (info) => {
          return info ? <span className="font-serif">✓</span> : '';
        },
      },
      {
        header: 'Signal',
        accessorKey: 'nonZeroUint8Signal',
        cell: (info) => {
          return info ? <span className="font-serif">✓</span> : '';
        },
      },
      {
        header: 'PRT Prefix',
        accessorKey: 'prtHeader',
        cell: (info) => (info as string).slice(0, 10),
      },
    ],
    []
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
        prtHeader,
        prtToken: _prtToken,
      };
    }

    delete _decryptedToken.prtHeader;
    delete _plainTextToken.prtHeader;

    return {
      prtHeader,
      decryptedTokens: _decryptedToken,
      prtToken: _prtToken,
      plainTextToken: _plainTextToken,
    };
  }, [
    decryptedTokensData,
    perTokenMetadata,
    plainTextTokensData,
    prtTokensData,
    selectedJSON,
  ]);

  const filters = useMemo<TableFilter>(
    () => ({
      owner: {
        title: 'Owner',
      },
      nonZeroUint8Signal: {
        title: 'Signal',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: {
          'PRTs with signal': {
            selected: false,
            description: "PRT's that do not reveal IP address",
          },
          'PRTs without signal': {
            selected: false,
            description: "PRT's that reveal IP address",
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'PRT with no Signal':
              return !value as boolean;
            case 'PRT with signal':
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
        filterValues: {
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
    }),
    []
  );

  const stats = {
    site: [
      {
        title: 'PRTs with Signal',
        centerCount: statistics.localView.nonZeroSignal,
        color: '#AF7AA3',
      },
      {
        title: 'PRTs without Signal',
        centerCount:
          statistics.localView.totalTokens - statistics.localView.nonZeroSignal,
        color: '#F54021',
      },
    ],
    global: [
      {
        title: 'PRTs with Signal',
        centerCount: statistics.globalView.nonZeroSignal,
        color: '#AF7AA3',
      },
      {
        title: 'PRTs without Signal',
        centerCount:
          statistics.globalView.totalTokens -
          statistics.globalView.nonZeroSignal,
        color: '#F54021',
      },
    ],
  };

  return (
    <MdlCommonPanel
      formedJson={formedJson}
      tableColumns={tableColumns}
      filters={filters}
      tableSearchKeys={['origin', 'owner']}
      tableData={perTokenMetadata}
      selectedKey={selectedJSON?.origin.toString()}
      onRowClick={(row) => setSelectedJSON(row as PRTMetadata)}
      stats={stats}
    />
  );
};

export default ProbabilisticRevealTokens;
