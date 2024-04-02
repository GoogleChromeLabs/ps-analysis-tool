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
import { createContext, noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { SidebarComponent, SidebarItems } from './types';

export interface SidebarStoreContext {
  state: {
    activePanel: {
      panel: SidebarComponent;
      query?: string;
    };
    selectedItemKey: string | null; //Entire chained item key eg Privacy-Sandbox#cookies#frameUrl
    currentItemKey: string | null; //Last sidebar item key in selectedItemKey eg frameUrl
    sidebarItems: SidebarItems;
    isSidebarFocused: boolean;
  };
  actions: {
    setIsSidebarFocused: React.Dispatch<boolean>;
    updateSelectedItemKey: (key: string | null, queryString?: string) => void;
    onKeyNavigation: (
      event: React.KeyboardEvent<HTMLDivElement>,
      key: string | null
    ) => void;
    toggleDropdown: (action: boolean, key: string) => void;
    isKeyAncestor: (key: string) => boolean;
    isKeySelected: (key: string) => boolean;
  };
}

export const initialState: SidebarStoreContext = {
  state: {
    activePanel: {
      panel: {
        Element: () => '' as any,
        props: {},
      },
      query: '',
    },
    selectedItemKey: null,
    currentItemKey: null,
    sidebarItems: {},
    isSidebarFocused: true,
  },
  actions: {
    setIsSidebarFocused: noop,
    updateSelectedItemKey: noop,
    onKeyNavigation: noop,
    toggleDropdown: noop,
    isKeyAncestor: () => false,
    isKeySelected: () => false,
  },
};

export const SidebarContext = createContext<SidebarStoreContext>(initialState);
