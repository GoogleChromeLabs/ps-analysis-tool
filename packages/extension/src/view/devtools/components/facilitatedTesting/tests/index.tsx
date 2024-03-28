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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies
 */
import FacilitatedTesting from '..';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import { act } from 'react-dom/test-utils';

describe('FacilitatedTesting Landing Pages', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('should render FacilitatedTesting', async () => {
    act(() => {
      render(<FacilitatedTesting />);
    });
    expect(
      await screen.findByTestId('facilitated-testing-content')
    ).toBeInTheDocument();
  });
});
