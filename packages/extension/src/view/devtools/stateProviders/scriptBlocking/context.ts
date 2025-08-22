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

export interface ScriptBlockingStoreContext {
  state: {
    uniqueResponseDomains: string[];
  };
  actions: {
    setUniqueResponseDomains: (newValue: string[]) => void;
  };
}

const initialState: ScriptBlockingStoreContext = {
  state: {
    uniqueResponseDomains: [],
  },
  actions: {
    setUniqueResponseDomains: noop,
  },
};

export default createContext<ScriptBlockingStoreContext>(initialState);
