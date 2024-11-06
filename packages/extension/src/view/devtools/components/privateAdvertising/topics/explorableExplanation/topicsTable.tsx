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
  type InfoType,
  type TableColumn,
} from '@google-psat/design-system';
import React, { useMemo } from 'react';

export type TopicsTableType = {
  topicName: string;
  count: number;
  observedByContextDomains: string[];
};

interface TopicsTableProps {
  data: TopicsTableType[];
}

const TopicsTable = ({ data }: TopicsTableProps) => {
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Topic Name',
        accessorKey: 'topicName',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 30,
      },
      {
        header: 'Count',
        accessorKey: 'count',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 10,
      },
      {
        header:
          'Observed-by context domains (hashed if the original value is unavailable)',
        accessorKey: 'observedByContextDomains',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 60,
      },
    ],
    []
  );

  const tablePersistentSettingsKey = 'topicsTable';

  return (
    <TableProvider
      // @ts-ignore
      data={data}
      tableColumns={tableColumns}
      onRowClick={noop}
      onRowContextMenu={noop}
      getRowObjectKey={() => ''}
      tablePersistentSettingsKey={tablePersistentSettingsKey}
    >
      <Table hideSearch hideFiltering selectedKey={''} hideTableTopBar />
    </TableProvider>
  );
};

export default TopicsTable;
