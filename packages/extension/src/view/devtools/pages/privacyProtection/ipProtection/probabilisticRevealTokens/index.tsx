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
  noop,
  Table,
  TableProvider,
  type TableColumn,
  type TableRow,
  ResizableTray,
} from '@google-psat/design-system';
import React, { useMemo, useState } from 'react';
/**
 * Internal dependencies
 */
import { useProbabilisticRevealTokens } from '../../../../stateProviders';
import type { PRTMetadata } from '@google-psat/common';

const ProbabilisticRevealTokens = () => {
  const [selectedJSON, setSelectedJSON] = useState<PRTMetadata | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'PRT',
        accessorKey: 'prtHeader',
        cell: (info) => info,
        initialWidth: 100,
      },
      {
        header: 'Origin',
        accessorKey: 'origin',
        cell: (info) => info,
        initialWidth: 100,
      },
      {
        header: 'Decryption key available',
        accessorKey: 'decryptionKeyAvailable',
        cell: (info) => info.toString(),
      },
      // {
      //   header: 'actions',
      //   accessorKey: 'actions',
      //   cell: (_,) => {
      //     return <button onClick={() => null}>Decrypt</button>;
      //   },
      // },
    ],
    []
  );

  const { perTokenMetadata } = useProbabilisticRevealTokens(({ state }) => ({
    perTokenMetadata: state.perTokenMetadata,
  }));

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
            onRowContextMenu={noop}
            data={perTokenMetadata}
            tableColumns={tableColumns}
            onRowClick={(row) => setSelectedJSON(row as PRTMetadata)}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as PRTMetadata).prtHeader.toString()
            }
          >
            <Table
              selectedKey={selectedJSON?.prtHeader.toString()}
              hideSearch={true}
              minWidth="50rem"
            />
          </TableProvider>
        </div>
      </ResizableTray>
    </div>
  );
};

export default ProbabilisticRevealTokens;
