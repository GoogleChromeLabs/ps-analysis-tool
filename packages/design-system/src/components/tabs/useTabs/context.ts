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
import { createContext } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { noop } from '../../../utils';

export interface TabsStoreContext {
  state: {
    activeTab: number;
    titles: string[];
    panel: {
      Element: ((props: any) => React.JSX.Element) | null;
      props?: Record<string, any>;
      className?: string;
    };
    storage: string[];
  };
  actions: {
    setStorage: (data: string, index?: number) => void;
    setActiveTab: (tab: number) => void;
  };
}

const initialState: TabsStoreContext = {
  state: {
    activeTab: 0,
    titles: [],
    panel: {
      Element: null,
      props: {},
    },
    storage: [],
  },
  actions: {
    setStorage: noop,
    setActiveTab: noop,
  },
};

export const TabsContext = createContext<TabsStoreContext>(initialState);
