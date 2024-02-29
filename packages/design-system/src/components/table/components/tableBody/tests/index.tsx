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
import { render, screen, fireEvent } from '@testing-library/react';
import SinonChrome from 'sinon-chrome';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import TableBody from '..';
import table from '../../../../../test-data/cookieTableMockData';
import * as useTable from '../../../useTable/useTable';

const bodyRowProp = {
  row: table.rows[0],
  selectedKey: '',
  isRowFocused: false,
  selectedRow: null,
};

const setIsRowFocused = jest.fn((isRowFocused: boolean) => {
  bodyRowProp.isRowFocused = isRowFocused;
});

const onRowClick = jest.fn((row) => {
  bodyRowProp.selectedRow = row;
});

const getRowObjectKey = jest.fn((row) => {
  return row.originalData.slug;
});

describe('TableBody', () => {
  const mockUseTable = jest.fn();
  jest.spyOn(useTable, 'useTable').mockImplementation(mockUseTable);

  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
  });

  it('should render Table Body component', () => {
    mockUseTable.mockReturnValue({
      rows: table.rows,
      columns: table.columns,
      onRowClick,
      onRowContextMenu: jest.fn(),
      getRowObjectKey,
      conditionalTableRowClassesHandler: jest.fn(),
      hasVerticalBar: () => false,
    });

    render(
      <TableBody
        isRowFocused={bodyRowProp.isRowFocused}
        setIsRowFocused={setIsRowFocused}
        selectedKey={bodyRowProp.selectedKey}
      />
    );

    const rowCellValues = [
      'guest_id',
      'v1%3A169761712418716012',
      'personalization_id',
      'v1_HJmmucUuUZDLmLGgaw/32w==',
    ];

    rowCellValues.forEach((textValue) => {
      expect(screen.getByText(textValue)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('body-row').length).toBe(2);
    expect(screen.getByTestId('empty-row')).toBeInTheDocument();

    expect(screen.getAllByText('.twitter.com').length).toBe(2);
    expect(screen.getAllByText('/').length).toBe(2);
    expect(screen.getAllByText('Twitter').length).toBe(2);
    expect(screen.getAllByText('Marketing').length).toBe(2);
    expect(screen.getAllByText('Third Party').length).toBe(2);
    expect(screen.getAllByText('2024-11-21T08:18:44.337Z').length).toBe(2);
    expect(screen.getAllByText('✓').length).toBe(4);
  });

  it('should update focused row', () => {
    mockUseTable.mockReturnValue({
      rows: table.rows,
      columns: table.columns,
      onRowClick,
      onRowContextMenu: jest.fn(),
      getRowObjectKey,
      conditionalTableRowClassesHandler: jest.fn(),
      hasVerticalBar: () => false,
    });

    render(
      <TableBody
        isRowFocused={bodyRowProp.isRowFocused}
        setIsRowFocused={setIsRowFocused}
        selectedKey={bodyRowProp.selectedKey}
      />
    );

    expect(bodyRowProp.isRowFocused).toBe(false);
    expect(bodyRowProp.selectedRow).toBe(null);

    // Click the row.
    fireEvent.click(screen.getAllByTestId('body-row')[1]);

    expect(onRowClick).toHaveBeenCalled();
    expect(setIsRowFocused).toHaveBeenCalled();
  });
});
