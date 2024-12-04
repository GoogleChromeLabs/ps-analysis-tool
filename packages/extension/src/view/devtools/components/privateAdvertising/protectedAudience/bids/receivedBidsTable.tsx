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
  type singleAuctionEvent,
} from '@google-psat/common';
import {
  SIDEBAR_ITEMS_KEYS,
  Table,
  type TableFilter,
  TableProvider,
  useSidebar,
  type InfoType,
  type TableColumn,
  type TableRow,
  useTabs,
} from '@google-psat/design-system';
import React, { useCallback, useEffect, useMemo } from 'react';

/**
 * Internal dependencies.
 */
import { useProtectedAudience, useSettings } from '../../../../stateProviders';

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

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const auctionsTabData = JSON.parse(storage[4] || '{}');

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Bidder',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
        enableHiding: false,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Bid',
        accessorKey: 'bid',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Currency',
        accessorKey: 'bidCurrency',
        cell: (info) => info,
        widthWeightagePercentage: 16,
      },
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => info,
        widthWeightagePercentage: 16,
      },
      {
        header: 'Ad Container Size',
        accessorKey: 'adContainerSize',
        cell: (info) => info,
        widthWeightagePercentage: 16,
      },
      {
        header: 'Media Type',
        accessorKey: 'mediaType',
        cell: (info) => info,
        widthWeightagePercentage: 16,
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
      setStorage('', 4);
    };
  }, [setStorage]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view bids data, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={() => {
              document
                .getElementById('cookies-landing-scroll-container')
                ?.scrollTo(0, 0);
              updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
            }}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

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
      tableFilterData={tableFilters}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="bidsTable#received"
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
        selectedKey={
          selectedRow?.ownerOrigin +
          selectedRow?.uniqueAuctionId +
          selectedRow?.time
        }
        hideSearch={true}
        minWidth="50rem"
      />
    </TableProvider>
  );
};

export default ReceivedBidsTable;
