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
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import TableHeader from '../components/tableHeader';
import {
  mockData as defaultMockData,
  tableColumns as defaultTableColumns,
} from './mockData';
import { TableProvider } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof TableHeader> = {
  title: 'DesignSystem/Table/SubComponents/TableHeader',
  component: TableHeader,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TableHeader>;

const HeaderTemplate = (args: any) => {
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
        <table className="w-full table-fixed border-separate border-spacing-0">
          <TableHeader
            {...args}
            setColumnPosition={noop}
            onRightClick={noop}
            setIsRowFocused={noop}
          />
        </table>
      </div>
    </TableProvider>
  );
};

export const Default: Story = {
  render: (args) => <HeaderTemplate {...args} />,
  args: {},
};
