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
import { noop } from '@ps-analysis-tool/common';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import App from '../app';
import data from './data.mock';
import { useData } from '../stateProviders/data';

jest.mock('../stateProviders/data', () => ({
  useData: jest.fn(),
}));
const mockUseDataStore = useData as jest.Mock;

describe('Report View', () => {
  globalThis.chrome = {
    tabs: {
      //@ts-ignore
      onUpdated: {
        addListener: noop,
        removeListener: noop,
      },
    },
    devtools: {
      inspectedWindow: {
        //@ts-ignore
        onResourceAdded: {
          addListener: noop,
          removeListener: noop,
        },
        getResources: noop,
      },
    },
    webNavigation: {
      //@ts-ignore
      onErrorOccurred: {
        addListener: noop,
        removeListener: noop,
      },
      //@ts-ignore
      onBeforeNavigate: {
        addListener: noop,
        removeListener: noop,
      },
      //@ts-ignore
      onCompleted: {
        addListener: noop,
        removeListener: noop,
      },
    },
  };

  it('Should add chrome API mocks ', async () => {
    mockUseDataStore.mockReturnValue(data);
    render(<App />);
    expect(await screen.findByText('Total cookies')).toBeInTheDocument();
  });
});
