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
 * Internal Dependencies
 */
import EmptyCirclePieChart from '../emptyCirclePieChart';

describe('EmptyCirclePieChart', () => {
  it('renders the fallback text correctly when provided', () => {
    const fallbackText = 'No data';

    const { getByText } = render(
      <EmptyCirclePieChart fallbackText={fallbackText} />
    );

    // Check if the fallback text is rendered correctly when provided
    const fallbackTextElement = getByText(fallbackText);
    expect(fallbackTextElement).toBeInTheDocument();
  });

  it('renders the default fallback text correctly when not provided', () => {
    const defaultFallbackText = 'Not Found';

    const { getByText } = render(<EmptyCirclePieChart />);

    // Check if the default fallback text is rendered correctly when not provided
    const defaultFallbackTextElement = getByText(defaultFallbackText);
    expect(defaultFallbackTextElement).toBeInTheDocument();
  });
});
