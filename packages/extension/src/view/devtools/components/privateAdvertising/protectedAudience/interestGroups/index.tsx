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
import { Resizable } from 're-resizable';
import {
  Table,
  TableProvider,
  type TableColumn,
  type TableData,
  type TableRow,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { noop } from '@google-psat/common';

const InterestGroups = () => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'eventTime',
        cell: (info) => info,
      },
      {
        header: 'Access Type',
        accessorKey: 'accessType',
        cell: (info) => info,
      },
      {
        header: 'Owner',
        accessorKey: 'owner',
        cell: (info) => info,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info,
      },
      {
        header: 'Expiration Time',
        accessorKey: 'expirationTime',
        cell: (info) => info,
      },
    ],
    []
  );

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-t border-american-silver dark:border-quartz flex flex-col">
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
          data={[]}
          tableColumns={tableColumns}
          tableFilterData={undefined}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="interestGroupsTable"
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
      <div className="flex-1 border border-gray-300 dark:border-quartz shadow min-w-[10rem]">
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

export default InterestGroups;