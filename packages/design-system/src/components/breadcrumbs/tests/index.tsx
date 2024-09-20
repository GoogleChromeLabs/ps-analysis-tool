/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Breadcrumbs from '..';
import { useSidebar } from '../../sidebar';

jest.mock('../../sidebar/useSidebar', () => ({
  useSidebar: jest.fn(),
}));
const mockUseSidebar = useSidebar as jest.Mock;

describe('Breadcrumbs', () => {
  it('should render the breadcrumbs', () => {
    const items = [
      { title: 'Home', key: 'home' },
      { title: 'About', key: 'about' },
      { title: 'Contact', key: 'contact' },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should call updateSelectedItemKey when clicking on a breadcrumb', () => {
    const items = [
      { title: 'Home', key: 'home' },
      { title: 'About', key: 'about' },
      { title: 'Contact', key: 'contact' },
    ];

    const updateSelectedItemKey = jest.fn();

    mockUseSidebar.mockReturnValue(updateSelectedItemKey);

    render(<Breadcrumbs items={items} />);

    fireEvent.click(screen.getByText('About'));

    expect(updateSelectedItemKey).toHaveBeenCalledWith('about');
  });
});
