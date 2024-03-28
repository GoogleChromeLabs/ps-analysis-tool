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
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../sidebar';
import { useSidebar } from '../useSidebar';

jest.mock('../useSidebar', () => ({
  useSidebar: jest.fn(),
}));
const mockUseSidebar = useSidebar as jest.Mock;
const initialState = {
  sidebarItems: {
    item1: {
      title: 'item1',
      children: {
        item2: {
          title: 'item2',
          children: {},
        },
      },
    },
  },
  setIsSidebarFocused: jest.fn(),
  selectedItemKey: '',
  isSidebarFocused: false,
  setISidebarFocused: jest.fn(),
  updateSelectedItemKey: jest.fn(),
  toggleDropdown: jest.fn(),
  isKeyAncestor: jest.fn(),
  isKeySelected: jest.fn(),
  onKeyNavigation: jest.fn(),
};

describe('Sidebar', () => {
  beforeEach(() => {
    mockUseSidebar.mockReturnValue(initialState);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    // Arrange
    const props = {
      visibleWidth: 200,
    };

    // Act
    render(<Sidebar {...props} />);

    // Assert
    const sidebar = await screen.findByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('should call setIsSidebarFocused when clicking outside the sidebar', async () => {
    // Arrange
    const props = {
      visibleWidth: 200,
    };

    // Act
    render(<Sidebar {...props} />);

    // Assert
    expect(initialState.setIsSidebarFocused).not.toHaveBeenCalled();

    // Act
    document.dispatchEvent(new MouseEvent('click'));

    // Assert
    expect(initialState.setIsSidebarFocused).toHaveBeenCalled();
    expect(initialState.setIsSidebarFocused).toHaveBeenCalledWith(false);

    const sidebar = await screen.findByTestId('sidebar-child');
    expect(sidebar).toBeInTheDocument();

    // Act
    fireEvent.click(sidebar);

    // Assert
    expect(initialState.setIsSidebarFocused).toHaveBeenCalledWith(true);
  });

  it('should handle callbacks', async () => {
    // Arrange
    const props = {
      visibleWidth: 200,
    };

    // Act
    render(<Sidebar {...props} />);

    // Assert
    expect(initialState.updateSelectedItemKey).not.toHaveBeenCalled();

    const sidebar = await screen.findByTestId('sidebar-child');
    expect(sidebar).toBeInTheDocument();

    // Act
    fireEvent.click(sidebar);

    // Assert
    expect(initialState.updateSelectedItemKey).toHaveBeenCalled();
    expect(initialState.updateSelectedItemKey).toHaveBeenCalledWith('item1');

    // Act
    const dropdown = await screen.findByTestId('sidebar-child-dropdown');
    fireEvent.click(dropdown);

    // Assert
    expect(initialState.toggleDropdown).toHaveBeenCalled();
    expect(initialState.toggleDropdown).toHaveBeenCalledWith(true, 'item1');

    // Act
    fireEvent.keyDown(sidebar, { key: 'ArrowDown' });

    // Assert
    expect(initialState.onKeyNavigation).toHaveBeenCalled();
    expect(initialState.onKeyNavigation).toHaveBeenCalledWith(
      expect.any(Object),
      'item1'
    );
  });
});
