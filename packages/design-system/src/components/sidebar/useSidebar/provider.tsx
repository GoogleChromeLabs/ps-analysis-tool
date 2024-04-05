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
import { SidebarItems, useSidebarProps } from './types';
import { SidebarContext, SidebarStoreContext, initialState } from './context';

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

  /**
   * Update the selected item key when the defaultSelectedItemKey loads.
   */
  useEffect(() => {
    setSelectedItemKey(defaultSelectedItemKey);
  }, [defaultSelectedItemKey]);

  /**
   * Get the last sidebar item key in selectedItemKey chain.
   * Eg: selectedItemKey = 'Privacy-Sandbox#cookies#frameUrl'
   * currentItemKey = 'frameUrl'
   */
  const currentItemKey = useMemo(() => {
    if (!selectedItemKey) {
      return null;
    }

    const keys = selectedItemKey.split('#');
    const length = keys.length;

    return keys[length - 1];
  }, [selectedItemKey]);

  /**
   * Update the sidebar items when the sidebar data changes.
   */
  useEffect(() => {
    setSidebarItems(data);
  }, [data]);

  /**
   * Find the active panel when the selected item key changes.
   */
  useEffect(() => {
    let keyFound = false;

    /**
     * Find the active panel, if the selected item key is matched with the item key.
     * If the item key is matched, set the active panel.
     * If the item has children, recursively find the active panel.
     * @param items Sidebar items.
     */
    const findActivePanel = (items: SidebarItems) => {
      Object.entries(items).forEach(([itemKey, item]) => {
        if (keyFound) {
          return;
        }

        if (matchKey(selectedItemKey || '', itemKey)) {
          if (item.panel) {
            setActivePanel({
              query,
              clearQuery: () => {
                setTimeout(() => setQuery(''));
              },
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

  /**
   * Update the selected item key and query string.
   * @param key Selected item key.
   * @param queryString Query string to pass to the new panel.
   */
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

  /**
   * Toggle the dropdown of the sidebar item.
   * @param action Dropdown action.
   * @param key Sidebar item key to toggle dropdown.
   */
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

  /**
   * Handle keyboard navigation in the sidebar.
   * @param event Keyboard event.
   * @param key Sidebar item key to navigate.
   */
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

      /**
       * Open or close the dropdown based on the navigation action.
       */
      if (navigationAction === 'ArrowRight') {
        toggleDropdown(true, key);
      } else if (navigationAction === 'ArrowLeft') {
        toggleDropdown(false, key);
      }

      /**
       * Navigate to the previous or next sidebar item based on the navigation action.
       */
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

  /**
   * Check if the key is an ancestor of the selected item key.
   * @param key Sidebar item key to check.
   * @returns boolean
   */
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

  /**
   * Check if the key is present in the selected item key chain.
   * Eg: selectedItemKey = 'Privacy-Sandbox#cookies#frameUrl'
   * isKeySelected('frameUrl') => true
   * @param key Sidebar item key to check.
   * @returns boolean
   */
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
