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
import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuBar from '..';

describe('MenuBar', () => {
  const menuData = [
    {
      name: 'Home',
      link: 'home',
    },
    {
      name: 'About',
      link: 'about',
    },
    {
      name: 'Contact',
      link: 'contact',
    },
  ];

  const scrollContainerId = 'scrollContainer';

  it('should render the menu bar', () => {
    const { container } = render(
      <MenuBar menuData={menuData} scrollContainerId={scrollContainerId} />
    );

    expect(container).toBeInTheDocument();

    menuData.forEach(({ name }) => {
      expect(container).toHaveTextContent(name);
    });
  });

  it('should call scrollIntoView when selectedItem changes', async () => {
    const { rerender } = render(
      <MenuBar menuData={menuData} scrollContainerId={scrollContainerId} />
    );

    const scrollIntoView = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    rerender(
      <MenuBar menuData={menuData} scrollContainerId={scrollContainerId} />
    );

    act(() => {
      fireEvent.click(screen.getByText(menuData[1].name));
    });

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalled();
    });
  });
});
