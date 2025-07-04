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
  collapsedData,
  collapsedState = false,
  children,
}: PropsWithChildren<useSidebarProps>) => {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<
    SidebarStoreContext['state']['activePanel']
  >(initialState.state.activePanel);
  const [query, setQuery] = useState<string>('');
  const [sidebarItems, setSidebarItems] = useState<SidebarItems>({});
  const [isSidebarFocused, setIsSidebarFocused] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(collapsedState);
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
   * Toggle the dropdown of the sidebar item.
   * @param action Dropdown action.
   * @param key Sidebar item key to toggle dropdown.
   */
  const toggleDropdown = useCallback((action: boolean, key: string) => {
    setSidebarItems((prev) => {
      const items = { ...prev };
      const item = findItem(items, key, action);

      if (item && Object.keys(item.children).length) {
        item.dropdownOpen = action;
      }

      return items;
    });
  }, []);

  /**
   * Update the selected item key when the defaultSelectedItemKey loads.
   */
  useEffect(() => {
    setSelectedItemKey(defaultSelectedItemKey);
    toggleDropdown(true, defaultSelectedItemKey || '');
  }, [defaultSelectedItemKey, toggleDropdown]);

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
     * @param key Sidebar item key to match.
     */
    const findActivePanel = (items: SidebarItems, key: string) => {
      Object.entries(items).forEach(([itemKey, item]) => {
        if (keyFound) {
          return;
        }

        if (matchKey(key || '', itemKey)) {
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
          findActivePanel(item.children, key);
        }
      });
    };

    if (selectedItemKey) {
      findActivePanel(sidebarItems, selectedItemKey);
    }

    if (!keyFound) {
      const keys = selectedItemKey?.split('#');
      keys?.pop();
      let key = keys?.join('#');

      // eslint-disable-next-line no-unmodified-loop-condition -- findActivePanel callback updates value
      while (keys?.length && !keyFound) {
        key = keys.join('#');

        findActivePanel(sidebarItems, key);
        keys.pop();
      }

      if (keyFound && key) {
        setSelectedItemKey(key);
      }
    }
  }, [query, selectedItemKey, sidebarItems]);

  useEffect(() => {
    setSidebarItems((prev) => {
      const items = { ...prev };
      const keyPath = selectedItemKey?.split('#').slice(0, -1);

      if (!keyPath || !keyPath.length) {
        return items;
      }

      let item = null;
      let _items = items;
      keyPath.forEach((key) => {
        item = _items[key];

        if (item && Object.keys(item.children).length) {
          item.dropdownOpen = true;
        }

        _items = item?.children || {};
      });

      return items;
    });
  }, [selectedItemKey]);

  /**
   * Update the selected item key and query string.
   * @param key Selected item key.
   * @param queryString Query string to pass to the new panel.
   */
  const updateSelectedItemKey = useCallback(
    async (key: string | null, queryString = '', skipPanelDisplay = false) => {
      const keyPath = createKeyPath(sidebarItems, key || '');

      if (!keyPath.length) {
        setSelectedItemKey(null);
        return;
      }

      const item = findItem(sidebarItems, key);
      if (item?.panel?.href || (skipPanelDisplay && item?.panel?.href)) {
        const tab = await chrome.tabs.get(
          chrome.devtools.inspectedWindow.tabId
        );

        if (tab) {
          const url = tab.url?.split('#')[0].split('?')[0] || '';
          const tabUrl = new URL(url);
          const panelUrl = new URL(item.panel.href);

          if (tabUrl.href !== panelUrl.href) {
            chrome.scripting
              .executeScript({
                target: { tabId: chrome.devtools.inspectedWindow.tabId },
                func: (_url: string) => {
                  window.location.assign(_url);
                },
                args: [panelUrl.href],
              })
              .then(() => console.log('injected a function'));
          }
        }

        if (skipPanelDisplay) {
          return;
        }
      }

      setSelectedItemKey(keyPath.join('#'));
      setQuery(queryString);
    },
    [sidebarItems]
  );

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

  const toggleSidebarCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  /**
   * Extract the titles of the selected item key chain.
   * Eg: selectedItemKey = 'Privacy-Sandbox#cookies#frameUrl'
   * extractSelectedItemKeyTitles() => ['Privacy Sandbox', 'Cookies', 'Frame URL']
   * @returns Array<{title: string, key: string}>
   */
  const extractSelectedItemKeyTitles = useCallback(() => {
    if (!selectedItemKey) {
      return [];
    }

    let _sidebarItems = sidebarItems;
    const keys = selectedItemKey.split('#');
    const titles: Array<{ title: string; key: string }> = [];

    for (const key of keys) {
      const sidebarItem = _sidebarItems?.[key];

      if (!sidebarItem) {
        break;
      }

      titles.push({
        title:
          typeof sidebarItem.title === 'function'
            ? sidebarItem.title()
            : sidebarItem.title,
        key,
      });

      _sidebarItems = sidebarItem.children;
    }

    return titles;
  }, [selectedItemKey, sidebarItems]);

  return (
    <SidebarContext.Provider
      value={{
        state: {
          activePanel,
          selectedItemKey,
          currentItemKey,
          sidebarItems,
          collapsedSidebarItems: collapsedData,
          isSidebarFocused,
          isCollapsed,
          isSidebarCollapsible: Boolean(collapsedData),
        },
        actions: {
          setIsSidebarFocused,
          updateSelectedItemKey,
          onKeyNavigation,
          toggleDropdown,
          isKeyAncestor,
          isKeySelected,
          toggleSidebarCollapse,
          extractSelectedItemKeyTitles,
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
