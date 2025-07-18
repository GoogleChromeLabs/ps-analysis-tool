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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies
 */
import Chips from '../chips';
import RelatedWebsiteSets from '../relatedWebsiteSets';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import { useSidebar } from '@google-psat/design-system';
import StorageAccess from '../storageAccess';
import FederatedCredential from '../federatedCredential';
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

    mockUseSidebar.mockReturnValue({ extractSelectedItemKeyTitles: () => [] });
  });

  it('should render RelatedWebsiteSets', async () => {
    act(() => {
      render(<RelatedWebsiteSets />);
    });

    expect(
      await screen.findByTestId('related-website-sets-content')
    ).toBeInTheDocument();
  });

  it('should render Chips', async () => {
    act(() => {
      render(<Chips />);
    });

    expect(await screen.findByTestId('chips-content')).toBeInTheDocument();
  });

  it('should render StorageAccess', async () => {
    act(() => {
      render(<StorageAccess />);
    });

    expect(
      await screen.findByTestId('storage-access-content')
    ).toBeInTheDocument();
  });

  it('should render FederatedCredential', async () => {
    act(() => {
      render(<FederatedCredential />);
    });

    expect(
      await screen.findByTestId('federated-credential-content')
    ).toBeInTheDocument();
  });
});
