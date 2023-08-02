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
import CirclePieChart from '..';

describe('CirclePieChart', () => {
  const testData = [
    { count: 25, color: 'red' },
    { count: 50, color: 'blue' },
    { count: 75, color: 'green' },
  ];
  const centerCount = 150;

  it('renders the VictoryPie chart with the correct data', () => {
    const { container } = render(
      <CirclePieChart centerCount={centerCount} data={testData} />
    );

    // Check if the VictoryPie is rendered with the correct data
    const paths = container.querySelectorAll('path[role="presentation"]');
    expect(paths.length).toBe(testData.length);
  });

  it('renders the centerCount text', () => {
    const { getByText } = render(
      <CirclePieChart centerCount={centerCount} data={testData} />
    );

    // Check if the centerCount text is rendered
    const text: string = centerCount.toString();
    const centerCountElement = getByText(text);
    expect(centerCountElement).toBeInTheDocument();
  });
});
