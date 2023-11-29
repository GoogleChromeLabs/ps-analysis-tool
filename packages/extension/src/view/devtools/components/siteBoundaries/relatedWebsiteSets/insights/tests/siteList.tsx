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
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import SitesList from '../sitesList';

describe('RelatedWebsiteSets SitesList', () => {
  test('should render insights site lists', () => {
    const title = 'Associated Sites';
    const sites = [
      'https://example-one.com',
      'https://example-two.com',
      'https://example-three.com',
    ];

    render(<SitesList title={title} sites={sites} />);

    const sitesListTitle = screen.getByText('Associated Sites');
    expect(sitesListTitle).toHaveClass(
      'text-base font-medium text-davys-grey dark:text-anti-flash-white mb-1'
    );

    const sitesListUlElement = screen.getByRole('list');
    expect(sitesListUlElement).toHaveClass('list-disc ml-4 max-h-40');

    sites.forEach((site) => {
      const siteElement = screen.getByText(site);
      expect(siteElement).toBeInTheDocument();
    });
  });

  test('should not render anything', () => {
    const title = 'Associated Sites';
    const sites: string[] = [];

    render(<SitesList title={title} sites={sites} />);

    const sitesListTitle = screen.queryByText('Associated Sites');
    expect(sitesListTitle).not.toBeInTheDocument();
  });
});
