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
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import { Timeline } from '../components';
import { ScenarioKeys } from '../store/scenariosTypes';

const mockLoadScenarioForInteractiveMode = jest.fn();
jest.mock('../store', () => ({
  useStore: () => ({
    loadScenarioForInteractiveMode: mockLoadScenarioForInteractiveMode,
  }),
}));

describe('Timeline', () => {
  it('loads and displays the correct timeline scenarios', () => {
    render(<Timeline currentScenarioKey={ScenarioKeys.REGISTRATION} />);

    expect(screen.getByText('1. Registration')).toHaveClass('active');

    render(<Timeline currentScenarioKey={ScenarioKeys.SIGNIN} />);

    expect(screen.getAllByText('2. Sign In')[1]).toHaveClass('active');
    expect(screen.getAllByText('1. Registration')[1]).toHaveClass('completed');

    render(<Timeline currentScenarioKey={ScenarioKeys.SIGNOUT} />);
    expect(screen.getAllByText('6. Sign Out')[2]).toHaveClass('active');
    expect(screen.getAllByText('2. Sign In')[2]).toHaveClass('completed');
    expect(screen.getAllByText('1. Registration')[2]).toHaveClass('completed');
  });

  it('renders all timeline nodes', () => {
    render(<Timeline currentScenarioKey={ScenarioKeys.REGISTRATION} />);
    const nodes = [
      '1. Registration',
      '2. Sign In',
      '3. Silent ReAuth',
      '4. Interactive ReAuth',
      '5. Permissions',
      '6. Sign Out',
    ];
    nodes.forEach((node) => {
      expect(screen.getByText(node)).toBeInTheDocument();
    });
  });

  it('renders correct active and completed classes for each scenario', () => {
    const nodes = [
      '1. Registration',
      '2. Sign In',
      '3. Silent ReAuth',
      '4. Interactive ReAuth',
      '5. Permissions',
      '6. Sign Out',
    ];

    Object.values(ScenarioKeys).forEach((key, idx) => {
      render(<Timeline currentScenarioKey={key} />);
      const nodeText = nodes[idx];
      expect(screen.getAllByText(nodeText)[idx]).toHaveClass('active');

      for (let i = 0; i < idx; i++) {
        const completedText = nodes[i];
        expect(screen.getAllByText(completedText)[idx]).toHaveClass(
          'completed'
        );
      }
    });
  });

  it('renders correct number of connectors', () => {
    render(<Timeline currentScenarioKey={ScenarioKeys.REGISTRATION} />);
    // There should be 5 connectors for 6 nodes
    expect(screen.getAllByTestId('timeline-connector').length).toBe(5);
  });

  it('calls loadScenarioForInteractiveMode on node click', () => {
    render(<Timeline currentScenarioKey={ScenarioKeys.REGISTRATION} />);
    const node = screen.getByText('2. Sign In');
    fireEvent.click(node);

    expect(mockLoadScenarioForInteractiveMode).toHaveBeenCalled();
  });

  it('handles unknown scenario key gracefully', () => {
    render(<Timeline currentScenarioKey={'unknown' as ScenarioKeys} />);
    // No node should have active class
    const nodes = screen.getAllByText(/\d\. /);
    nodes.forEach((node) => {
      expect(node).not.toHaveClass('active');
    });
  });
});
