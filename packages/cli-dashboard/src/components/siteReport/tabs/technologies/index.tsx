/*
 * Copyright 2023 Google LLC
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
import React, { useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  Table,
  noop,
  useTable,
  type TableColumn,
  type InfoType,
} from '@cookie-analysis-tool/design-system';
import { useContentStore } from '../../stateProviders/contentStore';
import type { TechnologyData } from '@cookie-analysis-tool/common';

const Technologies = () => {
  const data = useContentStore(({ state }) => state.technologies || []);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: (info: InfoType) => <p title={info as string}>{info}</p>,
      },
      {
        header: 'Confidence',
        accessorKey: 'confidence',
        cell: (info: InfoType) => info + '%',
      },
      {
        header: 'Website',
        accessorKey: 'website',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Category',
        accessorKey: 'categories',
        cell: (info: InfoType) =>
          (info as TechnologyData['categories']).map((i) => i.name).join(' | '),
      },
    ],
    []
  );

  const table = useTable({
    tableColumns,
    data,
  });

  return (
    <div className="w-full h-full overflow-auto text-outer-space-crayola border-x border-american-silver dark:border-quartz">
      <div className="w-full h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
        <div className="text-right w-full text-xxxs text-secondary">
          Count: {Number(data?.length) || 0}
        </div>
      </div>
      <Table
        table={table}
        selectedKey={undefined}
        onRowClick={noop}
        getRowObjectKey={() => ''}
      />
    </div>
  );
};

export default Technologies;
