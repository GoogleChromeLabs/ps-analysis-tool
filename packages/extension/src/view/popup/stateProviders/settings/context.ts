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
import { noop, createContext } from '@google-psat/common';

export interface SettingsStoreContext {
  state: {
    isUsingCDP: boolean;
    settingsChanged: boolean;
    isUsingCDPForSettingsDisplay: boolean;
    exceedingLimitations: boolean;
  };
  actions: {
    handleSettingsChange: () => void;
    setUsingCDP: (newValue: boolean) => void;
    setSettingsChanged: (newValue: boolean) => void;
    setExceedingLimitations: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUsingCDPForSettingsDisplay: React.Dispatch<
      React.SetStateAction<boolean>
    >;
  };
}

const initialState: SettingsStoreContext = {
  state: {
    isUsingCDP: false,
    settingsChanged: false,
    isUsingCDPForSettingsDisplay: false,
    exceedingLimitations: false,
  },
  actions: {
    handleSettingsChange: noop,
    setUsingCDP: noop,
    setSettingsChanged: noop,
    setExceedingLimitations: noop,
    setIsUsingCDPForSettingsDisplay: noop,
  },
};

export default createContext<SettingsStoreContext>(initialState);
