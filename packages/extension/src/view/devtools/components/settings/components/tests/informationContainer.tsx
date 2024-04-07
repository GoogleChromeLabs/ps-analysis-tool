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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
/**
 * Internal dependencies
 */
import { useSettings } from '../../../../stateProviders/settings';
import InformationContainer from '../informationContainer';

jest.mock('../../../../stateProviders/settings', () => ({
  useSettings: jest.fn(),
}));

const mockUseSettingsStore = useSettings as jest.Mock;

describe('informationContainer', () => {
  it('should render the component', () => {
    mockUseSettingsStore.mockReturnValue({
      currentTabs: 0,
      currentExtensions: [],
      browserInformation: '',
      PSATVersion: '',
      OSInformation: '',
    });

    render(<InformationContainer />);

    expect(mockUseSettingsStore).toHaveBeenCalled();
    expect(screen.getByTestId('debugging-information')).toBeInTheDocument();
  });

  it('should copy the text to clipboard', () => {
    mockUseSettingsStore.mockReturnValue({
      currentTabs: 2,
      currentExtensions: [
        {
          extensionName: 'test',
          extensionId: 'test',
        },
      ],
      browserInformation: 'test browser',
      PSATVersion: '0.0.0',
      OSInformation: '0.1.0',
    });

    render(<InformationContainer />);

    expect(mockUseSettingsStore).toHaveBeenCalled();
    expect(screen.getByTestId('debugging-information')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();

    global.document.execCommand = jest.fn(() => 'copy');
    const events = {};
    jest
      .spyOn(global.document, 'addEventListener')
      .mockImplementation((event, cb) => {
        // @ts-ignore
        events[event] = cb;
      });

    const button = screen.getByTestId('copy-button');
    act(() => {
      button.click();
    });

    expect(global.document.execCommand).toHaveBeenCalled();
    expect(events['copy']).toBeDefined();
    expect(events['copy']).toBeInstanceOf(Function);

    const e = {
      clipboardData: { setData: jest.fn() },
      preventDefault: jest.fn(),
    };
    events['copy'](e);

    expect(e.clipboardData.setData).toHaveBeenCalledWith(
      'text/plain',
      '**Open Tabs:** 2\n**Active Extensions:**\ntest: test\n**Chrome Version:** test browser\n**PSAT Version:** 0.0.0\n**OS - System Architecture:** 0.1.0'
    );
    expect(e.preventDefault).toHaveBeenCalled();
  });
});
