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
import type { Meta, StoryObj } from '@storybook/react';
/**
 * Internal dependencies
 */
import Table from '../components';
import {
  mockData,
  tableColumns,
  tableFilters,
  tableSearchKeys,
} from './mockData';
import { TableProvider } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof Table> = {
  title: 'DesignSystem/Table',
  component: () => (
    <div className="w-[90vw] h-full">
      <TableProvider
        data={mockData}
        tableColumns={tableColumns}
        tableFilterData={tableFilters}
        tableSearchKeys={tableSearchKeys}
        onRowClick={noop}
        onRowContextMenu={noop}
        getRowObjectKey={(row) => {
          //@ts-ignore
          return row.originalData?.parsedCookie?.name;
        }}
      >
        <Table selectedKey={'parsedCookie.name'} isFiltersSidebarOpen={true} />
      </TableProvider>
    </div>
  ),
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {},
};
