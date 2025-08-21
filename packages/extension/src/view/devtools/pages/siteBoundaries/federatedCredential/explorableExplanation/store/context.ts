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
import type { Main } from '@google-psat/ee-workflow';

export interface StoreContext {
  state: {
    play: boolean;
    speed: number;
  };
  actions: {
    setCanvas: (canvas: Main) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    reset: () => void;
    nextStep: () => void;
    prevStep: () => void;
    setSpeed: (speed: number) => void;
  };
}

const initialState: StoreContext = {
  state: {
    play: false,
    speed: 1,
  },
  actions: {
    setCanvas: noop,
    setIsPlaying: noop,
    reset: noop,
    nextStep: noop,
    prevStep: noop,
    setSpeed: noop,
  },
};

const Context = createContext<StoreContext>(initialState);

export default Context;
