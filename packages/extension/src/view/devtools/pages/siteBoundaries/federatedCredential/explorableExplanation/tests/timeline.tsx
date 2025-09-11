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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import { Timeline } from '../components';
import { ScenarioKeys } from '../store/scenariosTypes';

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
});
