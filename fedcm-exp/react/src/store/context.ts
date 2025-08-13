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

import { createContext } from 'use-context-selector';
import { ScenarioKeys } from '../scenariosTypes';

export interface StoreContext {
  state: {
    currentScenario: ScenarioKeys;
    currentStep: number;
    messageCount: number;
    autoAdvance: boolean;
  };
  actions: {
    resetCurrentScenario: () => void;
    selectScenario: (scenario: ScenarioKeys) => void;
    incrementMessageCount: () => void;
    nextStep: () => void;
    autoAdvanceHandler: () => void;
  };
}

const initialState: StoreContext = {
  state: {
    currentScenario: ScenarioKeys.REGISTRATION,
    currentStep: -1,
    messageCount: 0,
    autoAdvance: false,
  },
  actions: {
    resetCurrentScenario: undefined as any,
    selectScenario: undefined as any,
    incrementMessageCount: undefined as any,
    nextStep: undefined as any,
    autoAdvanceHandler: undefined as any,
  },
};

const Context = createContext<StoreContext>(initialState);

export default Context;
