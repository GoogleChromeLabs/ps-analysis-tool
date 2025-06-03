/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
/**
 * Internal dependencies
 */
import SingleErrorRow from '../singleErrorRow';

describe('SingleErrorRow Component', () => {
  it('renders an error row correctly', () => {
    render(
      <SingleErrorRow
        type="ERROR"
        message="This is an error message."
        time="2025-05-22T10:00:00Z"
      />
    );

    expect(screen.getByText('This is an error message.')).toBeTruthy();
    expect(screen.getByText('2025-05-22T10:00:00Z:')).toBeTruthy();
  });

  it('renders a warning row correctly', () => {
    render(
      <SingleErrorRow
        type="WARNING"
        message="This is a warning message."
        time="2025-05-22T11:00:00Z"
      />
    );

    expect(screen.getByText('This is a warning message.')).toBeTruthy();
    expect(screen.getByText('2025-05-22T11:00:00Z:')).toBeTruthy();
  });

  it('applies additional classes correctly', () => {
    render(
      <SingleErrorRow
        type="INFO"
        message="This is an info message."
        time="2025-05-22T12:00:00Z"
        additionalClasses="custom-class"
      />
    );

    const row = screen.getByText('This is an info message.').parentElement;
    expect(row).toHaveClass('custom-class');
  });
});
