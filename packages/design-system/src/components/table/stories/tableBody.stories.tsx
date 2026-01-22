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
import TableBody from '../components/tableBody';
import {
  mockData as defaultMockData,
  tableColumns as defaultTableColumns,
} from './mockData';
import { TableProvider } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof TableBody> = {
  title: 'DesignSystem/Table/SubComponents/TableBody',
  component: TableBody,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TableBody>;

const BodyTemplate = (args: any) => {
  return (
    <TableProvider
      data={args.data || defaultMockData}
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
          <TableBody
            {...args}
            isRowFocused={false}
            setIsRowFocused={noop}
            selectedKey={args.selectedKey || null}
          />
        </table>
      </div>
    </TableProvider>
  );
};

export const Default: Story = {
  render: (args) => <BodyTemplate {...args} />,
  args: {},
};

export const SelectedRow: Story = {
  render: (args) => <BodyTemplate {...args} />,
  args: {
    selectedKey: 'AEC',
  },
};

export const Empty: Story = {
  render: (args) => <BodyTemplate {...args} />,
  args: {
    data: [],
  },
};
