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
 * External dependencies.
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import LinkProcessor from '..';
import { useSidebar } from '../../sidebar';

jest.mock('./../../sidebar/useSidebar', () => ({
  useSidebar: jest.fn(),
}));
const mockUseSidebar = useSidebar as jest.Mock;
const updateSelectedItemKey = jest.fn();

describe('LinkProcessor', () => {
  beforeEach(() => {
    mockUseSidebar.mockReturnValue(updateSelectedItemKey);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the text passed in as a prop', () => {
    const text = 'Test <a>anchor</a> text. Another <a>anchor 2</a> text.';
    render(
      <LinkProcessor text={text} to={['test', 'test2']} queries={['q1']} />
    );

    const anchor = screen.getByText('anchor');
    expect(anchor).toBeInTheDocument();

    fireEvent.click(anchor);
    expect(updateSelectedItemKey).toHaveBeenCalledWith('test', 'q1');

    const textElement = screen.getByText('Test');
    expect(textElement).toBeInTheDocument();

    const anchor2 = screen.getByText('anchor 2');
    expect(anchor2).toBeInTheDocument();

    fireEvent.click(anchor2);
    expect(updateSelectedItemKey).toHaveBeenCalledWith('test2', '');

    const lastTextElement = screen.getByText('text.');
    expect(lastTextElement).toBeInTheDocument();
  });
});
