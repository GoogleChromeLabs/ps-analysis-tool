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
    activeGroup: string | null;
    groupedTitles: Record<
      string,
      {
        title: string;
        index: number;
      }[]
    >;
    titles: string[];
    expandedGroups: { [group: string]: boolean };
    panel: {
      Element: ((props: any) => React.JSX.Element) | null;
      props?: Record<string, any>;
      className?: string;
      containerClassName?: string;
    };
    storage: string[];
    isGroup: boolean;
    loading: boolean;
  };
  actions: {
    setStorage: (data: string, index?: number) => void;
    setActiveTab: (tab: number) => void;
    setActiveGroup: (group: string) => void;
    setExpandedGroup: (group: string) => void;
    highlightTab: (
      tab: number,
      count?: boolean | number,
      increment?: boolean
    ) => void;
    isTabHighlighted: (tab: number) => boolean | number;
    shouldAddSpacer: (tab: number) => boolean;
    getTabGroup: (tab: number) => string;
  };
}

const initialState: TabsStoreContext = {
  state: {
    activeTab: 0,
    activeGroup: null,
    groupedTitles: {},
    titles: [],
    expandedGroups: {},
    panel: {
      Element: null,
      props: {},
    },
    storage: [],
    isGroup: true,
    loading: true,
  },
  actions: {
    setStorage: noop,
    setActiveTab: noop,
    setActiveGroup: noop,
    setExpandedGroup: noop,
    highlightTab: noop,
    isTabHighlighted: () => false,
    shouldAddSpacer: () => false,
    getTabGroup: () => '',
  },
};

export const TabsContext = createContext<TabsStoreContext>(initialState);
