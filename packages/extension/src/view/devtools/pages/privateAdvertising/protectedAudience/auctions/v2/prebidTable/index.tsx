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
  type InfoType,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import classNames from 'classnames';

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
  adUnit: string;
}

const PrebidTable = ({ auctionEvents, adUnit }: PrebidTableProps) => {
  const [selectedJSON, setSelectedJSON] = useState<singleAuctionEvent | null>(
    null
  );
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Elapsed Time',
        accessorKey: 'elapsedTime',
        cell: (info) => info + 'ms',
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
              <span
                className={classNames({
                  'text-[#5AAD6A] font-semibold': eventType === 'bidWon',
                })}
              >
                {info}
              </span>
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

  const tableFilters = useMemo<TableFilter>(
    () => ({
      eventType: {
        title: 'Event Type',
        sortValues: true,
      },
      bidderCode: {
        title: 'Bidder Code',
        sortValues: true,
      },
      cpm: {
        title: 'Bid CPM',
        hasStaticFilterValues: true,
        filterValues: {
          ['0 - 20']: {
            selected: false,
          },
          ['20 - 40']: {
            selected: false,
          },
          ['40 - 60']: {
            selected: false,
          },
          ['60 - 80']: {
            selected: false,
          },
          ['80 - 100']: {
            selected: false,
          },
          ['100+']: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          if (value === undefined || value === null) {
            return false;
          }

          const bid = value as number;

          if (filterValue === '100+') {
            return bid > 100;
          }

          const [min, max] = filterValue.split(' - ').map(Number);

          return bid >= min && bid <= max;
        },
      },
      currency: {
        title: 'Currency',
      },
    }),
    []
  );

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
                <p>
                  Start Time:{' '}
                  {new Date(auctionEvents[1][0].timestamp).toISOString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p>Timeout: {auctionEvents[1][0].timeout}</p>
                {/* <p>Auction Time: {auctionEnd}ms</p> */}
              </div>
            </div>
            <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
              <TableProvider
                data={auctionEvents[1]
                  .filter((event) => {
                    return (
                      event.adUnitCode === adUnit ||
                      event.adUnitCodes?.includes(adUnit) ||
                      event.bids?.some((bid) => bid.adUnitCode === adUnit) ||
                      event.bidderRequests?.some((request) =>
                        request.bids.some((bid) => bid.adUnitCode === adUnit)
                      ) ||
                      (Array.isArray(event) &&
                        event.some((_event) => _event.adUnitCode === adUnit))
                    );
                  })
                  .map((event, index) => ({
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
