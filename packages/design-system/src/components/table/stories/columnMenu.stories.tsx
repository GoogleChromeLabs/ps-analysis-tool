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
import ColumnMenu from '../components/columnMenu';
import {
  mockData as defaultMockData,
  tableColumns as defaultTableColumns,
} from './mockData';
import { TableProvider } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof ColumnMenu> = {
  title: 'DesignSystem/Table/SubComponents/ColumnMenu',
  component: ColumnMenu,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ColumnMenu>;

const MenuTemplate = (args: any) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOpen = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

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
      <div className="w-[95vw] h-[400px] border border-gray-200 dark:border-quartz flex items-center justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={handleOpen}
        >
          Right Click / Click to open Column Menu
        </button>
        <ColumnMenu
          {...args}
          open={open}
          position={position}
          onClose={(val) => setOpen(val)}
        />
      </div>
    </TableProvider>
  );
};

export const Default: Story = {
  render: (args) => <MenuTemplate {...args} />,
  args: {},
};
