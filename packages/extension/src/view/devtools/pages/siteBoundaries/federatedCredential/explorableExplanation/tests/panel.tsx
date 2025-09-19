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
import { render } from '@testing-library/react';
/**
 * Internal dependencies.
 */
import Panel from '../panel';

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

const setStepExplanation = jest.fn();
const setScenarioTitle = jest.fn();
const setScenarioExplanation = jest.fn();

const mockSetCurrentScenarioKey = jest.fn();
const mockSetCurrentStep = jest.fn();

jest.mock('../store', () => ({
  useStore: () => ({
    currentScenarioKey: 'scenarioA',
    currentStep: 0,
    setCurrentScenarioKey: mockSetCurrentScenarioKey,
    setCurrentStep: mockSetCurrentStep,
    setIsPlaying: jest.fn(),
  }),
}));

jest.mock('../store/scenarios', () => ({
  scenarios: {
    scenarioA: {
      title: 'Scenario A',
      description: 'Desc A',
      steps: [{ explanation: 'Step 1 desc' }, { explanation: 'Step 2 desc' }],
    },
    scenarioB: {
      title: 'Scenario B',
      description: 'Desc B',
      steps: [{ explanation: 'Step 3 desc' }, { explanation: 'Step 4 desc' }],
    },
  },
}));

jest.mock('../store/scenariosTypes', () => ({
  ScenarioKeys: ['scenarioA', 'scenarioB'],
}));

describe('Panel - ee:dispatchId event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update currentScenarioKey and currentStep on ee:dispatchId event', () => {
    render(
      <Panel
        setStepExplanation={setStepExplanation}
        setScenarioTitle={setScenarioTitle}
        setScenarioExplanation={setScenarioExplanation}
      />
    );

    const event = new CustomEvent('ee:dispatchId', {
      detail: { dispatchId: 'prefix-scenarioB-3' },
    });
    document.dispatchEvent(event);

    expect(mockSetCurrentScenarioKey).toHaveBeenCalledWith('scenarioB');
    expect(mockSetCurrentStep).toHaveBeenCalledWith(3);
  });
});
