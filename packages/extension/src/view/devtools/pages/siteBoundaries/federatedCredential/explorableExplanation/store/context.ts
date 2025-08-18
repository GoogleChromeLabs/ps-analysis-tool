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
import { noop, createContext } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { ScenarioKeys } from './scenariosTypes';

export interface StoreContext {
  state: {
    play: boolean;
    currentScenario: ScenarioKeys;
    currentStep: number;
    messageCount: number;
    interactiveMode: boolean;
  };
  actions: {
    setPlay: (play: boolean) => void;
    resetCurrentScenario: () => void;
    selectScenario: (scenario: ScenarioKeys) => void;
    incrementMessageCount: () => void;
    nextStep: () => void;
    interactiveModeHandler: () => void;
  };
}

const initialState: StoreContext = {
  state: {
    play: false,
    currentScenario: ScenarioKeys.REGISTRATION,
    currentStep: -1,
    messageCount: 0,
    interactiveMode: false,
  },
  actions: {
    setPlay: noop,
    resetCurrentScenario: noop,
    selectScenario: noop,
    incrementMessageCount: noop,
    nextStep: noop,
    interactiveModeHandler: noop,
  },
};

const Context = createContext<StoreContext>(initialState);

export default Context;
