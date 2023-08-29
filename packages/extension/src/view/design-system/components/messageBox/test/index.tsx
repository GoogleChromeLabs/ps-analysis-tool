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
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies.
 */
import MessageBox from '..';

describe('MessageBox', () => {
  it('renders the headerText and bodyText', () => {
    render(
      <MessageBox
        headerText={'No cookies found on this page'}
        bodyText="Please try refreshing this page"
      />
    );
    expect(
      screen.getByText('No cookies found on this page')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please try refreshing this page')
    ).toBeInTheDocument();
  });
});
