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
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
import { useSidebar } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import Attribution from '../attributionReporting';
import Topics from '../topics';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import PrivateAdvertising from '../privateAdvertising';
import { I18n } from '@google-psat/i18n';

jest.mock(
  '../../../../../../../design-system/src/components/sidebar/useSidebar',
  () => ({
    useSidebar: jest.fn(),
  })
);
const mockUseSidebar = useSidebar as jest.Mock;

describe('Private advertising Landing Pages', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.chrome.storage.session = {
      get: () =>
        Promise.resolve({
          activeTab: undefined,
        }),
      set: () => Promise.resolve(),
    };
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;

    globalThis.chrome.i18n = null;

    I18n.initMessages({
      privateAdvertising: {
        message: 'Private Advertising',
      },
    });

    mockUseSidebar.mockReturnValue({ extractSelectedItemKeyTitles: () => [] });
  });

  it('should render Attribution', async () => {
    act(() => {
      render(<Attribution />);
    });

    expect(
      await screen.findByTestId('attribution-reporting-content')
    ).toBeInTheDocument();
  });

  it('should render Private advertising', async () => {
    act(() => {
      render(<PrivateAdvertising />);
    });

    expect(
      await screen.findByText(I18n.getMessage('privateAdvertising'))
    ).toBeInTheDocument();
  });

  it('should render Topics', async () => {
    act(() => {
      render(<Topics />);
    });

    expect(await screen.findByTestId('topics-content')).toBeInTheDocument();
  });
});
