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
import { noop } from '@google-psat/common';
import {
  FrameIcon,
  Pill,
  ScreenIcon,
  Table,
  TableProvider,
  type TableColumn,
  type TableData,
  type TableRow,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import { useProtectedAudience } from '../../../../stateProviders';

const AdTable = () => {
  const { adsAndBidders } = useProtectedAudience(({ state }) => ({
    adsAndBidders: state.adsAndBidders,
  }));

  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => (
          <button className="flex gap-2 justify-center items-center">
            <FrameIcon className="fill-[#1A73E8]" />
            {info}
          </button>
        ),
      },
      {
        header: 'Ad Container Sizes',
        accessorKey: 'mediaContainerSize',
        cell: (info) => (
          <div className="flex gap-2 justify-center items-center">
            <ScreenIcon className="fill-[#323232]" />
            {(info as number[][])
              .map((size: number[], idx: number) => (
                <React.Fragment
                  key={idx}
                >{`${size[0]}x${size[1]}`}</React.Fragment>
              ))
              .join(' | ')}
          </div>
        ),
      },
      {
        header: 'Bidders',
        accessorKey: 'bidders',
        cell: (info) => (
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {(info as string[]).map((bidder: string, idx: number) => (
              <div key={idx}>{<Pill title={bidder} />}</div>
            ))}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex-1 w-full h-full text-outer-space-crayola border-x border-t border-american-silver dark:border-quartz flex flex-col">
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
          tableFilterData={undefined}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="adtable"
          onRowClick={(row) => {
            setSelectedRow(row);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return row.originalData.name;
          }}
        >
          <Table
            hideFiltering={true}
            selectedKey={selectedRow?.name}
            hideSearch={true}
          />
        </TableProvider>
      </Resizable>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
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

export default AdTable;
