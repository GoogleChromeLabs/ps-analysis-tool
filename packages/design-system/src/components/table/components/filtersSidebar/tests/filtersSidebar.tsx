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

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FiltersSidebar from '..';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { TableFilter } from '../../../useTable';

describe('FiltersSidebar', () => {
  const initialProps = {
    filters: {},
    toggleFilterSelection: () => undefined,
    toggleSelectAllFilter: () => undefined,
    isSelectAllFilterSelected: () => false,
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
  };

  it('should render null', () => {
    render(<FiltersSidebar {...initialProps} />);

    const filtersSidebar = screen.queryByTestId('filters-sidebar');

    expect(filtersSidebar).toBeNull();
  });

  it('should render a list of filters', () => {
    render(<FiltersSidebar {...props} />);

    const filtersSidebar = screen.getByTestId('filters-sidebar');
    const filter1 = screen.getByText('Filter 1');
    const filter2 = screen.getByText('Filter 2');

    expect(filtersSidebar).toBeInTheDocument();
    expect(filter1).toBeInTheDocument();
    expect(filter2).toBeInTheDocument();
  });

  it('should show options when clicked on filter', async () => {
    render(<FiltersSidebar {...props} />);

    const filter1 = screen.getByText('Filter 1');
    const filter2 = screen.getByText('Filter 2');

    expect(filter1).toBeInTheDocument();
    expect(filter2).toBeInTheDocument();

    act(() => {
      filter1.click();
    });

    const value1 = await screen.findByText('value1');
    const value2 = await screen.findByText('value2');

    expect(value1).toBeInTheDocument();
    expect(value2).toBeInTheDocument();
  });

  it('should render Filter 3 as disabled', () => {
    render(<FiltersSidebar {...props} />);

    const filtersSidebar = screen.getByTestId('filters-sidebar');
    const filter3 = screen.getByText('Filter 3');

    expect(filtersSidebar).toBeInTheDocument();
    expect(filter3).toBeInTheDocument();
    expect(filter3.closest('button')).toBeDisabled();
  });

  it('should show filters in alphabetical order', async () => {
    render(<FiltersSidebar {...props} />);

    const filter1 = screen.getByText('Filter 1');
    act(() => {
      filter1.click();
    });

    await waitFor(() => {
      const list = screen.getAllByTestId('sub-list-item');

      expect(list[1]).toHaveTextContent('aValue');
    });
  });

  it('should expand all filters', async () => {
    const { rerender } = render(<FiltersSidebar {...props} />);

    const expandAll = await screen.findByText('Expand/Collapse All');
    act(() => {
      expandAll.click();
    });

    const expandArrow = await screen.findByTestId('expand-arrow');
    const listExpandArrows = await screen.findAllByTestId('list-item-arrow');

    expect(expandArrow).not.toHaveClass('-rotate-90');
    expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');

    act(() => {
      expandAll.click();
    });

    expect(expandArrow).toHaveClass('-rotate-90');
    expect(listExpandArrows[0]).toHaveClass('-rotate-90');

    act(() => {
      listExpandArrows[0].click();
    });

    expect(expandArrow).toHaveClass('-rotate-90');
    expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');

    act(() => {
      listExpandArrows[1].click();
    });

    await waitFor(() => {
      expect(expandArrow).toHaveClass('-rotate-90');
      expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[1]).not.toHaveClass('-rotate-90');
    });

    rerender(
      <FiltersSidebar
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
      expect(expandArrow).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[0]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[1]).not.toHaveClass('-rotate-90');
      expect(listExpandArrows[2]).not.toHaveClass('-rotate-90');
    });

    rerender(<FiltersSidebar {...props} />);

    await waitFor(() => {
      expect(expandArrow).not.toHaveClass('-rotate-90');
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
      expect(expandArrow).toHaveClass('-rotate-90');
    });
  });

  it('should handle select All filter option', async () => {
    const toggleSelectAllFilter = jest.fn();
    const toggleFilterSelection = jest.fn();
    const { rerender } = render(
      <FiltersSidebar
        {...props}
        toggleSelectAllFilter={toggleSelectAllFilter}
        toggleFilterSelection={toggleFilterSelection}
        isSelectAllFilterSelected={() => true}
      />
    );

    const filter1 = screen.getByText('Filter 1');
    act(() => {
      filter1.click();
    });

    const selectAll = await screen.findByText('All');
    act(() => {
      selectAll.click();
    });

    await waitFor(() => {
      expect(toggleSelectAllFilter).toHaveBeenCalledWith('filter1');
    });

    rerender(
      <FiltersSidebar
        {...props}
        toggleSelectAllFilter={toggleSelectAllFilter}
        toggleFilterSelection={toggleFilterSelection}
        isSelectAllFilterSelected={() => false}
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
});
