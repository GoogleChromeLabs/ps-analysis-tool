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
import {
  noop,
  type NoBidsType,
  type singleAuctionEvent,
} from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';
import React, { useMemo } from 'react';
import { useProtectedAudience } from '../../../../stateProviders';

interface ReceivedBidsTableProps {
  setSelectedRow: React.Dispatch<
    React.SetStateAction<
      singleAuctionEvent | NoBidsType[keyof NoBidsType] | null
    >
  >;
  selectedRow: singleAuctionEvent | NoBidsType[keyof NoBidsType] | null;
}

const ReceivedBidsTable = ({
  setSelectedRow,
  selectedRow,
}: ReceivedBidsTableProps) => {
  const receivedBids = useProtectedAudience(({ state }) => state.receivedBids);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Bidder',
        accessorKey: 'ownerOrigin',
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
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => info,
      },
      {
        header: 'Ad Container Size',
        accessorKey: 'adContainerSize',
        cell: (info) => info,
      },
      {
        header: 'Media Type',
        accessorKey: 'mediaType',
        cell: (info) => info,
      },
    ],
    []
  );

  if (!receivedBids || receivedBids.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          No bids data was recorded.
        </p>
      </div>
    );
  }

  return (
    <TableProvider
      data={receivedBids}
      tableColumns={tableColumns}
      tableFilterData={undefined}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="receivedBidsTable"
      onRowClick={(row) => {
        setSelectedRow(row as singleAuctionEvent);
      }}
      onRowContextMenu={noop}
      getRowObjectKey={(row: TableRow) => {
        const data = row.originalData as singleAuctionEvent;
        return data?.ownerOrigin + data?.uniqueAuctionId + data?.time;
      }}
    >
      <Table
        hideFiltering={true}
        selectedKey={
          selectedRow?.ownerOrigin +
          selectedRow?.uniqueAuctionId +
          selectedRow?.time
        }
        hideSearch={true}
      />
    </TableProvider>
  );
};

export default ReceivedBidsTable;
