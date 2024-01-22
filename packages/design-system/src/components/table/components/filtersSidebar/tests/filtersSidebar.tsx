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
import { render, screen } from '@testing-library/react';
import FiltersSidebar from '..';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { TableFilter } from '../../../useTable';

describe('FiltersSidebar', () => {
  const initialProps = {
    filters: {},
    toggleFilterSelection: () => undefined,
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

    const list = await screen.findAllByTestId('sub-list-item');

    expect(list[0]).toHaveTextContent('aValue');
  });
});
