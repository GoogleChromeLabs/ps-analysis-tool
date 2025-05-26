/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import { noop } from '@google-psat/common';
import {
  type TableColumn,
  TableProvider,
  Table,
  type TableData,
  type PrebidPriceGranularityTableData,
  JsonView,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';
import { useState, useMemo, useCallback } from 'react';

type defaultPriceGranularityKeys = 'low' | 'medium' | 'high' | 'auto' | 'dense';
type PriceGranularityPanelProps = {
  priceGranularity: PrebidConfig['priceGranularity'];
  customBucket: CustomPriceGranularity;
};

const DEFAULT_PRICE_GRANULARITY: Record<
  defaultPriceGranularityKeys,
  PriceGranularityValue
> = {
  low: [{ precision: 2, min: 0, max: 5, increment: 0.5 }],
  medium: [{ precision: 2, min: 0, max: 20, increment: 0.1 }],
  high: [{ precision: 2, min: 0, max: 20, increment: 0.01 }],
  auto: [
    { precision: 2, min: 0, max: 5, increment: 0.05 },
    { precision: 2, min: 5, max: 10, increment: 0.1 },
    { precision: 2, min: 10, max: 20, increment: 0.5 },
  ],
  dense: [
    { precision: 2, min: 0, max: 3, increment: 0.01 },
    { precision: 2, min: 3, max: 8, increment: 0.05 },
    { precision: 2, min: 8, max: 20, increment: 0.5 },
  ],
};

const PriceGranularity = ({
  priceGranularity,
  customBucket,
}: PriceGranularityPanelProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedRow, setSelectedRow] =
    useState<Partial<PrebidPriceGranularityTableData> | null>(null);
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Bucket',
        accessorKey: 'bucket',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Precision',
        accessorKey: 'precision',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Minimum',
        accessorKey: 'minimum',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Maximum',
        accessorKey: 'maximum',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Increment',
        accessorKey: 'increment',
        cell: (info) => info?.toString(),
      },
    ],
    []
  );

  const rows = useMemo(() => {
    if (!priceGranularity) {
      return [];
    }

    if (priceGranularity === 'custom') {
      return customBucket.buckets.map((granularity, index) => {
        return {
          index,
          bucket: `custom #${index + 1}`,
          minimum: granularity.min,
          maximum: granularity.max,
          precision: granularity.precision,
          increment: granularity.increment,
        };
      });
    }

    if (Object.keys(DEFAULT_PRICE_GRANULARITY).includes(priceGranularity)) {
      return DEFAULT_PRICE_GRANULARITY[
        priceGranularity as defaultPriceGranularityKeys
      ].map((granularity, index) => {
        return {
          index,
          bucket: `${priceGranularity} #${index + 1}`,
          minimum: granularity.min,
          maximum: granularity.max,
          precision: granularity.precision,
          increment: granularity.increment,
        };
      });
    }

    return [];
  }, [customBucket.buckets, priceGranularity]);

  const isRowSelected = useCallback(
    (data: TableData | null) => {
      const _data = data as {
        name: string;
        value: string | number | boolean;
        index: number;
      };

      if (!_data) {
        return true;
      }

      return _data.index.toString() === selectedKey;
    },
    [selectedKey]
  );

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
      >
        <TableProvider
          data={rows}
          tableColumns={tableColumns}
          isRowSelected={isRowSelected}
          onRowClick={(row) => {
            setSelectedKey(
              (row as PrebidPriceGranularityTableData)?.index.toString() ?? ''
            );
            if (row) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { index, ...rest } = row as PrebidPriceGranularityTableData;
              setSelectedRow(rest);
            }
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row) =>
            (
              row?.originalData as PrebidPriceGranularityTableData
            ).index.toString()
          }
        >
          <Table
            hideTableTopBar={true}
            selectedKey={selectedKey}
            minWidth="70%"
          />
        </TableProvider>
      </Resizable>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full minimum-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            <JsonView src={selectedRow} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceGranularity;
