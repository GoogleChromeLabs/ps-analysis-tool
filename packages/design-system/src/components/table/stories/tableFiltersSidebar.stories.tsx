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
import TableFiltersSidebar from '../components/filtersSidebar';
import {
  mockData as defaultMockData,
  tableColumns as defaultTableColumns,
  tableFilters as defaultTableFilters,
} from './mockData';
import { TableProvider, useTable } from '../useTable';
import { noop } from '@google-psat/common';

const meta: Meta<typeof TableFiltersSidebar> = {
  title: 'DesignSystem/Table/SubComponents/TableFiltersSidebar',
  component: TableFiltersSidebar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TableFiltersSidebar>;

const SidebarWrapper = () => {
  const {
    filters,
    isSelectAllFilterSelected,
    toggleFilterSelection,
    toggleSelectAllFilter,
  } = useTable(({ state, actions }) => ({
    filters: state.filters,
    isSelectAllFilterSelected: actions.isSelectAllFilterSelected,
    toggleFilterSelection: actions.toggleFilterSelection,
    toggleSelectAllFilter: actions.toggleSelectAllFilter,
  }));

  return (
    <TableFiltersSidebar
      filters={filters}
      isSelectAllFilterSelected={isSelectAllFilterSelected}
      toggleFilterSelection={toggleFilterSelection}
      toggleSelectAllFilter={toggleSelectAllFilter}
    />
  );
};

const SidebarTemplate = (args: any) => {
  return (
    <TableProvider
      data={defaultMockData}
      tableColumns={defaultTableColumns}
      tableFilterData={args.tableFilterData || defaultTableFilters}
      onRowClick={noop}
      onRowContextMenu={noop}
      getRowObjectKey={(row) => {
        // @ts-ignore
        return row.originalData?.parsedCookie?.name || row.originalData?.id;
      }}
    >
      <div className="w-[300px] h-[600px] border border-gray-200 dark:border-quartz overflow-hidden">
        <SidebarWrapper />
      </div>
    </TableProvider>
  );
};

export const Default: Story = {
  render: (args) => <SidebarTemplate {...args} />,
  args: {},
};

export const CustomFilters: Story = {
  render: (args) => <SidebarTemplate {...args} />,
  args: {
    tableFilterData: {
      'parsedCookie.name': {
        title: 'Cookie Name',
      },
      'parsedCookie.httponly': {
        title: 'HttpOnly',
        filterValues: {
          True: { selected: false },
          False: { selected: false },
        },
      },
    },
  },
};
