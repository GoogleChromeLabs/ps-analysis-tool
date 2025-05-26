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
import { noop, type singleAuctionEvent } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableFilter,
  type TableColumn,
  type TableRow,
  Hammer,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import BottomTray from '../../components/table/bottomTray';
import type { PrebidEvents } from '../../../../../../../../store';

interface PrebidTableProps {
  auctionEvents: [
    keyof PrebidEvents['auctionEvents'],
    PrebidEvents['auctionEvents'][keyof PrebidEvents['auctionEvents']]
  ];
}

const PrebidTable = ({ auctionEvents }: PrebidTableProps) => {
  const [selectedJSON, setSelectedJSON] = useState<singleAuctionEvent | null>(
    null
  );
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Elapsed Time',
        accessorKey: 'elapsedTime',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Event',
        accessorKey: 'eventType',
        cell: (info) => info,
        sortingComparator: (a, b) => {
          const aString = (a as string).toLowerCase().trim();
          const bString = (b as string).toLowerCase().trim();

          return aString > bString ? 1 : -1;
        },
      },
      {
        header: 'Bidder Name',
        accessorKey: 'bidderCode',
        cell: (info, details) => {
          const eventType = details?.eventType;

          return (
            <div className="flex items-center gap-2">
              {eventType === 'bidWon' && <Hammer className="h-4 w-4" />}
              {info}
            </div>
          );
        },
      },
      {
        header: 'Bid CPM',
        accessorKey: 'cpm',
        cell: (info) => info,
      },
      {
        header: 'Bid Currency',
        accessorKey: 'currency',
        cell: (info) => info,
      },
    ],
    []
  );

  const tableFilters = useMemo<TableFilter>(() => ({}), []);

  const startTime = new Date(auctionEvents[1][0].timestamp).toISOString();
  const timeout = auctionEvents[1][0].timeout;

  return (
    <div className="w-full h-full text-outer-space-crayola dark:text-bright-gray flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="20%"
        maxHeight="90%"
        className="w-full flex flex-col"
      >
        {auctionEvents?.length ? (
          <>
            <div className="flex flex-col gap-2 p-2">
              <div className="flex justify-between items-center">
                <p>Auction Id: {auctionEvents[0]}</p>
                <p>Start Time: {startTime}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Timeout: {timeout}</p>
                {/* <p>Auction Time: {auctionEnd}ms</p> */}
              </div>
            </div>
            <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
              <TableProvider
                data={auctionEvents[1].map((event, index) => ({
                  ...event,
                  index,
                }))}
                tableColumns={tableColumns}
                tableFilterData={tableFilters}
                tableSearchKeys={undefined}
                tablePersistentSettingsKey={'adtable' + auctionEvents[0]}
                onRowContextMenu={noop}
                onRowClick={(row) => setSelectedJSON(row as singleAuctionEvent)}
                getRowObjectKey={(row: TableRow) => {
                  return (
                    // @ts-ignore
                    row.originalData.index.toString()
                  );
                }}
              >
                <Table
                  selectedKey={
                    // @ts-ignore
                    selectedJSON?.index.toString() || ''
                  }
                  hideSearch={true}
                  minWidth="50rem"
                />
              </TableProvider>
            </div>
          </>
        ) : (
          <div className="h-full p-8 flex items-center justify-center">
            <p className="text-center text-lg">
              Auction events have yet to be recorded.
            </p>
          </div>
        )}
      </Resizable>
      <BottomTray selectedJSON={selectedJSON as object} />
    </div>
  );
};

export default PrebidTable;
