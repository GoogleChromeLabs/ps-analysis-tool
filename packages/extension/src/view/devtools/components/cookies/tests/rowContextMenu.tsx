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
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import RowContextMenu from '../cookiesListing/rowContextMenu';
import type { TableRow } from '@ps-analysis-tool/design-system';
import SinonChrome from 'sinon-chrome';

const rowContextMenuProp = {
  domainsInAllowList: new Set<string>(),
  setDomainsInAllowListCallback: jest.fn(),
  isIncognito: false,
  tabUrl: 'https://www.bbc.com/',
};

globalThis.chrome = {
  ...(SinonChrome as unknown as typeof chrome),
  storage: {
    // @ts-ignore
    session: {
      // @ts-ignore
      get: () => ({}),
    },
  },
};

describe('RowContextMenu', () => {
  it('should render Row Context Menu component', async () => {
    const ref = React.createRef<{
      onRowContextMenu: (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        row: TableRow
      ) => void;
    }>();

    render(<RowContextMenu {...rowContextMenuProp} ref={ref} />);

    act(() => {
      ref.current?.onRowContextMenu(
        // @ts-ignore
        {
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
        } as React.MouseEvent<HTMLElement, MouseEvent>,
        // @ts-ignore
        {
          originalData: {
            // @ts-ignore
            parsedCookie: {
              name: 'AWSALB',
              domain: 'bbc.com',
            },
          },
        }
      );
    });

    const rowContextMenu = await screen.findByText('Add Domain to Allow List');

    expect(rowContextMenu).toBeVisible();
  });

  it('should render Remove Domain From Allow List option when domain is in allow list', async () => {
    const ref = React.createRef<{
      onRowContextMenu: (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        row: TableRow
      ) => void;
    }>();

    rowContextMenuProp.domainsInAllowList.add('bbc.com');

    render(<RowContextMenu {...rowContextMenuProp} ref={ref} />);

    act(() => {
      ref.current?.onRowContextMenu(
        // @ts-ignore
        {
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
        } as React.MouseEvent<HTMLElement, MouseEvent>,
        // @ts-ignore
        {
          originalData: {
            // @ts-ignore
            parsedCookie: {
              name: 'AWSALB',
              domain: 'bbc.com',
            },
          },
        }
      );
    });

    const rowContextMenu = await screen.findByText(
      'Remove Domain from Allow List'
    );

    expect(rowContextMenu).toBeVisible();
  });
});
