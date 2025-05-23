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
import {
  createContext,
  noop,
  type SourcesRegistration,
  type TriggerRegistration,
} from '@google-psat/common';

export interface AttributionReportingContextType {
  state: {
    sourcesRegistration: SourcesRegistration[];
    triggerRegistration: TriggerRegistration[];
    filter: {
      activeSources: boolean;
      sourcesRegistration: boolean;
      triggerRegistration: boolean;
    };
  };
  actions: {
    updateFilter: (filter: string, booleanValue: boolean) => void;
  };
}

const initialState: AttributionReportingContextType = {
  state: {
    triggerRegistration: [],
    sourcesRegistration: [],
    filter: {
      activeSources: true,
      sourcesRegistration: true,
      triggerRegistration: false,
    },
  },
  actions: {
    updateFilter: noop,
  },
};

export default createContext<AttributionReportingContextType>(initialState);
