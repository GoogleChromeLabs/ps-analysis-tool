/*
 * Copyright 2025 Google LLC
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
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
/**
 * Internal dependencies.
 */
import ExplorableExplanation from '..';

global.chrome = {
  storage: {
    session: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  devtools: {
    inspectedWindow: {
      tabId: 123,
    },
  },
} as unknown as typeof chrome;

describe('Index file', () => {
  it('should render ExplorableExplanation component', () => {
    render(<ExplorableExplanation />);

    const playPauseButton = screen.getByTestId('play-pause-button');
    expect(playPauseButton).toBeInTheDocument();
    expect(playPauseButton).toHaveAccessibleDescription('Play');

    fireEvent.click(playPauseButton!);
    expect(playPauseButton).toHaveAccessibleDescription('Pause');

    const permissionsNode = screen.getByText('5. Permissions');
    expect(permissionsNode).toBeInTheDocument();

    fireEvent.click(permissionsNode);

    expect(playPauseButton).toHaveAccessibleDescription('Pause');
    fireEvent.click(playPauseButton!);

    expect(
      screen.getByText('Enable Personalized Recommendations')
    ).toBeInTheDocument();
    expect(permissionsNode).toHaveClass('active');
    expect(screen.getByText('1. Registration')).toHaveClass('completed');

    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton!);

    expect(screen.getByText('1. Registration')).toHaveClass('active');
    expect(playPauseButton).toHaveAccessibleDescription('Play');
  });
});
