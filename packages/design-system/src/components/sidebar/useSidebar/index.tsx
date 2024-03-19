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
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createContext } from 'use-context-selector';
import { noop, useContextSelector } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import {
  createKeyPath,
  findItem,
  findNextItem,
  findPrevItem,
  matchKey,
} from './utils';

type SidebarComponent = {
  Element?: (props: any) => React.JSX.Element;
  props?: Record<string, unknown>;
};

export type SidebarItemValue = {
  title: string;
  children: SidebarItems;
  popupTitle?: string;
  infoIconDescription?: string;
  extraInterfaceToTitle?: SidebarComponent;
  dropdownOpen?: boolean;
  panel?: SidebarComponent;
  icon?: SidebarComponent;
  selectedIcon?: SidebarComponent;
  isBlurred?: boolean;
};

export type SidebarItems = {
  [key: string]: SidebarItemValue;
};

interface useSidebarProps {
  data: SidebarItems;
  defaultSelectedItemKey?: string | null;
}

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

const initialState: SidebarStoreContext = {
  state: {
    activePanel: {
      panel: {
        Element: () => <></>,
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

export const SidebarProvider = ({
  data,
  defaultSelectedItemKey = null,
  children,
}: PropsWithChildren<useSidebarProps>) => {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<
    SidebarStoreContext['state']['activePanel']
  >(initialState.state.activePanel);
  const [query, setQuery] = useState<string>('');
  const [sidebarItems, setSidebarItems] = useState<SidebarItems>({});
  const [isSidebarFocused, setIsSidebarFocused] = useState(true);

  useEffect(() => {
    setSelectedItemKey(defaultSelectedItemKey);
  }, [defaultSelectedItemKey]);

  const currentItemKey = useMemo(() => {
    if (!selectedItemKey) {
      return null;
    }

    const keys = selectedItemKey.split('#');
    const length = keys.length;

    return keys[length - 1];
  }, [selectedItemKey]);

  useEffect(() => {
    setSidebarItems(data);
  }, [data]);

  useEffect(() => {
    let keyFound = false;

    const findActivePanel = (items: SidebarItems) => {
      Object.entries(items).forEach(([itemKey, item]) => {
        if (keyFound) {
          return;
        }

        if (matchKey(selectedItemKey || '', itemKey)) {
          if (item.panel) {
            setActivePanel({
              query,
              panel: item.panel,
            });
          }

          keyFound = true;
          return;
        }

        if (item.children) {
          findActivePanel(item.children);
        }
      });
    };

    if (selectedItemKey) {
      findActivePanel(sidebarItems);
    }
  }, [query, selectedItemKey, sidebarItems]);

  const updateSelectedItemKey = useCallback(
    (key: string | null, queryString = '') => {
      const keyPath = createKeyPath(sidebarItems, key || '');

      if (!keyPath.length) {
        setSelectedItemKey(null);
        return;
      }

      setSelectedItemKey(keyPath.join('#'));
      setQuery(queryString);
    },
    [sidebarItems]
  );

  const toggleDropdown = useCallback((action: boolean, key: string) => {
    setSidebarItems((prev) => {
      const items = { ...prev };
      const item = findItem(items, key);

      if (item && Object.keys(item.children).length) {
        item.dropdownOpen = action;
      }

      return items;
    });
  }, []);

  const onKeyNavigation = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, key: string | null) => {
      event.preventDefault();
      event.stopPropagation();

      if (!key) {
        return;
      }

      const navigationAction = event.key;
      const keyPath = createKeyPath(sidebarItems, key);

      if (!keyPath.length) {
        return;
      }

      if (navigationAction === 'ArrowRight') {
        toggleDropdown(true, key);
      } else if (navigationAction === 'ArrowLeft') {
        toggleDropdown(false, key);
      }

      if (navigationAction === 'ArrowUp') {
        const prevItem = findPrevItem(sidebarItems, keyPath);

        if (!prevItem) {
          return;
        }

        // delay navigation as user can hold up arrow key which make useEffect to run multiple times unnecessarily.
        setTimeout(() => updateSelectedItemKey(prevItem));
      } else if (navigationAction === 'ArrowDown') {
        const nextItem = findNextItem(sidebarItems, keyPath);

        if (!nextItem) {
          return;
        }

        // delay navigation as user can hold down arrow key which make useEffect to run multiple times unnecessarily.
        setTimeout(() => updateSelectedItemKey(nextItem));
      }
    },
    [sidebarItems, toggleDropdown, updateSelectedItemKey]
  );

  const isKeyAncestor = useCallback(
    (key: string) => {
      if (!selectedItemKey) {
        return false;
      }

      const keys = selectedItemKey.split('#');
      const length = keys.length;

      return keys[length - 1] !== key && keys.includes(key);
    },
    [selectedItemKey]
  );

  const isKeySelected = useCallback(
    (key: string) => {
      if (!selectedItemKey) {
        return false;
      }

      const keys = selectedItemKey.split('#');
      const length = keys.length;

      return keys[length - 1] === key;
    },
    [selectedItemKey]
  );

  return (
    <SidebarContext.Provider
      value={{
        state: {
          activePanel,
          selectedItemKey,
          currentItemKey,
          sidebarItems,
          isSidebarFocused,
        },
        actions: {
          setIsSidebarFocused,
          updateSelectedItemKey,
          onKeyNavigation,
          toggleDropdown,
          isKeyAncestor,
          isKeySelected,
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar(): SidebarStoreContext;
export function useSidebar<T>(selector: (state: SidebarStoreContext) => T): T;

/**
 * Hook to access the Sidebar context.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useSidebar<T>(
  selector: (state: SidebarStoreContext) => T | SidebarStoreContext = (state) =>
    state
) {
  return useContextSelector(SidebarContext, selector);
}
