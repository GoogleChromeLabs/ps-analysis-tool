/*
 * Copyright 2024 Google LLC
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
 * External dependencies.
 */
import React, { useMemo, useState } from 'react';
import { noop } from '@google-psat/common';
import {
  BottomTrayIcon,
  Table,
  TableProvider,
  type TableColumn,
  type TableData,
  type TableRow,
} from '@google-psat/design-system';

const AuctionTable = () => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'eventTime',
        cell: (info) => info,
      },
      {
        header: 'Event',
        accessorKey: 'event',
        cell: (info) => info,
      },
      {
        header: 'Interest Group Origin',
        accessorKey: 'interestGroupOrigin',
        cell: (info) => info,
      },
      {
        header: 'Interest Group Name',
        accessorKey: 'interestGroupName',
        cell: (info) => info,
      },
      {
        header: 'Bid',
        accessorKey: 'bid',
        cell: (info) => info,
      },
      {
        header: 'Bid Currency',
        accessorKey: 'bidCurrency',
        cell: (info) => info,
      },
      {
        header: 'Component Seller',
        accessorKey: 'componentSeller',
        cell: (info) => info,
      },
    ],
    []
  );

  return (
    <div className="w-full h-full text-outer-space-crayola dark:text-bright-gray flex flex-col">
      <div className="flex justify-between items-center px-1">
        <p>Started by: https://example.com</p>
        <p>Date</p>
      </div>
      <div className="border border-american-silver dark:border-quartz">
        <TableProvider
          data={[]}
          tableColumns={tableColumns}
          tableFilterData={undefined}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="adtable"
          onRowClick={(row) => {
            setSelectedRow(row);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return row.originalData.name;
          }}
        >
          <Table hideFiltering={true} selectedKey={selectedRow?.name} />
        </TableProvider>
      </div>
      <button className="flex gap-1 items-center hover:opacity-70 px-1">
        <BottomTrayIcon />
        Show Config
      </button>
    </div>
  );
};

export default AuctionTable;
