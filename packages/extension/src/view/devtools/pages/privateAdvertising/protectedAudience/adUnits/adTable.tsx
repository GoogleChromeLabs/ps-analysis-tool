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
  JsonView,
  Pill,
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
import { Resizable } from 're-resizable';
import classNames from 'classnames';

interface AdTableProps {
  adsAndBidders: AdsAndBiddersType;
  setSelectedAdUnit?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedAdUnit?: string | null;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  isEE?: boolean;
}

const AdTable = ({
  adsAndBidders,
  setSelectedAdUnit,
  selectedAdUnit,
  setIsInspecting,
  isEE,
}: AdTableProps) => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => (
          <button
            className={classNames('w-full flex gap-2 items-center', {
              'cursor-default': Boolean(isEE),
            })}
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
        ),
        enableHiding: false,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Ad Container Sizes',
        accessorKey: 'mediaContainerSize',
        cell: (info) => (
          <div className="flex gap-2 items-center">
            <ScreenIcon className="fill-[#323232] min-w-5 min-h-5" />
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
        ),
        sortingComparator: (a, b) => {
          const aSizes = (a as number[][])
            .map((size: number[]) => `${size[0]}x${size[1]}`)
            .join('');
          const bSizes = (b as number[][])
            .map((size: number[]) => `${size[0]}x${size[1]}`)
            .join('');

          return aSizes > bSizes ? 1 : -1;
        },
        widthWeightagePercentage: 20,
      },
      {
        header: 'Bidders',
        accessorKey: 'bidders',
        cell: (info) => (
          <div className="flex flex-wrap gap-2 p-1 overflow-auto h-full w-full">
            {(info as string[])?.map((bidder: string, idx: number) => (
              <div key={idx}>{<Pill title={bidder} />}</div>
            ))}
          </div>
        ),
        sortingComparator: (a, b) => {
          const aBidders = (a as string[]).join('').toLowerCase();
          const bBidders = (b as string[]).join('').toLowerCase();

          return aBidders > bBidders ? 1 : -1;
        },
        widthWeightagePercentage: 60,
      },
    ],
    [selectedAdUnit, setIsInspecting, setSelectedAdUnit, isEE]
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
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="20%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
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
      </Resizable>
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
