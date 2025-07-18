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
import React, { useCallback, useMemo, useState } from 'react';
import { noop, type singleAuctionEvent } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableFilter,
  type TableColumn,
  type TableRow,
  type InfoType,
  ResizableTray,
  SIDEBAR_ITEMS_KEYS,
  Hammer,
} from '@google-psat/design-system';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import BottomTray from './bottomTray';
import { useSettings } from '../../../../../../stateProviders';
import Placeholder from '../placeholder';

interface AuctionTableProps {
  auctionEvents: singleAuctionEvent[];
  parentOrigin?: string;
  startDate?: string;
  updateSelectedItemKey?: (key: string) => void;
  componentAuctionCount?: number;
}

const AuctionTable = ({
  auctionEvents,
  parentOrigin = '',
  startDate = '',
  componentAuctionCount = 0,
  updateSelectedItemKey = noop,
}: AuctionTableProps) => {
  const [selectedJSON, setSelectedJSON] = useState<singleAuctionEvent | null>(
    null
  );
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'time',
        cell: (_, details) =>
          (details as singleAuctionEvent).formattedTime.toString(),
        enableHiding: false,
      },
      {
        header: 'Event',
        accessorKey: 'type',
        cell: (info) => info,
        sortingComparator: (a, b) => {
          const aString = (a as string).toLowerCase().trim();
          const bString = (b as string).toLowerCase().trim();

          return aString > bString ? 1 : -1;
        },
      },
      {
        header: 'Interest Group Origin',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
      },
      {
        header: 'Interest Group Name',
        accessorKey: 'name',
        cell: (info, details) => {
          const eventType = details?.type;
          return (
            <div className="flex items-center gap-2">
              {eventType === 'win' && <Hammer className="h-4 w-4" />}
              <span
                className={classNames({
                  'text-[#5AAD6A] font-semibold': eventType === 'win',
                })}
              >
                {info}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Bid',
        accessorKey: 'bid',
        cell: (info) =>
          typeof info !== 'undefined' ? Number(info).toFixed(2) : '',
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

  const tableFilters = useMemo<TableFilter>(
    () => ({
      type: {
        title: 'Event',
        sortValues: true,
      },
      ownerOrigin: {
        title: 'Interest Group Origin',
        sortValues: true,
      },
      name: {
        title: 'Interest Group Name',
        sortValues: true,
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
      bidCurrency: {
        title: 'Bid Currency',
        sortValues: true,
      },
      componentSellerOrigin: {
        title: 'Component Seller',
        sortValues: true,
      },
    }),
    []
  );

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
  }, [updateSelectedItemKey]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view ad units, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={cdpNavigation}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full text-outer-space-crayola dark:text-bright-gray flex flex-col">
      {auctionEvents.length > 0 ? (
        <>
          <ResizableTray
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
            trayId="auctions-table-bottom-tray"
          >
            <>
              <div className="flex flex-col p-2">
                <div className="flex justify-between items-center gap-2">
                  <p>
                    <span className="font-semibold">Started by: </span>
                    {auctionEvents?.[0]?.auctionConfig?.seller}
                  </p>
                  <p>
                    {startDate
                      ? startDate
                      : new Date(
                          auctionEvents?.[0]?.time * 1000 || ''
                        ).toUTCString()}
                  </p>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p>
                    <span className="font-semibold">Component Auctions: </span>
                    {componentAuctionCount}
                  </p>
                </div>
              </div>
              <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
                <TableProvider
                  data={auctionEvents}
                  tableColumns={tableColumns}
                  tableFilterData={tableFilters}
                  tableSearchKeys={undefined}
                  tablePersistentSettingsKey={
                    'adtable' +
                    auctionEvents?.[0]?.auctionConfig?.seller +
                    parentOrigin
                  }
                  onRowContextMenu={noop}
                  onRowClick={(row) =>
                    setSelectedJSON(row as singleAuctionEvent)
                  }
                  getRowObjectKey={(row: TableRow) => {
                    return (
                      // @ts-ignore
                      (row.originalData as singleAuctionEvent).index.toString()
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
          </ResizableTray>
          <BottomTray selectedJSON={selectedJSON as object} />
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default AuctionTable;
