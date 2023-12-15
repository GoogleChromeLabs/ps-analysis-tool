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
import mockResponse from '../../../test-data/cookieMockData';
import CookiesLanding from '..';

describe('CookiesLanding', () => {
  it('renders CookiesLanding with data', () => {
    const { getByTestId, getAllByTestId } = render(
      <CookiesLanding
        tabCookies={mockResponse.tabCookies}
        tabFrames={mockResponse.tabFrames}
        showBlockedCookiesSection
        showHorizontalMatrix
      />
    );

    expect(getByTestId('cookies-landing')).toBeInTheDocument();
    expect(getAllByTestId('cookies-landing-header')[0]).toBeInTheDocument();
    expect(
      getByTestId('cookies-matrix-Cookie Classification')
    ).toBeInTheDocument();
  });
});
