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
import {
  Table,
  TableProvider,
  type TableRow,
  type TableFilter,
  ResizableTray,
  JsonView,
  noop,
} from '@google-psat/design-system';
import React, { useRef } from 'react';
import { type PRTMetadata } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import RowContextMenuForPRT from './rowContextMenu';
import StatsHeader, { type Stats } from './stasHeader';

interface MdlCommonPanelProps {
  formedJson: PRTMetadata | null;
  tableColumns: Array<{
    header: string;
    accessorKey: keyof PRTMetadata;
    cell: (info: any) => any;
  }>;
  tableData: PRTMetadata[];
  selectedKey: string | null;
  onRowClick: (row: PRTMetadata) => void;
  extraInterfaceToTopBar?: React.ReactNode;
  filters: TableFilter[];
  stats: Stats;
}

const MdlCommonPanel = ({
  formedJson,
  tableColumns,
  tableData,
  selectedKey,
  onRowClick,
  extraInterfaceToTopBar = undefined,
  filters,
  stats,
}: MdlCommonPanelProps) => {
  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForPRT
  > | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <StatsHeader stats={stats} />
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: selectedKey ? '50%' : '90%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="20%"
        maxHeight="90%"
        className="w-full flex flex-col"
        trayId="active-sources-table-bottom-tray"
      >
        <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
          <TableProvider
            data={tableData}
            tableFilterData={filters}
            tableColumns={tableColumns}
            tableSearchKeys={['origin', 'owner']}
            onRowClick={onRowClick}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as PRTMetadata).origin.toString()
            }
            onRowContextMenu={
              rowContextMenuRef.current?.onRowContextMenu ?? noop
            }
          >
            <Table
              selectedKey={selectedKey}
              minWidth="50rem"
              extraInterfaceToTopBar={extraInterfaceToTopBar}
            />
            <RowContextMenuForPRT ref={rowContextMenuRef} />
          </TableProvider>
        </div>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {formedJson ? (
          <div className="text-xs py-1 px-1.5 h-full">
            <JsonView src={formedJson} />
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

export default MdlCommonPanel;
