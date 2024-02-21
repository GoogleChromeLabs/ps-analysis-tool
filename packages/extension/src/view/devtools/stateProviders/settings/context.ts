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
import { noop } from '@ps-analysis-tool/common';

export interface SettingsStoreContext {
  state: {
    allowedNumberOfTabs: string | null;
    currentTabs: number;
    currentExtensions:
      | {
          extensionName: string;
          extensionId: string;
        }[]
      | null;
    browserInformation: string | null;
    OSInformation: string | null;
    isUsingCDP: boolean;
    settingsChanged: boolean;
    allowedNumberOfTabsForSettingsPageDisplay: string | null;
    isUsingCDPForSettingsPageDisplay: boolean;
  };
  actions: {
    setProcessingMode: (newState: boolean) => void;
    setIsUsingCDP: (newValue: boolean) => void;
    handleSettingsChange: () => void;
    setSettingsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const initialState: SettingsStoreContext = {
  state: {
    allowedNumberOfTabs: null,
    currentTabs: 0,
    currentExtensions: null,
    browserInformation: null,
    OSInformation: null,
    isUsingCDP: false,
    settingsChanged: false,
    allowedNumberOfTabsForSettingsPageDisplay: null,
    isUsingCDPForSettingsPageDisplay: false,
  },
  actions: {
    setIsUsingCDP: noop,
    setProcessingMode: noop,
    handleSettingsChange: noop,
    setSettingsChanged: noop,
  },
};

export default createContext<SettingsStoreContext>(initialState);
