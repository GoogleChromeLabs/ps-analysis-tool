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

import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TableFiltersSidebar from '..';
import '@testing-library/jest-dom';
import { TableFilter } from '../../../useTable/types';
import * as table from '../../../useTable/useTable';
import TableChipsBar from '../chips';
import { I18n } from '@google-psat/i18n';

describe('TableFiltersSidebar', () => {
  const mockUseTable = jest.fn();
  jest.spyOn(table, 'useTable').mockImplementation(mockUseTable);
  globalThis.chrome.i18n = null;

  I18n.initMessages({
    clearAll: {
      message: 'Clear all',
    },
    selectAll: {
      message: 'All',
    },
    expandAll: {
      message: 'Expand All',
    },
  });

  const initialProps = {
    filters: {},
    selectedFilters: {},
    toggleFilterSelection: () => undefined,
    toggleSelectAllFilter: () => undefined,
    isSelectAllFilterSelected: () => false,
    resetFilters: () => undefined,
  };

  const props = {
    ...initialProps,
    filters: {
      filter1: {
        filterValues: {
          value1: {
            selected: true,
          },
          value2: {
            selected: false,
          },
          aValue: {
            selected: false,
          },
        },
        title: 'Filter 1',
        enableSelectAllOption: true,
      },
      filter2: {
        filterValues: {
          value3: {
            selected: true,
          },
          value4: {
            selected: false,
          },
        },
        title: 'Filter 2',
      },
      filters3: {
        filterValues: {} as TableFilter['filterValues'],
        title: 'Filter 3',
      },
    },
    selectedFilters: {
      filter1: {
        filterValues: {
          value1: {
            selected: true,
          },
        },
        title: 'Filter 1',
      },
      filter2: {
        filterValues: {
          value3: {
            selected: true,
          },
        },
        title: 'Filter 2',
      },
    },
  };

  it('should render sidebar', () => {
    mockUseTable.mockReturnValue({
      filters: initialProps.filters,
      isSelectAllFilterSelected: initialProps.isSelectAllFilterSelected,
      toggleFilterSelection: initialProps.toggleFilterSelection,
      toggleSelectAllFilter: initialProps.toggleSelectAllFilter,
    });

    render(<TableFiltersSidebar {...props} />);

    const filtersSidebar = screen.queryByTestId('filters-sidebar');

    expect(filtersSidebar).toBeInTheDocument();
  });

  it('should render a list of filters', () => {
    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    render(<TableFiltersSidebar {...props} />);

    const filtersSidebar = screen.getByTestId('filters-sidebar');
    const filter1 = screen.getByText('Filter 1');
    const filter2 = screen.getByText('Filter 2');

    expect(filtersSidebar).toBeInTheDocument();
    expect(filter1).toBeInTheDocument();
    expect(filter2).toBeInTheDocument();
  });

  it('should show options if already selected', async () => {
    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    render(<TableFiltersSidebar {...props} />);

    const filter1 = screen.getByText('Filter 1');
    const filter2 = screen.getByText('Filter 2');

    expect(filter1).toBeInTheDocument();
    expect(filter2).toBeInTheDocument();

    const value1 = await screen.findByText('value1');
    const value2 = await screen.findByText('value2');

    expect(value1).toBeInTheDocument();
    expect(value2).toBeInTheDocument();

    act(() => {
      filter1.click();
    });

    expect(value1).not.toBeInTheDocument();
    expect(value2).not.toBeInTheDocument();
  });

  it('should render Filter 3 as disabled', () => {
    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    render(<TableFiltersSidebar {...props} />);

    const filtersSidebar = screen.getByTestId('filters-sidebar');
    const filter3 = screen.getByText('Filter 3');

    expect(filtersSidebar).toBeInTheDocument();
    expect(filter3).toBeInTheDocument();
    expect(filter3.closest('button')).toBeDisabled();
  });

  it('should show filters in alphabetical order', async () => {
    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    render(<TableFiltersSidebar {...props} />);

    await waitFor(() => {
      const list = screen.getAllByTestId('sub-list-item');

      expect(list[1]).toHaveTextContent('aValue');
    });
  });

  it('should expand all filters', async () => {
    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    const { rerender } = render(<TableFiltersSidebar {...props} />);

    const expandAll = await screen.findByText('Expand All');
    act(() => {
      expandAll.click();
    });

    const listExpandArrows = await screen.findAllByTestId('list-item-arrow');

    expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');

    act(() => {
      expandAll.click();
    });

    expect(expandAll.innerHTML).not.toEqual('Collapse All');
    expect(listExpandArrows[0]).toHaveClass('-rotate-90');

    act(() => {
      listExpandArrows[0].click();
    });

    expect(expandAll.innerHTML).not.toEqual('Collapse All');
    expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');

    act(() => {
      listExpandArrows[1].click();
    });

    await waitFor(() => {
      expect(expandAll.innerHTML).toEqual('Expand All');
      expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[1]).not.toHaveClass('-rotate-90');
    });

    mockUseTable.mockReturnValue({
      filters: {
        ...props.filters,
        filters3: {
          filterValues: {
            value5: {
              selected: true,
            },
            value6: {
              selected: false,
            },
          },
          title: 'Filter 3',
        },
      },
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    rerender(
      <TableFiltersSidebar
        {...props}
        filters={{
          ...props.filters,
          filters3: {
            filterValues: {
              value5: {
                selected: true,
              },
              value6: {
                selected: false,
              },
            },
            title: 'Filter 3',
          },
        }}
      />
    );

    act(() => {
      listExpandArrows[2].click();
    });

    await waitFor(() => {
      expect(expandAll.innerHTML).not.toEqual('Expand All');
      expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[1]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[2]).not.toHaveClass('-rotate-90');
    });

    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
    });

    rerender(<TableFiltersSidebar {...props} />);

    await waitFor(() => {
      expect(expandAll.innerHTML).not.toEqual('Expand All');
      expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[1]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[2]).toHaveClass('-rotate-90');
    });

    act(() => {
      listExpandArrows[2].click();
    });

    await waitFor(() => {
      expect(listExpandArrows[2]).toHaveClass('-rotate-90');
    });

    act(() => {
      listExpandArrows[0].click();
      listExpandArrows[1].click();
    });

    await waitFor(() => {
      expect(expandAll.innerHTML).toEqual('Expand All');
    });
  });

  it('should handle select All filter option', async () => {
    const toggleSelectAllFilter = jest.fn();
    const toggleFilterSelection = jest.fn();

    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: () => true,
      toggleFilterSelection,
      toggleSelectAllFilter,
    });

    const { rerender } = render(
      <TableFiltersSidebar
        {...props}
        toggleFilterSelection={toggleFilterSelection}
        toggleSelectAllFilter={toggleSelectAllFilter}
      />
    );

    const selectAll = await screen.findByText('All');
    act(() => {
      selectAll.click();
    });

    await waitFor(() => {
      expect(toggleSelectAllFilter).toHaveBeenCalledWith('filter1');
    });

    mockUseTable.mockReturnValue({
      filters: props.filters,
      isSelectAllFilterSelected: () => false,
      toggleFilterSelection,
      toggleSelectAllFilter,
    });

    rerender(
      <TableFiltersSidebar
        {...props}
        toggleFilterSelection={toggleFilterSelection}
        toggleSelectAllFilter={toggleSelectAllFilter}
      />
    );

    await waitFor(() => {
      const filterCheckBoxes = screen.getAllByRole('checkbox');

      expect(filterCheckBoxes[0]).not.toBeChecked();
      expect(filterCheckBoxes[1]).not.toBeChecked();
      expect(filterCheckBoxes[2]).toBeChecked();
    });

    const value1Option = await screen.findByText('value1');
    act(() => {
      value1Option.click();
    });

    await waitFor(() => {
      expect(toggleFilterSelection).toHaveBeenCalledWith('filter1', 'value1');
    });
  });

  it('should show clear all button', async () => {
    const resetFilters = jest.fn();

    mockUseTable.mockReturnValue({
      filters: props.filters,
      selectedFilters: props.selectedFilters,
      isSelectAllFilterSelected: props.isSelectAllFilterSelected,
      toggleFilterSelection: props.toggleFilterSelection,
      toggleSelectAllFilter: props.toggleSelectAllFilter,
      resetFilters: resetFilters,
    });

    render(
      <>
        <TableChipsBar {...props} resetFilters={resetFilters} />
        <TableFiltersSidebar {...props} />
      </>
    );

    const clearAll = await screen.findByText('Clear all');
    expect(clearAll).toBeInTheDocument();

    act(() => {
      clearAll.click();
    });

    await waitFor(() => {
      expect(resetFilters).toHaveBeenCalled();
    });
  });
});
