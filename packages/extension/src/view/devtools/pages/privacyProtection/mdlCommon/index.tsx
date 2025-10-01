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
  noop,
  type TableData,
  type TableColumn,
  DraggableTray,
  TabsProvider,
  type TabItem,
} from '@google-psat/design-system';
import React, { useRef, useState } from 'react';
import { type MDLTableData, type PRTMetadata } from '@google-psat/common';
/**
 * Internal dependencies
 */
import RowContextMenuForMDLTable from './rowContextMenu';
import StatsHeader from './statsHeader';
import { type StatItem } from './types';

interface MdlCommonPanelProps {
  tabItems: TabItem[];
  tableColumns: TableColumn[];
  tableData: PRTMetadata[] | MDLTableData[];
  selectedKey?: string;
  onRowClick: (row: TableData | null) => void;
  extraInterfaceToTopBar?: () => React.JSX.Element;
  filters?: TableFilter;
  stats: StatItem[] | null;
  tableSearchKeys: string[];
  tab: string;
  activeTabIndex?: () => 0 | 1;
}

const MdlCommonPanel = ({
  tabItems,
  tableColumns,
  tableData,
  selectedKey,
  onRowClick,
  tableSearchKeys = [],
  extraInterfaceToTopBar,
  filters,
  stats,
  tab = '',
  activeTabIndex = () => 0,
}: MdlCommonPanelProps) => {
  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForMDLTable
  > | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {stats && <StatsHeader stats={stats} />}
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
          onRowContextMenu={rowContextMenuRef.current?.onRowContextMenu ?? noop}
        >
          <Table
            selectedKey={selectedKey}
            minWidth="50rem"
            extraInterfaceToTopBar={extraInterfaceToTopBar}
          />
          <RowContextMenuForMDLTable ref={rowContextMenuRef} tab={tab} />
        </TableProvider>
      </div>
      <TabsProvider isGroup={false} items={tabItems} name={tab + 'bottomPanel'}>
        <DraggableTray
          ref={draggableTrayRef}
          trayId={tab + 'bottomPanel'}
          activeTabIndex={activeTabIndex}
        />
      </TabsProvider>
    </div>
  );
};

export default MdlCommonPanel;
