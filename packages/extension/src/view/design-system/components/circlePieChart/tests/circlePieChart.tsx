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
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies.
 */
import CirclePieChart, { MAX_COUNT } from '..';

describe('CirclePieChart', () => {
  it('renders the centerCount correctly with a valid number', () => {
    const centerCount = 123;
    const data = [
      { count: 50, color: 'red' },
      { count: 73, color: 'blue' },
    ];

    const { getByText } = render(
      <CirclePieChart centerCount={centerCount} data={data} />
    );

    // Check if the centerCount is rendered correctly
    const centerCountElement = getByText(centerCount.toString());
    expect(centerCountElement).toBeInTheDocument();
  });

  it('renders the centerCount correctly when it exceeds MAX_COUNT', () => {
    const centerCount = MAX_COUNT + 1; // Exceeds MAX_COUNT (999)
    const data = [
      { count: 50, color: 'red' },
      { count: 73, color: 'blue' },
    ];

    const { getByText } = render(
      <CirclePieChart centerCount={centerCount} data={data} />
    );

    // Check if the centerCount displays MAX_COUNT + '+' when it exceeds MAX_COUNT
    const maxCountText = MAX_COUNT + '+';
    const centerCountElement = getByText(maxCountText);
    expect(centerCountElement).toBeInTheDocument();
  });

  it('renders the correct number of slices on the VictoryPie chart', () => {
    const centerCount = 123;
    const data = [
      { count: 50, color: 'red' },
      { count: 73, color: 'blue' },
    ];

    const { container } = render(
      <CirclePieChart centerCount={centerCount} data={data} />
    );

    // Check if the VictoryPie is rendered with the correct number of data points
    const slices = container.querySelectorAll('path[role="presentation"]');
    expect(slices.length).toBe(data.length);
  });
});
