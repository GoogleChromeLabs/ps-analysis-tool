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
  getValueByKey,
  noop,
  type NoBidsType,
  type ReceivedBids,
  type singleAuctionEvent,
} from '@google-psat/common';
import {
  Table,
  type TableFilter,
  TableProvider,
  type InfoType,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';
import React, { useCallback, useEffect, useMemo } from 'react';
/**
 * Internal dependencies.
 */
import Placeholder from './placeholder';

interface ReceivedBidsTableProps {
  setSelectedRow: React.Dispatch<
    React.SetStateAction<
      singleAuctionEvent | NoBidsType[keyof NoBidsType] | null
    >
  >;
  selectedRow: singleAuctionEvent | NoBidsType[keyof NoBidsType] | null;
  receivedBids: ReceivedBids[];
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  showEvaluationPlaceholder?: boolean;
}

const ReceivedBidsTable = ({
  setSelectedRow,
  selectedRow,
  receivedBids,
  storage,
  setStorage,
  showEvaluationPlaceholder = true,
}: ReceivedBidsTableProps) => {
  const auctionsTabData = JSON.parse(storage?.[4] || '{}');

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'time',
        cell: (_, details) =>
          (details as singleAuctionEvent).formattedTime.toString(),
        enableHiding: false,
        widthWeightagePercentage: 10,
      },
      {
        header: 'Bidder',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Bid Value',
        accessorKey: 'bid',
        cell: (info) => info,
      },
      {
        header: 'Currency',
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
        accessorKey: 'mediaContainerSize',
        cell: (info) => {
          return (
            <div className="flex gap-2 items-center">
              <p className="truncate">
                {(info as number[][])
                  ?.map((size: number[]) => {
                    if (!size?.[0]) {
                      return null;
                    }
                    return `${size?.[0]}x${size?.[1]}`;
                  })
                  ?.filter((size) => Boolean(size))
                  ?.join(' | ')}
              </p>
            </div>
          );
        },
      },
      {
        header: 'Ad Type',
        accessorKey: 'adType',
        cell: (info) => info,
      },
    ],
    []
  );

  const calculateFilters = useCallback(
    (key: string, comparisonValue: string) => {
      return receivedBids.reduce<
        TableFilter[keyof TableFilter]['filterValues']
      >((acc, bid) => {
        const value = getValueByKey(key, bid);

        if (!acc) {
          acc = {};
        }

        if (value && !acc[value]) {
          acc[value] = {
            selected: false,
          };
        }

        if (value && value === comparisonValue) {
          acc[value].selected = true;
        }

        return acc;
      }, {});
    },
    [receivedBids]
  );

  const tableFilters = useMemo<TableFilter>(
    () => ({
      ownerOrigin: {
        title: 'Bidder',
        sortValues: true,
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters('ownerOrigin', auctionsTabData.bidder),
        useGenericPersistenceKey: true,
      },
      bid: {
        title: 'Bid',
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
          const bid = value as number;

          if (filterValue === '100+') {
            return bid > 100;
          }

          const [min, max] = filterValue.split(' - ').map(Number);

          return bid >= min && bid <= max;
        },
      },
      bidCurrency: {
        title: 'Bid Currency',
        sortValues: true,
      },
      adUnitCode: {
        title: 'Ad Unit Code',
        sortValues: true,
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters(
          'adUnitCode',
          auctionsTabData.adUnitCode
        ),
        useGenericPersistenceKey: true,
      },
    }),
    [auctionsTabData.adUnitCode, auctionsTabData.bidder, calculateFilters]
  );

  useEffect(() => {
    return () => {
      setStorage?.('', 4);
    };
  }, [setStorage]);

  if (!receivedBids || receivedBids.length === 0) {
    return (
      <Placeholder showEvaluationPlaceholder={showEvaluationPlaceholder} />
    );
  }

  return (
    <TableProvider
      data={receivedBids}
      tableColumns={tableColumns}
      tableFilterData={tableFilters}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="bidsTable#received"
      onRowClick={(row) => {
        setSelectedRow(row as singleAuctionEvent);
      }}
      onRowContextMenu={noop}
      getRowObjectKey={(row: TableRow) => {
        console;
        const data = row.originalData as singleAuctionEvent;
        return (
          data?.ownerOrigin +
          data?.uniqueAuctionId +
          data?.time +
          data?.adUnitCode
        );
      }}
    >
      <Table
        selectedKey={
          selectedRow?.ownerOrigin +
          selectedRow?.uniqueAuctionId +
          selectedRow?.time +
          selectedRow?.adUnitCode
        }
        hideSearch={true}
        minWidth="50rem"
      />
    </TableProvider>
  );
};

export default ReceivedBidsTable;
