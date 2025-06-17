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
import { noop, type AdsAndBiddersType } from '@google-psat/common';
import {
  FrameIcon,
  Hammer,
  JsonView,
  ResizableTray,
  ScreenIcon,
  Table,
  TableProvider,
  type InfoType,
  type TableColumn,
  type TableData,
  type TableFilter,
  type TableRow,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import type { PrebidEvents } from '../../../../../../store';

interface AdTableProps {
  adsAndBidders: AdsAndBiddersType;
  setSelectedAdUnit?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedAdUnit?: string | null;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  isEE?: boolean;
  auctionEvents?: PrebidEvents['auctionEvents'];
}

const AdTable = ({
  adsAndBidders,
  setSelectedAdUnit,
  selectedAdUnit,
  setIsInspecting,
  isEE,
  auctionEvents,
}: AdTableProps) => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const adUnitsWithOrtb2Imp = useMemo(() => {
    const auctionEnd = Object.values(auctionEvents || {})[0].find(
      (event) => event.eventType === 'auctionEnd'
    );

    const adUnitCodes = auctionEnd?.adUnitCodes;

    return adUnitCodes?.reduce(
      (
        combinedData: Record<string, any>,
        adUnitCode: string,
        index: number
      ) => {
        const adUnits = auctionEnd?.adUnits || [];

        return {
          ...combinedData,
          [adUnitCode]: adUnits[index].ortb2Imp,
        };
      },
      {} as Record<string, any>
    );
  }, [auctionEvents]);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <button
              className={classNames(
                'w-fit flex gap-2 hover:opacity-70 active:opacity-50',
                {
                  'cursor-default': Boolean(isEE),
                }
              )}
              onClick={() => {
                if (selectedAdUnit === info) {
                  setSelectedAdUnit?.(null);
                  setIsInspecting?.(false);
                } else {
                  setIsInspecting?.(true);
                  setSelectedAdUnit?.(info as string);
                }
              }}
            >
              <FrameIcon className="fill-[#1A73E8] min-w-5 min-h-5" />
              <p className="truncate">{info}</p>
            </button>
            <div className="flex gap-2 items-center">
              Ortb2Imp:{' '}
              <button
                className="border border-gray-400 dark:border-dark-gray-x11 rounded-xl px-2 py-0.5 text-xs hover:opacity-70 active:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRow?.(
                    Object.values(adUnitsWithOrtb2Imp[info as string])[0] as any
                  );
                }}
              >
                {Object.keys(adUnitsWithOrtb2Imp[info as string])[0]}
              </button>
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        header: 'Ad Container Sizes',
        accessorKey: 'mediaContainerSize',
        cell: (info, details) => {
          const winningMediaContainerSize =
            details?.winningMediaContainerSize?.[0];

          return (
            <div className="flex gap-4 items-center">
              <ScreenIcon className="fill-[#323232] min-w-5 min-h-5" />
              <p className="truncate flex flex-wrap gap-2">
                {(info as number[][])?.map((size: number[], index: number) => {
                  if (!size?.[0]) {
                    return null;
                  }

                  return (
                    <span
                      key={index}
                      className={classNames(
                        'rounded-xl px-2 py-0.5 border text-xs',
                        winningMediaContainerSize &&
                          winningMediaContainerSize[0] === size[0] &&
                          winningMediaContainerSize[1] === size[1]
                          ? 'border-[#5AAD6A] text-[#5AAD6A] bg-[#F5F5F5]'
                          : 'border-gray-400 dark:border-dark-gray-x11'
                      )}
                    >
                      {size[0]}x{size[1]}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        },
        sortingComparator: (a, b) => {
          const aSizes = (a as number[][])
            .map((size: number[]) => `${size[0]}x${size[1]}`)
            .join('');
          const bSizes = (b as number[][])
            .map((size: number[]) => `${size[0]}x${size[1]}`)
            .join('');

          return aSizes > bSizes ? 1 : -1;
        },
      },
      {
        header: 'Bidders',
        accessorKey: 'bidders',
        cell: (info, details) => {
          const winningBid = details?.winningBid;
          const winningBidder = details?.winningBidder;
          const bidCurrency = details?.bidCurrency;

          return (
            <div className="flex flex-wrap gap-2 p-1 overflow-auto h-full w-full">
              {(info as string[])?.map((bidder: string, idx: number) => {
                const selectedBidder = Object.values(
                  auctionEvents || {}
                )[0].filter((event) => {
                  return (
                    event.eventType === 'bidRequested' &&
                    event.bidderCode === bidder
                  );
                });

                return (
                  <div
                    key={idx}
                    className={classNames(
                      'h-fit px-2 py-0.5 border rounded-full flex justify-center items-center gap-1',
                      {
                        'border-gray-400 dark:border-dark-gray-x11':
                          bidder !== winningBidder,
                        'border-[#5AAD6A] text-[#5AAD6A] bg-[#F5F5F5]':
                          bidder === winningBidder,
                        'cursor-pointer hover:opacity-70 active:opacity-50':
                          selectedBidder[0],
                      }
                    )}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (selectedBidder.length) {
                        setSelectedRow?.(selectedBidder[0]);
                      }
                    }}
                  >
                    {bidder === winningBidder && <Hammer className="h-4 w-4" />}
                    {bidder}
                    {bidder === winningBidder && (
                      <span className="text-xxxhs text-[#5AAD6A] font-bold">
                        {' '}
                        ({Number(winningBid).toFixed(2)} {bidCurrency})
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        },
        sortingComparator: (a, b) => {
          const aBidders = (a as string[]).join('').toLowerCase();
          const bBidders = (b as string[]).join('').toLowerCase();

          return aBidders > bBidders ? 1 : -1;
        },
      },
    ],
    [
      isEE,
      adUnitsWithOrtb2Imp,
      selectedAdUnit,
      setSelectedAdUnit,
      setIsInspecting,
      auctionEvents,
    ]
  );

  const tableFilters = useMemo<TableFilter>(
    () => ({
      bidders: {
        title: 'Bidders',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: Object.values(adsAndBidders).reduce((acc, bidder) => {
          const bidders = bidder.bidders;

          if (!acc) {
            acc = {};
          }

          if (!bidders) {
            return acc;
          }

          bidders.forEach((_bidder) => {
            acc[_bidder] = {
              selected: false,
            };
          });

          return acc;
        }, {} as TableFilter['bidders']['filterValues']),
        sortValues: true,
        comparator: (value: InfoType, filterValue: string) => {
          return (value as string[]).includes(filterValue);
        },
      },
    }),
    [adsAndBidders]
  );

  return (
    <div
      className="w-full text-outer-space-crayola border-x border-t border-american-silver dark:border-quartz flex flex-col"
      style={{
        height: 'calc(100% - 77px)',
      }}
    >
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: selectedRow ? '50%' : '90%',
        }}
        minHeight="20%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
        trayId="ad-table-bottom-tray"
      >
        <TableProvider
          data={Object.values(adsAndBidders)}
          tableColumns={tableColumns}
          tableFilterData={tableFilters}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="adtable"
          onRowClick={(row) => {
            setSelectedRow(row);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return row.originalData.adUnitCode;
          }}
        >
          <Table
            selectedKey={selectedRow?.adUnitCode}
            hideSearch={true}
            rowHeightClass="h-20"
            minWidth="50rem"
          />
        </TableProvider>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5 h-full">
            <JsonView src={selectedRow} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full h-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdTable;
