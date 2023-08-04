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

  it('renders EmptyCirclePieChart when centerCount is 0', () => {
    const centerCount = 0;
    const title = 'Empty Chart';
    const fallbackText = 'No Data';

    const { getByText } = render(
      <CirclePieChart
        centerCount={centerCount}
        data={testData}
        title={title}
        fallbackText={fallbackText}
      />
    );

    // Check if the EmptyCirclePieChart is rendered when centerCount is 0
    const emptyChartTitle = getByText(title);
    expect(emptyChartTitle).toBeInTheDocument();
    const fallbackTextElement = getByText(fallbackText);
    expect(fallbackTextElement).toBeInTheDocument();
  });

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

  it('renders CirclePieChart with custom container width class when isPrimary is false', () => {
    const centerCount = 60;

    const { container } = render(
      <CirclePieChart
        centerCount={centerCount}
        data={testData}
        isPrimary={false}
      />
    );

    // Check if the CirclePieChart renders with the custom container width class for non-primary charts
    const secondaryContainer = container.querySelector('.w-8');
    expect(secondaryContainer).toBeInTheDocument();
  });

  it('renders CirclePieChart with the correct font size class for primary and non-primary charts', () => {
    const primaryCenterCount = 100;
    const secondaryCenterCount = MAX_COUNT + 1; // Exceeds MAX_COUNT (999)

    const { getByText, rerender } = render(
      <CirclePieChart centerCount={primaryCenterCount} data={testData} />
    );

    // Check if the CirclePieChart renders with the correct font size class for primary charts
    const primaryFontSizeClass = getByText(primaryCenterCount.toString());
    expect(primaryFontSizeClass).toHaveClass('text-2xl');

    // Rerender with non-primary centerCount
    rerender(
      <CirclePieChart
        centerCount={secondaryCenterCount}
        data={testData}
        isPrimary={false}
      />
    );

    // Check if the CirclePieChart renders with the correct font size class for non-primary charts
    const nonPrimaryFontSizeClass = getByText(MAX_COUNT + '+');
    expect(nonPrimaryFontSizeClass).toHaveClass('text-xxxs');
  });
});
