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
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import App from '../app';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'cookie-analysis-tool/data/PSInfo.json';

describe('App', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
      });
    } as unknown as typeof fetch;
  });

  it('Should show cookies content by default', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Cookies'));
    expect(screen.getByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to cookie panel when tab is clicked', async () => {
    render(<App />);
    // Move to another tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    fireEvent.click(screen.getByText('Cookies'));
    expect(await screen.findByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to Bounce Tracking Panel when clicked', async () => {
    render(<App />);
    // Click on Bounce Tracking tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    expect(
      await screen.findByTestId('bounce-tracking-content')
    ).toBeInTheDocument();
  });

  it('should switch to FingerPrinting Panel when clicked', async () => {
    render(<App />);
    // Click on FingerPrinting tab
    fireEvent.click(screen.getByText('Fingerprinting'));

    expect(
      await screen.findByTestId('fingerprinting-content')
    ).toBeInTheDocument();
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
