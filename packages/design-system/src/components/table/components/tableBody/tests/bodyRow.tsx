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
import BodyRow from '../bodyRow';
import table from '../../../../../test-data/cookieTableMockData';

describe('BodyRow', () => {
  const emptySet = new Set<string>();

  const BodyRowProp = {
    row: table.rows[0],
    columns: table.columns,
    index: 0,
    selectedKey: 'AWSALB.bbc.com/',
    getRowObjectKey: jest.fn(() => {
      return 'AWSALB.bbc.com/';
    }),
    isRowFocused: false,
    onRowClick: jest.fn(() => {
      BodyRowProp.isRowFocused = true;
    }),
    onKeyDown: () => '',
    domainsInAllowList: emptySet,
    setDomainsInAllowList: jest.fn((domains: Set<string>) => {
      BodyRowProp.domainsInAllowList = domains;
    }),
  };

  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
  });

  it('should render Body Row component', () => {
    render(
      <BodyRow
        index={0}
        // @ts-ignore
        row={BodyRowProp.row}
        columns={BodyRowProp.columns}
        selectedKey={BodyRowProp.selectedKey}
        getRowObjectKey={BodyRowProp.getRowObjectKey}
        getExtraClasses={() => ''}
        isRowFocused={BodyRowProp.isRowFocused}
        onRowClick={BodyRowProp.onRowClick}
        onKeyDown={BodyRowProp.onKeyDown}
      />
    );

    const rowCellValues = [
      'guest_id',
      'v1%3A169761712418716012',
      '.twitter.com',
      '/',
      '2024-11-21T08:18:44.337Z',
      'Marketing',
      'Twitter',
      'Third Party',
    ];

    rowCellValues.forEach((textValue) => {
      expect(screen.getByText(textValue)).toBeInTheDocument();
    });

    expect(screen.getByTestId('body-row')).toBeInTheDocument();
    expect(screen.getAllByText('✓').length).toBe(2);
  });

  it('should update focused row', () => {
    render(
      <BodyRow
        index={0}
        // @ts-ignore
        row={BodyRowProp.row}
        columns={BodyRowProp.columns}
        selectedKey={BodyRowProp.selectedKey}
        getRowObjectKey={BodyRowProp.getRowObjectKey}
        getExtraClasses={() => ''}
        isRowFocused={BodyRowProp.isRowFocused}
        onRowClick={BodyRowProp.onRowClick}
        onKeyDown={BodyRowProp.onKeyDown}
      />
    );

    expect(BodyRowProp.isRowFocused).toBe(false);

    // Click the row.
    fireEvent.click(screen.getByTestId('body-row'));

    expect(BodyRowProp.onRowClick).toHaveBeenCalled();
    expect(BodyRowProp.isRowFocused).toBe(true);
  });
});
