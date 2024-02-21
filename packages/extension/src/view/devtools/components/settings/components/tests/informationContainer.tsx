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
import { act } from 'react-dom/test-utils';

/**
 * Internal dependencies.
 */
import InformationContainer from '../informationContainer';
import { useSettings } from '../../../../stateProviders';

jest.mock('../../../../stateProviders', () => ({
  useSettings: jest.fn(),
}));

const mockUseSettingsStore = useSettings as jest.Mock;

describe('InformationContainer', () => {
  it('Should show cookie table if frame is selected', () => {
    mockUseSettingsStore.mockReturnValue({
      currentTabs: 2,
      currentExtensions: [
        {
          extensionName: 'Privacy Sandbox Analysis Tool',
          extensionId: '1',
        },
      ],
      browserInformation: '120.0.0.20',
      OSInformation: 'MacOS (arm64)',
    });

    act(() => {
      render(<InformationContainer />);
    });

    expect(
      screen.getByText('Privacy Sandbox Analysis Tool: 1')
    ).toBeInTheDocument();
    expect(screen.getByText('MacOS (arm64)')).toBeInTheDocument();
    expect(screen.getByText('120.0.0.20')).toBeInTheDocument();
  });

  it('Should copy contents of the information container.', async () => {
    document.execCommand = jest.fn();
    mockUseSettingsStore.mockReturnValue({
      currentTabs: 2,
      currentExtensions: [
        {
          extensionName: 'Privacy Sandbox Analysis Tool',
          extensionId: '1',
        },
      ],
      browserInformation: '120.0.0.20',
      OSInformation: 'MacOS (arm64)',
    });

    act(() => {
      render(<InformationContainer />);
    });

    const copyButton = await screen.findByTestId('copy-button');
    act(() => {
      copyButton.click();
    });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
