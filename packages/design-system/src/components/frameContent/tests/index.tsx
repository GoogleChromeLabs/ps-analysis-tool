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
 * External dependencies.
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies.
 */
import FrameContent from '..';

describe('FrameContent', () => {
  it('renders correctly', () => {
    render(<FrameContent>Test Content</FrameContent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with different color variants', () => {
    const { rerender } = render(
      <FrameContent color="privacy-green">Test Content</FrameContent>
    );
    expect(
      screen
        .getByText('Test Content')
        .parentElement?.parentElement?.querySelector('.border-privacy-green')
    ).toBeInTheDocument();

    rerender(<FrameContent color="privacy-purple">Test Content</FrameContent>);
    expect(
      screen
        .getByText('Test Content')
        .parentElement?.parentElement?.querySelector('.border-privacy-purple')
    ).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const testContent = <div data-testid="test-child">Child Content</div>;
    render(<FrameContent>{testContent}</FrameContent>);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
