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
  Table,
  TableProvider,
  type TableColumn,
  type TableRow,
  ResizableTray,
  JsonView,
  noop,
} from '@google-psat/design-system';
import React, { useMemo, useRef, useState } from 'react';
import type { PRTMetadata } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';
/**
 * Internal dependencies
 */
import { useProbabilisticRevealTokens } from '../../../../stateProviders';
import RowContextMenuForPRT from './rowContextMenu';

const ProbabilisticRevealTokens = () => {
  const [selectedJSON, setSelectedJSON] = useState<PRTMetadata | null>(null);

  const {
    perTokenMetadata,
    decryptedTokensData,
    prtTokensData,
    plainTextTokensData,
    decryptToken,
  } = useProbabilisticRevealTokens(({ state, actions }) => ({
    perTokenMetadata: state.perTokenMetadata,
    decryptedTokensData: state.decryptedTokens,
    prtTokensData: state.prtTokens,
    plainTextTokensData: state.plainTextTokens,
    decryptToken: actions.decryptToken,
  }));

  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForPRT
  > | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'PRT',
        accessorKey: 'prtHeader',
        cell: (info) => info,
        minWidth: 500,
      },
      {
        header: 'Origin',
        accessorKey: 'origin',
        cell: (info) => info,
      },
      {
        header: 'Decryption key available',
        accessorKey: 'decryptionKeyAvailable',
        cell: (info) => info.toString(),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: (_, details) => {
          return (
            <button
              style={{
                cursor:
                  !(details as PRTMetadata)?.decryptionKeyAvailable ||
                  (details as PRTMetadata)?.decrypted
                    ? 'default'
                    : 'pointer',
              }}
              disabled={
                !(details as PRTMetadata)?.decryptionKeyAvailable ||
                (details as PRTMetadata)?.decrypted
              }
              className={classNames(
                'w-fit flex bg-cultured-grey text-raisin-black my-1 py-0.5 px-2 rounded border border-dark-grey hover:bg-light-gray hover:border-american-silver',
                {
                  'disabled opacity-50':
                    !(details as PRTMetadata)?.decryptionKeyAvailable ||
                    (details as PRTMetadata)?.decrypted,
                }
              )}
              onClick={() => decryptToken((details as PRTMetadata).prtHeader)}
            >
              Decrypt
            </button>
          );
        },
      },
    ],
    [decryptToken]
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

    if (!prtHeader || !_decryptedToken || !_prtToken || !_plainTextToken) {
      return null;
    }

    if (!prtHeader.decrypted) {
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

  return (
    <div className="w-full h-full flex flex-col">
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: selectedJSON ? '50%' : '90%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="20%"
        maxHeight="90%"
        className="w-full flex flex-col"
        trayId="active-sources-table-bottom-tray"
      >
        <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
          <TableProvider
            data={perTokenMetadata}
            tableColumns={tableColumns}
            onRowClick={(row) => setSelectedJSON(row as PRTMetadata)}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as PRTMetadata).prtHeader.toString()
            }
            onRowContextMenu={
              rowContextMenuRef.current?.onRowContextMenu ?? noop
            }
          >
            <Table
              hideTableTopBar
              selectedKey={selectedJSON?.prtHeader.toString()}
              hideSearch={true}
              minWidth="50rem"
            />
            <RowContextMenuForPRT ref={rowContextMenuRef} />
          </TableProvider>
        </div>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {formedJson ? (
          <div className="text-xs py-1 px-1.5 h-full">
            <JsonView src={formedJson} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProbabilisticRevealTokens;
