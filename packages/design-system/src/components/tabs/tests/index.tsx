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

/**
 * Internal dependencies
 */
import Tabs from '..';

describe('Tabs', () => {
  const props = {
    items: [
      {
        title: 'title1',
        content: {
          Element: () => <div>content1</div>,
        },
      },
      {
        title: 'title2',
        content: {
          Element: () => <div>content2</div>,
        },
      },
    ],
  };

  it('should render', () => {
    render(<Tabs {...props} />);

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('title1')).toHaveClass('border-b-2');

    fireEvent.click(screen.getByText('title2'));

    expect(screen.getByText('content2')).toBeInTheDocument();
    expect(screen.getByText('title2')).toHaveClass('border-b-2');

    fireEvent.keyDown(screen.getByText('title2'), { key: 'Tab' });

    expect(screen.getByText('content1')).toBeInTheDocument();
    expect(screen.getByText('title1')).toHaveClass('border-b-2');

    fireEvent.keyDown(screen.getByText('title1'), {
      key: 'Tab',
      shiftKey: true,
    });

    expect(screen.getByText('content2')).toBeInTheDocument();
    expect(screen.getByText('title2')).toHaveClass('border-b-2');
  });
});
