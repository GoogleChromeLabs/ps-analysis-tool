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
import SinonChrome from 'sinon-chrome';
import { noop } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import { useSettings } from '../../../stateProviders';
import Settings from '..';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';

jest.mock('../../../stateProviders', () => ({
  useSettings: jest.fn(),
}));

const mockUseSettingsStore = useSettings as jest.Mock;

describe('Settings Page', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('Should render settings page', () => {
    mockUseSettingsStore.mockReturnValue({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
      setIsUsingCDP: noop,
      setProcessingMode: noop,
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
      render(<Settings />);
    });

    expect(screen.getByTestId('settings-main-content')).not.toHaveClass(
      'hidden'
    );
    act(() => {
      screen.getByTestId('settings-collapse-button').click();
    });

    expect(screen.getByTestId('settings-main-content')).toHaveClass('hidden');
  });
});
