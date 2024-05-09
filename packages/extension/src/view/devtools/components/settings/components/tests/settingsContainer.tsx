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
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import SettingsContainer from '../settingsContainer';
import { useSettings } from '../../../../stateProviders';
import { noop } from '@ps-analysis-tool/common';

jest.mock('../../../../stateProviders', () => ({
  useSettings: jest.fn(),
}));

const mockUseSettingsStore = useSettings as jest.Mock;

describe('SettingsContainer', () => {
  it('Should enable multitab debugging', async () => {
    mockUseSettingsStore.mockReturnValueOnce({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
      setIsUsingCDP: noop,
      setProcessingMode: noop,
    });

    act(() => {
      render(<SettingsContainer />);
    });

    const toggleButtonInput = await screen.findAllByTestId(
      'toggle-button-input'
    );

    expect((await screen.findAllByTestId('toggle-button'))[1]).toHaveClass(
      'bg-quartz'
    );

    toggleButtonInput[1].click();

    mockUseSettingsStore.mockReturnValueOnce({
      allowedNumberOfTabs: 'unlimited',
      isUsingCDP: false,
      setIsUsingCDP: noop,
      setProcessingMode: noop,
    });

    act(() => {
      render(<SettingsContainer />);
    });

    expect((await screen.findAllByTestId('toggle-button'))[3]).toHaveClass(
      'bg-toggle-on'
    );
  });

  it('Should enable CDP', async () => {
    mockUseSettingsStore.mockReturnValueOnce({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
      setIsUsingCDP: noop,
      setProcessingMode: noop,
    });

    act(() => {
      render(<SettingsContainer />);
    });

    const toggleButtonInput = await screen.findAllByTestId(
      'toggle-button-input'
    );

    expect((await screen.findAllByTestId('toggle-button'))[0]).toHaveClass(
      'bg-quartz'
    );

    toggleButtonInput[0].click();

    mockUseSettingsStore.mockReturnValueOnce({
      allowedNumberOfTabs: 'single',
      isUsingCDP: true,
      setIsUsingCDP: noop,
      setProcessingMode: noop,
    });

    act(() => {
      render(<SettingsContainer />);
    });

    expect((await screen.findAllByTestId('toggle-button'))[2]).toHaveClass(
      'bg-toggle-on'
    );
  });
});
