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
import React, { useMemo } from 'react';
import { noop, type singleAuctionEvent } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';

interface AuctionTableProps {
  selectedJSON: singleAuctionEvent | null;
  setSelectedJSON: React.Dispatch<
    React.SetStateAction<singleAuctionEvent | null>
  >;
  auctionEvents: singleAuctionEvent[];
}

const AuctionTable = ({
  selectedJSON,
  setSelectedJSON,
  auctionEvents,
}: AuctionTableProps) => {
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'formattedTime',
        cell: (info) => info,
      },
      {
        header: 'Event',
        accessorKey: 'type',
        cell: (info) => info,
      },
      {
        header: 'Interest Group Origin',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
      },
      {
        header: 'Interest Group Name',
        accessorKey: 'name',
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
        accessorKey: 'componentSellerOrigin',
        cell: (info) => info,
      },
    ],
    []
  );

  return (
    <div className="w-full h-fit text-outer-space-crayola dark:text-bright-gray flex flex-col pt-4">
      <div className="flex justify-between items-center px-1">
        <p>Started by: {auctionEvents?.[0]?.auctionConfig?.seller}</p>
        <p>
          Date {new Date(auctionEvents?.[0]?.time * 1000 || '').toUTCString()}
        </p>
      </div>
      <div className="border border-american-silver dark:border-quartz">
        <TableProvider
          data={auctionEvents}
          tableColumns={tableColumns}
          tableFilterData={undefined}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="adtable"
          onRowContextMenu={noop}
          onRowClick={(row) => setSelectedJSON(row as singleAuctionEvent)}
          getRowObjectKey={(row: TableRow) => {
            return (
              // @ts-ignore
              ((row.originalData as singleAuctionEvent).auctionConfig?.seller ||
                '') + (row.originalData as singleAuctionEvent).time
            );
          }}
        >
          <Table
            hideFiltering={true}
            selectedKey={
              // @ts-ignore
              (selectedJSON?.auctionConfig?.seller || '') +
                selectedJSON?.time || ''
            }
            hideSearch={true}
          />
        </TableProvider>
      </div>
    </div>
  );
};

export default AuctionTable;
