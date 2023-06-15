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
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import { TabSelctor } from '../tabSelector';
import { TABS } from '../tabs';

describe("loads tabs of Extension's devtools", () => {
  /**
   * Test to check if the Cookie Panel is loaded by default.
   */
  test('loads Cookie Panel by default', () => {
    render(<TabSelctor tabs={TABS} />);
    // by default Cookies Panel is selected.
    expect(screen.getByText('Cookies Panel')).toBeInTheDocument();
  });

  /**
   * Test to check if the Cookie Panel is loaded when the tab is clicked.
   */
  test('loads Cookie Panel', async () => {
    render(<TabSelctor tabs={TABS} />);
    // Move to another tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    fireEvent.click(screen.getByText('Cookies'));
    expect(await screen.findByText('Cookies Panel')).toBeInTheDocument();
  });

  /**
   * Test to check if the Bounce Tracking Panel is loaded when the tab is clicked.
   */
  test('loads Bounce Tracking Panel', async () => {
    render(<TabSelctor tabs={TABS} />);
    // Click on Bounce Tracking tab
    fireEvent.click(screen.getByText('Bounce Tracking'));
    expect(
      await screen.findByText('Bounce tracking Panel')
    ).toBeInTheDocument();
  });

  /**
   * Test to check if the FingerPrinting Panel is loaded when the tab is clicked.
   */
  test('loads FingerPrinting Panel', async () => {
    render(<TabSelctor tabs={TABS} />);
    // Click on FingerPrinting tab
    fireEvent.click(screen.getByText('Fingerprinting'));
    expect(await screen.findByText('Fingerprinting Panel')).toBeInTheDocument();
  });
});
