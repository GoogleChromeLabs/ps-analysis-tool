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
import LandingHeader from '..';
import cookieStats from '../../../../test-data/cookieStats';
import cookiesStatsComponents from '../../../../test-data/cookiesStatsComponents';

describe('LandingHeader', () => {
  it('should render the landing header', () => {
    const dataMapping = [
      {
        title: 'Total Cookies',
        count: cookieStats.total,
        data: [...cookiesStatsComponents.legend],
      },
      {
        title: 'First Party Cookies',
        count: cookieStats.firstParty.total,
        data: [...cookiesStatsComponents.firstParty],
      },
      {
        title: 'Third Party Cookies',
        count: cookieStats.thirdParty.total,
        data: [...cookiesStatsComponents.thirdParty],
      },
    ];
    render(<LandingHeader dataMapping={dataMapping} />);

    expect(screen.getByTestId('cookies-landing-header')).toBeInTheDocument();
    expect(screen.getByText('Total Cookies')).toBeInTheDocument();
    expect(screen.getByText('999+')).toBeInTheDocument();
  });
});
