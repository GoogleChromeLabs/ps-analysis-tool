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
 * External dependencies.
 */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import TableTopBar from '../components/tableTopBar';
import {
  mockData as defaultMockData,
  tableColumns as defaultTableColumns,
} from './mockData';
import { TableProvider } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof TableTopBar> = {
  title: 'DesignSystem/Table/SubComponents/TableTopBar',
  component: TableTopBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TableTopBar>;

const TopBarTemplate = (args: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  return (
    <TableProvider
      data={defaultMockData}
      tableColumns={defaultTableColumns}
      onRowClick={noop}
      onRowContextMenu={noop}
      getRowObjectKey={(row) => {
        // @ts-ignore
        return row.originalData?.parsedCookie?.name || row.originalData?.id;
      }}
    >
      <div className="w-[95vw] border border-gray-200 dark:border-quartz">
        <TableTopBar
          {...args}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          showFilterSidebar={showFilterSidebar}
          setShowFilterSidebar={setShowFilterSidebar}
          rows={[]} // Managed by provider in real use, but TopBar takes it as prop for export
        />
      </div>
    </TableProvider>
  );
};

export const Default: Story = {
  render: (args) => <TopBarTemplate {...args} />,
  args: {
    count: 10,
  },
};

export const WithExport: Story = {
  render: (args) => <TopBarTemplate {...args} />,
  args: {
    count: 50,
    exportTableData: () => alert('Exporting data...'),
  },
};

export const WithExtraInterface: Story = {
  render: (args) => <TopBarTemplate {...args} />,
  args: {
    count: 10,
    extraInterface: () => (
      <div className="flex items-center px-2">
        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Custom Action
        </button>
      </div>
    ),
  },
};

export const HiddenSearch: Story = {
  render: (args) => <TopBarTemplate {...args} />,
  args: {
    count: 10,
    hideSearch: true,
  },
};
