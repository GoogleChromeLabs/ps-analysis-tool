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
  type TableColumn,
  type TableData,
  TableProvider,
  JsonView,
  Table,
  noop,
  type PrebidUserIdsTableData,
  ResizableTray,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { useState, useMemo, useCallback } from 'react';

type ConsentManagementPanelProps = {
  config: UserIdConfig[];
};

const UserIds = ({ config }: ConsentManagementPanelProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<Partial<UserIdConfig> | null>(
    null
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Storage Type',
        accessorKey: 'type',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Expires',
        accessorKey: 'expires',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Storage Name',
        accessorKey: 'storageName',
        cell: (info) => info,
        enableHiding: false,
      },
    ],
    []
  );

  const rows = useMemo(() => {
    if (!config) {
      return [];
    }

    return config.map((storage) => {
      return {
        name: storage.name,
        type: storage.storage?.type,
        expires: storage.storage?.expires,
        storageName: storage.storage?.name,
      };
    });
  }, [config]);

  const isRowSelected = useCallback(
    (data: TableData | null) => {
      const _data = data as PrebidUserIdsTableData;

      if (!_data) {
        return true;
      }

      return _data.name === selectedKey;
    },
    [selectedKey]
  );

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
        trayId="user-ids-table-bottom-tray"
      >
        <TableProvider
          data={rows}
          tableColumns={tableColumns}
          isRowSelected={isRowSelected}
          onRowClick={(row) => {
            const _selectedKey = (row as PrebidUserIdsTableData)?.name ?? '';
            setSelectedKey(_selectedKey);

            if (_selectedKey && row) {
              setSelectedRow(
                config.find(
                  (storage) => storage.name === _selectedKey
                ) as UserIdConfig
              );
            }
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row) => (row.originalData as UserIdConfig)?.name}
        >
          <Table
            hideTableTopBar={true}
            selectedKey={selectedKey}
            minWidth="70%"
            showOverflow={false}
          />
        </TableProvider>
      </ResizableTray>
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

export default UserIds;
