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
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies.
 */
import CookiesMatrix from '..';
import mockResponse from '../../../../test-data/cookieMockData';
import cookiesStatsComponents from '../../../../test-data/cookiesStatsComponents';

describe('CookiesMatrix', () => {
  it('should render the cookies insights', async () => {
    const tabCookies = mockResponse.tabCookies;
    const tabFrames = mockResponse.tabFrames;
    const title = 'Title';

    const { getByTestId, findByText, findAllByText } = render(
      <CookiesMatrix
        title={title}
        tabCookies={tabCookies}
        componentData={cookiesStatsComponents.legend}
        tabFrames={tabFrames}
      />
    );

    expect(getByTestId(`cookies-matrix-${title}`)).toBeInTheDocument();

    const expandButton = await screen.findByTestId('expand-button');

    expect(expandButton).toBeInTheDocument();

    expandButton.click();

    expect(await findByText('Functional')).toBeInTheDocument();
    expect((await findAllByText('1'))[0]).toHaveClass(
      cookiesStatsComponents.legend[0].countClassName
    );
  });
});
