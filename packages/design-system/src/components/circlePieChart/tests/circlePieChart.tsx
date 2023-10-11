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
  const testData = [
    { count: 50, color: 'red' },
    { count: 73, color: 'blue' },
  ];

  it('renders CirclePieChart with correct centerCount when centerCount is less than or equal to MAX_COUNT', () => {
    const centerCount = 123;
    const title = '1st Party cookies';

    const { getByText, container } = render(
      <CirclePieChart centerCount={centerCount} data={testData} title={title} />
    );

    // Check if the CirclePieChart is rendered with the correct centerCount
    const centerCountText = getByText(centerCount.toString());
    expect(centerCountText).toBeInTheDocument();

    // Check if the VictoryPie is rendered with the correct data points
    const slices = container.querySelectorAll('path[role="presentation"]');
    expect(slices.length).toBe(testData.length);
  });

  it('renders CirclePieChart with MAX_COUNT+ when centerCount exceeds MAX_COUNT', () => {
    const centerCount = MAX_COUNT + 100; // Exceeds MAX_COUNT (999)
    const title = '3rd party cookies';

    const { getByText } = render(
      <CirclePieChart centerCount={centerCount} data={testData} title={title} />
    );

    // Check if the CirclePieChart displays MAX_COUNT+ when centerCount exceeds MAX_COUNT
    const maxCountText = `${MAX_COUNT}+`;
    const centerCountText = getByText(maxCountText);
    expect(centerCountText).toBeInTheDocument();
  });

  it('renders CirclePieChart with the provided title', () => {
    const centerCount = 80;
    const title = 'Total cookies';

    const { getByText } = render(
      <CirclePieChart centerCount={centerCount} data={testData} title={title} />
    );

    // Check if the CirclePieChart renders the provided title
    const chartTitle = getByText(title);
    expect(chartTitle).toBeInTheDocument();
  });

  it('renders CirclePieChart with default primary container width class', () => {
    const centerCount = 50;

    const { container } = render(
      <CirclePieChart centerCount={centerCount} data={testData} />
    );

    // Check if the CirclePieChart renders with the default primary container width class
    const primaryContainer = container.querySelector('.w-16');
    expect(primaryContainer).toBeInTheDocument();
  });
});
