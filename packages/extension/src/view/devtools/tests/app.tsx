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

/**
 * Internal dependencies.
 */
import App from '../app';

describe('App', () => {
  it('Should show cookies content by default', () => {
    render(<App />);

    expect(screen.getByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to cookie panel when tab is clicked', async () => {
    render(<App />);
    // Move to another tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    fireEvent.click(screen.getByText('Cookies'));
    expect(await screen.getByTestId('cookies-content')).toBeInTheDocument();
  });

  it('should switch to Bounce Tracking Panel when clicked', async () => {
    render(<App />);
    // Click on Bounce Tracking tab
    fireEvent.click(screen.getByText('Bounce Tracking'));

    expect(
      await screen.getByTestId('bounce-tracking-content')
    ).toBeInTheDocument();
  });

  it('should switch to FingerPrinting Panel when clicked', async () => {
    render(<App />);
    // Click on FingerPrinting tab
    fireEvent.click(screen.getByText('Fingerprinting'));

    expect(
      await screen.getByTestId('fingerprinting-content')
    ).toBeInTheDocument();
  });
});
