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
import React, { useRef } from 'react';
import {
  Table,
  TableProvider,
  type TableRow,
  type TableFilter,
  ResizableTray,
  JsonView,
  noop,
  type TableData,
  type TableColumn,
} from '@google-psat/design-system';
import {
  type MDLTableData,
  type ProbablisticRevealToken,
  type PRTMetadata,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import RowContextMenuForMDLTable from './rowContextMenu';
import StatsHeader from './statsHeader';
import { type StatItem } from './types';

type NonDecryptedJson = PRTMetadata & ProbablisticRevealToken;
type DecryptedJson = {
  ordinal: Uint8Array<any>;
  version: number;
  hmacValid: boolean;
  ip: string;
};

type FormedJson = NonDecryptedJson | DecryptedJson;
interface MdlCommonPanelProps {
  formedJson: FormedJson | null;
  tableColumns: TableColumn[];
  tableData: PRTMetadata[] | MDLTableData[];
  selectedKey?: string;
  onRowClick: (row: TableData | null) => void;
  extraInterfaceToTopBar?: () => React.JSX.Element;
  filters?: TableFilter;
  stats: StatItem[] | null;
  tableSearchKeys: string[];
  bottomPanel?: React.JSX.Element;
  showJson?: boolean;
  tab: string;
}

const MdlCommonPanel = ({
  formedJson,
  tableColumns,
  tableData,
  selectedKey,
  onRowClick,
  tableSearchKeys = [],
  extraInterfaceToTopBar,
  filters,
  stats,
  bottomPanel,
  showJson = true,
  tab = '',
}: MdlCommonPanelProps) => {
  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForMDLTable
  > | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      {stats && <StatsHeader stats={stats} />}
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
            tableSearchKeys={tableSearchKeys}
            onRowClick={onRowClick}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as PRTMetadata).origin?.toString() ??
              (row.originalData as MDLTableData).domain?.toString()
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
            <RowContextMenuForMDLTable ref={rowContextMenuRef} tab={tab} />
          </TableProvider>
        </div>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {showJson ? (
          formedJson ? (
            <div className="text-xs py-1 px-1.5 h-full">
              <JsonView src={formedJson} />
            </div>
          ) : (
            <div className="h-full p-8 flex items-center">
              <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
                {I18n.getMessage('selectRowToPreview')}
              </p>
            </div>
          )
        ) : bottomPanel ? (
          bottomPanel
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MdlCommonPanel;
