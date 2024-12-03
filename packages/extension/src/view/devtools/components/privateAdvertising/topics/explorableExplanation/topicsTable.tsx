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
  useTabs,
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
  data: Record<number, TopicsTableType[]>;
}

const TopicsTable = ({ data }: TopicsTableProps) => {
  const { activeTab } = useTabs(({ state }) => ({
    activeTab: state.activeTab,
  }));

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Topic Name',
        accessorKey: 'topicName',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Access Count',
        accessorKey: 'count',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Observed-by context domains',
        accessorKey: 'observedByContextDomains',
        cell: (info: InfoType) => (info as string[]).join(' | '),
        widthWeightagePercentage: 60,
      },
    ],
    []
  );

  const tablePersistentSettingsKey = 'topicsTable';

  return (
    <TableProvider
      // @ts-ignore
      data={data[activeTab] ?? []}
      tableColumns={tableColumns}
      onRowClick={noop}
      onRowContextMenu={noop}
      getRowObjectKey={(row) => row.originalData.topicName}
      tablePersistentSettingsKey={tablePersistentSettingsKey}
    >
      <Table hideSearch hideFiltering selectedKey={''} hideTableTopBar />
    </TableProvider>
  );
};

export default TopicsTable;
