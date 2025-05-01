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

import { fetchLocalData } from '@google-psat/common';
import {
  noop,
  ProgressBar,
  Table,
  TableProvider,
  type TableFilter,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';
import React, { useEffect, useMemo, useState } from 'react';

const MDLTable = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [tableData, setTableData] = useState<
    { domain: string; owner: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const data = await fetchLocalData('data/mdl.json');

      setTableData(() =>
        data.map((item: string[]) => ({
          domain: item[0],
          owner: item[1],
        }))
      );
    })();
  }, []);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Domain',
        accessorKey: 'domain',
        cell: (info) => info,
      },
      {
        header: 'Owner',
        accessorKey: 'owner',
        cell: (info) => info,
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(
    () => ({
      owner: {
        title: 'Owner',
      },
    }),
    []
  );

  if (tableData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ProgressBar additionalStyles="w-80 h-80" />
      </div>
    );
  }

  return (
    <TableProvider
      tableColumns={tableColumns}
      tableFilterData={filters}
      tableSearchKeys={['domain', 'owner']}
      data={tableData}
      onRowClick={(rowData) => {
        setSelectedKey(rowData?.domain || null);
      }}
      onRowContextMenu={noop}
      getRowObjectKey={(row: TableRow) => row.originalData.domain || ''}
      tablePersistentSettingsKey="mdlTable"
    >
      <Table selectedKey={selectedKey} />
    </TableProvider>
  );
};

export default MDLTable;
