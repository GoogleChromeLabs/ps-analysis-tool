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
import React, { useCallback, useEffect, useState } from 'react';

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

export type SidebarItemValue = {
  title: string;
  children: SidebarItems;
  dropdownOpen?: boolean;
  panel?: React.ReactNode;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
};

export type SidebarItems = {
  [key: string]: SidebarItemValue;
};

export interface SidebarOutput {
  activePanel: React.ReactNode;
  selectedItemKey: string | null;
  sidebarItems: SidebarItems;
  updateSelectedItemKey: (key: string | null) => void;
  onKeyNavigation: (
    event: React.KeyboardEvent<HTMLDivElement>,
    key: string | null
  ) => void;
  toggleDropdown: (action: boolean, key: string) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

interface useSidebarProps {
  data: SidebarItems;
}

const useSidebar = ({ data }: useSidebarProps): SidebarOutput => {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<React.ReactNode>();
  const [sidebarItems, setSidebarItems] = useState<SidebarItems>({});

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
          setActivePanel(item.panel);

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
  }, [selectedItemKey, sidebarItems]);

  const updateSelectedItemKey = useCallback(
    (key: string | null) => {
      const keyPath = createKeyPath(sidebarItems, key || '');

      if (!keyPath.length) {
        setSelectedItemKey(null);
        return;
      }

      setSelectedItemKey(keyPath.join('#'));
    },
    [sidebarItems]
  );

  const toggleDropdown = useCallback(
    (action: boolean, key: string) => {
      const keyPath = createKeyPath(sidebarItems, key);

      setSidebarItems((prev) => {
        const items = { ...prev };
        const item = findItem(items, keyPath);

        if (item && Object.keys(item.children).length) {
          item.dropdownOpen = action;
        }

        return items;
      });
    },
    [sidebarItems]
  );

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

        updateSelectedItemKey(prevItem);
      } else if (navigationAction === 'ArrowDown') {
        const nextItem = findNextItem(sidebarItems, keyPath);

        if (!nextItem) {
          return;
        }

        updateSelectedItemKey(nextItem);
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

  return {
    activePanel,
    selectedItemKey,
    sidebarItems,
    updateSelectedItemKey,
    onKeyNavigation,
    toggleDropdown,
    isKeyAncestor,
    isKeySelected,
  };
};

export default useSidebar;
