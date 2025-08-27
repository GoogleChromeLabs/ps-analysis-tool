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
    currentTabs: number;
    currentExtensions:
      | {
          extensionName: string;
          extensionId: string;
        }[]
      | null;
    browserInformation: string | null;
    OSInformation: string | null;
    PSATVersion: string | null;
    isObservabilityEnabled: boolean;
    settingsChanged: boolean;
    isObservabilityForSettingsPageDisplay: boolean;
    exceedingLimitations: boolean;
    incognitoAccess: boolean;
    observabilityEnabled: Record<string, boolean>;
    observabilityEnabledForDisplay: Record<string, boolean>;
  };
  actions: {
    setIsObservability: (newValue: boolean) => void;
    handleSettingsChange: () => void;
    setSettingsChanged: React.Dispatch<React.SetStateAction<boolean>>;
    setExceedingLimitations: React.Dispatch<React.SetStateAction<boolean>>;
    setIsObservabilityForSettingsPageDisplay: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    handleObservabilityEnabled: (key: string, value: boolean) => void;
    openIncognitoTab: () => Promise<void>;
    setObservabilityEnabledForDisplay: React.Dispatch<
      React.SetStateAction<Record<string, boolean>>
    >;
    reloadExtension: () => void;
  };
}

const initialState: SettingsStoreContext = {
  state: {
    incognitoAccess: false,
    currentTabs: 0,
    currentExtensions: null,
    browserInformation: null,
    OSInformation: null,
    PSATVersion: null,
    isObservabilityEnabled: false,
    settingsChanged: false,
    isObservabilityForSettingsPageDisplay: false,
    exceedingLimitations: false,
    observabilityEnabledForDisplay: {
      cookies: false,
      protectedAudience: false,
      attributionReporting: false,
      ipProtection: false,
      scriptBlocking: false,
    },
    observabilityEnabled: {
      cookies: false,
      protectedAudience: false,
      attributionReporting: false,
      ipProtection: false,
      scriptBlocking: false,
    },
  },
  actions: {
    setIsObservability: noop,
    handleSettingsChange: noop,
    setSettingsChanged: noop,
    setExceedingLimitations: noop,
    setIsObservabilityForSettingsPageDisplay: noop,
    openIncognitoTab: () => Promise.resolve(),
    handleObservabilityEnabled: noop,
    setObservabilityEnabledForDisplay: noop,
    reloadExtension: noop,
  },
};

export default createContext<SettingsStoreContext>(initialState);
