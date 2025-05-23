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
  Table,
  noop,
  type UserEID,
} from '@google-psat/design-system';
import { useState, useMemo, useCallback } from 'react';

type UserIdsProps = {
  config: EID[];
};

const UserIds = ({ config = [] }: UserIdsProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('');

  const userEids = useMemo(() => {
    const _userEids: UserEID[] = [];
    config.forEach((singleConfig) => {
      singleConfig.uids.forEach((uid) => {
        _userEids.push({
          source: singleConfig.source,
          userId: uid.id,
          aType: uid.atype,
        });
      });
    });
    return _userEids;
  }, [config]);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Source',
        accessorKey: 'source',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'User Id',
        accessorKey: 'userId',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'AType',
        accessorKey: 'aType',
        cell: (info) => info,
        enableHiding: false,
      },
    ],
    []
  );

  const isRowSelected = useCallback(
    (data: TableData | null) => {
      const _data = data as UserEID;

      if (!_data) {
        return true;
      }

      return (
        `${(_data as UserEID)?.source}#${(_data as UserEID)?.userId}` ===
        selectedKey
      );
    },
    [selectedKey]
  );

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <TableProvider
        data={userEids}
        tableColumns={tableColumns}
        isRowSelected={isRowSelected}
        onRowClick={(row) => {
          const _selectedKey = `${(row as UserEID)?.source}#${
            (row as UserEID)?.userId
          }`;
          setSelectedKey(_selectedKey);
        }}
        onRowContextMenu={noop}
        getRowObjectKey={(row) =>
          `${(row.originalData as UserEID)?.source}#${
            (row.originalData as UserEID)?.userId
          }`
        }
      >
        <Table
          hideTableTopBar={true}
          selectedKey={selectedKey}
          minWidth="70%"
          showOverflow={false}
        />
      </TableProvider>
    </div>
  );
};

export default UserIds;
