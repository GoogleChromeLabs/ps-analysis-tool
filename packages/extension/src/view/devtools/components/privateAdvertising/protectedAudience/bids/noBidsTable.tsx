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
import { noop } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';
import React, { useMemo } from 'react';

interface NoBidsTableProps {
  setSelectedRow: (row: any) => void;
  selectedRow: any;
}

const NoBidsTable = ({ setSelectedRow, selectedRow }: NoBidsTableProps) => {
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Bidder',
        accessorKey: 'bidder',
        cell: (info) => info,
      },
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => info,
      },
    ],
    []
  );

  return (
    <TableProvider
      data={[]}
      tableColumns={tableColumns}
      tableFilterData={undefined}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="noBidsTable"
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
        minWidth="42rem"
        hideSearch={true}
      />
    </TableProvider>
  );
};

export default NoBidsTable;
