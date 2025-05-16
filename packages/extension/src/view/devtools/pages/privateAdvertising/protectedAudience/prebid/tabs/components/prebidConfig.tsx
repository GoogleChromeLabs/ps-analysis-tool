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
import { noop } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableColumn,
} from '@google-psat/design-system';
import { useMemo, useState } from 'react';

type PrebidConfigPanelProps = {
  configObject: Partial<PrebidConfig>;
};
const PrebidConfig = ({ configObject }: PrebidConfigPanelProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Value',
        accessorKey: 'value',
        cell: (info) => info.toString(),
      },
    ],
    []
  );

  return (
    <div className="flex-1 w-[70%] flex flex-col border border-american-silver dark:border-quartz border-t-0 overflow-hidden">
      <TableProvider
        data={Object.entries(configObject).map(([key, value], index) => {
          return {
            name: key,
            value: value,
            index,
          };
        })}
        tableColumns={tableColumns}
        onRowClick={(row) => setSelectedKey(row?.originalData?.index)}
        onRowContextMenu={noop}
        getRowObjectKey={(row) => row?.originalData?.index}
      >
        <Table
          hideTableTopBar={true}
          selectedKey={selectedKey}
          minWidth="70%"
        />
      </TableProvider>
    </div>
  );
};

export default PrebidConfig;
