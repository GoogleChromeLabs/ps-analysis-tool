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

export type SidebarItem = {
  key: string;
  title: string;
  children: SidebarItem[];
  panel?: React.ReactNode;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
};

export interface SidebarOutput {
  activePanel: React.ReactNode;
  sidebarItems: SidebarItem[];
  updateSelectedItemKey: (key: string | null) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

interface useSidebarProps {
  data: SidebarItem[];
}

const useSidebar = ({ data }: useSidebarProps): SidebarOutput => {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<React.ReactNode>();
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    setSidebarItems(data);
  }, [data]);

  const matchKey = useCallback((key: string, toMatch: string) => {
    const keys = key.split('#');
    const length = keys.length;

    return keys[length - 1] === toMatch;
  }, []);

  useEffect(() => {
    let keyFound = false;

    const findActivePanel = (items: SidebarItem[]) => {
      items.forEach((item) => {
        if (keyFound) {
          return;
        }

        if (matchKey(selectedItemKey || '', item.key)) {
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
  }, [matchKey, selectedItemKey, sidebarItems]);

  const updateSelectedItemKey = useCallback(
    (key: string | null) => {
      let keyFound = false;

      const createKeyPath = (items: SidebarItem[], keyPath: string[] = []) => {
        items.forEach((item) => {
          if (keyFound) {
            return;
          }

          if (matchKey(key || '', item.key)) {
            keyPath.push(item.key);

            keyFound = true;
            return;
          }

          if (item.children) {
            keyPath.push(item.key);
            createKeyPath(item.children, keyPath);

            if (!keyFound) {
              keyPath.pop();
            }
          }
        });

        return keyPath;
      };

      const keyPath = createKeyPath(sidebarItems);

      if (!keyFound) {
        setSelectedItemKey(null);
        return;
      }

      setSelectedItemKey(keyPath.join('#'));
    },
    [matchKey, sidebarItems]
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
    sidebarItems,
    updateSelectedItemKey,
    isKeyAncestor,
    isKeySelected,
  };
};

export default useSidebar;
