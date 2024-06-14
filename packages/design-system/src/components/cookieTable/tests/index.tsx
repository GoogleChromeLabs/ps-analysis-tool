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
import React, { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import CookieTable from '..';
import { InfoType } from '../../table';

describe('CookieTable', () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  jest.mock('../../table', () => ({
    useTablePersistentSettingsStore: () => ({
      getPreferences: jest.fn(),
      setPreferences: jest.fn(),
    }),
  }));

  const initialProps = {
    data: [
      {
        parsedCookie: {
          name: 'test',
          value: 'testVal',
        },
      } as CookieTableData,
      {
        parsedCookie: {
          name: 'test2',
          value: 'test2Val',
        },
      } as CookieTableData,
      {
        parsedCookie: {
          name: 'test3',
          value: 'test3Val',
        },
      } as CookieTableData,
      {
        parsedCookie: {
          name: 'test4',
          value: 'test4Val',
        },
      } as CookieTableData,
    ],
    tableColumns: [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
        widthWeightagePercentage: 70,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 30,
      },
    ],
    tableFilters: {
      'parsedCookie.name': {
        title: 'NameFilter',
        description: 'Name of the cookie',
        hasStaticFilterValues: true,
        filterValues: {
          testFilter: {
            selected: false,
          },
          test2Filter: {
            selected: false,
          },
          test3Filter: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          return filterValue.includes(value.toString());
        },
      },
      'parsedCookie.value': {
        title: 'ValueFilter',
        description: 'Value of the cookie',
      },
    },
    tableSearchKeys: ['parsedCookie.name', 'parsedCookie.value'],
    selectedFrame: 'testFrame',
    showTopBar: true,
    selectedFrameCookie: {
      testFrame: {
        parsedCookie: {
          name: 'test',
          value: 'testVal',
        },
      } as CookieTableData,
    },
    hostname: '',
    setSelectedFrameCookie: jest.fn(),
  };

  it('should render the table', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
  });

  it('should sort cookies by name', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.click(name);

    const firstRow = await screen.findByText('test');
    expect(firstRow.innerHTML).toMatch('test');

    fireEvent.click(name);

    expect(firstRow.innerHTML).toMatch('test4');

    const value = await screen.findByText('Value');

    expect(value).toBeInTheDocument();
    fireEvent.click(value);

    expect(firstRow.innerHTML).toMatch('test2');
  });

  it('should filter cookies by name', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    act(() => fireEvent.click(name));

    await waitFor(() => {
      const firstRow = screen.getByText('test');
      expect(firstRow.innerHTML).toMatch('test');
    });

    const filterButton = await screen.findByTitle('Open filter options');
    act(() => fireEvent.click(filterButton));

    const filter = await screen.findByText('NameFilter');
    act(() => fireEvent.click(filter));

    const testFilter = await screen.findByText('testFilter');
    act(() => fireEvent.click(testFilter));

    await waitFor(() => {
      const rows = screen.getAllByTestId('body-row');
      expect(rows.length).toBe(1);
    });
  });

  it('should search cookies by name', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.click(name);

    const firstRow = await screen.findByText('test');
    expect(firstRow.innerHTML).toMatch('test');

    const searchInput = await screen.findByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test2' } });

    expect(firstRow.innerHTML).toMatch('test2');
  });

  it('should select a cookie', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.click(name);

    const firstRow = await screen.findByText('test');
    expect(firstRow.innerHTML).toMatch('test');

    fireEvent.click(firstRow);

    expect(initialProps.setSelectedFrameCookie).toHaveBeenCalledWith({
      testFrame: {
        parsedCookie: {
          name: 'test',
          value: 'testVal',
        },
      },
    });
  });

  it('should open column menu when right click on header cell', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.contextMenu(name);

    expect(screen.getByText('Toggle All')).toBeInTheDocument();
  });

  it('should hide value column when toggle all is clicked', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.contextMenu(name);

    expect(screen.getByText('Toggle All')).toBeInTheDocument();

    let toggleAll = await screen.findByText('Toggle All');
    fireEvent.click(toggleAll);

    await waitFor(() => {
      expect(toggleAll).not.toBeInTheDocument();
    });

    const headers = await screen.findAllByTestId('header-cell');

    expect(headers.length).toBe(1);
    fireEvent.contextMenu(name);

    expect(screen.getByText('Toggle All')).toBeInTheDocument();

    toggleAll = await screen.findByText('Toggle All');
    fireEvent.click(toggleAll);

    await waitFor(() => {
      expect(toggleAll).not.toBeInTheDocument();
    });

    const headersAfterToggle = await screen.findAllByTestId('header-cell');

    expect(headersAfterToggle.length).toBe(2);
  });

  it('should clear search when clear search button is clicked', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    fireEvent.click(name);

    const firstRow = await screen.findByText('test');
    expect(firstRow.innerHTML).toMatch('test');

    const searchInput = await screen.findByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test2' } });

    expect(firstRow.innerHTML).toMatch('test2');

    const clearSearchButton = await screen.findByTitle('Clear Search');
    fireEvent.click(clearSearchButton);

    expect(firstRow.innerHTML).toMatch('test');
  });

  it('should clear filters when clear filters button is clicked', async () => {
    render(<CookieTable {...initialProps} />);

    const name = await screen.findByText('Name');

    expect(name).toBeInTheDocument();
    act(() => fireEvent.click(name));

    const firstRow = await screen.findByText('test');
    expect(firstRow.innerHTML).toMatch('test');

    const filterButton = await screen.findByTitle('Open filter options');
    act(() => fireEvent.click(filterButton));

    const filter = await screen.findByText('NameFilter');
    act(() => fireEvent.click(filter));

    const testFilter = await screen.findByText('testFilter');
    act(() => fireEvent.click(testFilter));

    const test2Filter = await screen.findByText('test2Filter');
    act(() => fireEvent.click(test2Filter));

    const test3Filter = await screen.findByText('test3Filter');
    act(() => fireEvent.click(test3Filter));

    await waitFor(() => {
      const rows = screen.getAllByTestId('body-row');
      expect(rows.length).toBe(3);
    });

    const clearFiltersButton = await screen.findByText('Clear all');
    act(() => fireEvent.click(clearFiltersButton));

    await waitFor(() => {
      const rowsAfterClear = screen.getAllByTestId('body-row');
      expect(rowsAfterClear.length).toBe(4);
    });
  });

  it('should get the cookie object when row is clicked or Arrow up/down pressed', async () => {
    render(<CookieTable {...initialProps} />);

    const row = await screen.findAllByTestId('body-row');
    fireEvent.click(row[0]);

    expect(row[0]).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(row[0], { key: 'ArrowDown', code: 'ArrowDown' });

    expect(row[1]).not.toHaveClass('dark:bg-charlston-green');

    const emptyRow = await screen.findByTestId('empty-row');
    fireEvent.click(emptyRow);

    expect(emptyRow).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(emptyRow, { key: 'ArrowDown', code: 'ArrowDown' });

    expect(emptyRow).not.toHaveClass('dark:bg-charlston-green');

    fireEvent.keyDown(emptyRow, { key: 'ArrowUp', code: 'ArrowUp' });

    expect(row[row.length - 1]).not.toHaveClass('dark:bg-charlston-green');
  });
});
