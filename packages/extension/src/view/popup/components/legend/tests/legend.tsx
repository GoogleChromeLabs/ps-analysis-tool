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
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies.
 */
import Legend from '..';

describe('Legend', () => {
  const testData = [
    {
      label: 'Functional',
      count: 10,
      color: 'red',
      textColorClass: 'text-fuctional',
    },
    {
      label: 'Marketing',
      count: 20,
      color: 'blue',
      textColorClass: 'text-marketing',
    },
  ];

  it('renders the correct label and count for each legend item', () => {
    const { getAllByText } = render(<Legend legendItemList={testData} />);

    // Check if the correct label and count elements are rendered for each legend item
    testData.forEach(({ label, count }) => {
      const labelElement = getAllByText(label);
      expect(labelElement.length).toBe(1); // Ensure there's only one element with the label text

      const countElement = getAllByText(count.toString());
      expect(countElement.length).toBe(1); // Ensure there's only one element with the count text
    });
  });
});
