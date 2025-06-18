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
  type PrebidDebugModuleConfig,
  type PrebidDebugModuleConfigRule,
  type PrebidEvents,
} from '@google-psat/common';

export type PBJSNamespacesType = {
  [frameId: string]: {
    namespaces: {
      frameId: number;
      namespace: string;
    }[];
    host: string;
  };
};

export interface PrebidContextType {
  state: {
    prebidData: PrebidEvents;
    prebidExists: boolean | null;
    debuggingModuleConfig: PrebidDebugModuleConfig;
    selectedFrameId: number;
    pbjsNamespaces: PBJSNamespacesType;
    storeRulesInLocalStorage: boolean;
    namespace: string;
  };
  actions: {
    setDebuggingModuleConfig: React.Dispatch<
      React.SetStateAction<PrebidDebugModuleConfig>
    >;
    setFrameId: React.Dispatch<React.SetStateAction<number>>;
    setNamespace: React.Dispatch<React.SetStateAction<string>>;
    handleChangeStoreRulesInLocalStorage: (value: boolean) => void;
    openGoogleManagerConsole: () => void;
    changeRule: (
      ruleKey: string,
      ruleType: 'when' | 'then',
      ruleIndex: number,
      newValue: any,
      _delete?: boolean
    ) => void;
    addRule: (
      ruleWhen: PrebidDebugModuleConfigRule,
      ruleType: 'when' | 'then',
      ruleIndex: number
    ) => void;
    handleWriteRulesToStorage: (
      input: PrebidDebugModuleConfig
    ) => Promise<void>;
  };
}

export const initialState: PrebidContextType = {
  state: {
    prebidData: {
      prebidExists: false,
      adUnits: {},
      pbjsNamespace: '',
      noBids: {},
      receivedBids: [],
      errorEvents: [],
      versionInfo: '',
      config: {},
      auctionEvents: {},
      installedModules: [],
    },
    namespace: '',
    pbjsNamespaces: {},
    prebidExists: null,
    selectedFrameId: 0,
    debuggingModuleConfig: {
      enabled: false,
      intercept: [],
    },
    storeRulesInLocalStorage: false,
  },
  actions: {
    setNamespace: noop,
    setFrameId: noop,
    setDebuggingModuleConfig: noop,
    changeRule: noop,
    addRule: noop,
    handleWriteRulesToStorage: () => Promise.resolve(),
    openGoogleManagerConsole: noop,
    handleChangeStoreRulesInLocalStorage: noop,
  },
};

export default createContext<PrebidContextType>(initialState);
