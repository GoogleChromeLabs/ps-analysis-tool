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
import Matrix from '..';
import { type MatrixComponentProps } from '../matrixComponent';

describe('Matrix', () => {
  it('renders null when dataComponents is empty', () => {
    const { container } = render(<Matrix dataComponents={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders MatrixComponent for each dataComponent', async () => {
    const mockDataComponents: MatrixComponentProps[] = [
      {
        color: 'red',
        title: 'Test title',
        count: 10,
        countClassName: 'some-class',
        containerClasses: '',
        description: 'Test description',
      },
      {
        color: 'blue',
        title: 'Test title1',
        count: 10,
        countClassName: 'some-class-2',
        containerClasses: '',
      },
    ];

    const { rerender } = render(
      <Matrix dataComponents={mockDataComponents} expand={false} />
    );

    const matrixContainer = screen.getByTestId('matrix');

    expect(matrixContainer).toBeInTheDocument();

    expect(await screen.findByText('Test title')).toBeInTheDocument();

    rerender(<Matrix dataComponents={mockDataComponents} expand={true} />);

    expect(await screen.findByText('Test description')).toBeInTheDocument();
  });
});
