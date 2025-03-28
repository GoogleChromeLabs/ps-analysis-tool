/*
 * Copyright 2024 Google LLC
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
  useRef,
  useState,
} from 'react';

/**
 * Internal dependencies.
 */
import { TabsProviderProps } from './types';
import { TabsContext } from './context';

export const TabsProvider = ({
  children,
  items,
}: PropsWithChildren<TabsProviderProps>) => {
  const [tabItems, setTabItems] = useState(items);
  const [activeTab, setActiveTab] = useState(0);
  const activeTabRef = useRef(activeTab);
  const [storage, _setStorage] = useState<string[]>(
    Array(items.length).fill('')
  );
  const [highlightedTabs, setHighlightedTabs] = useState<
    Record<number, number | boolean>
  >({});

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    setTabItems(items);
    _setStorage(Array(items.length).fill(''));
  }, [items]);

  const titles = useMemo(() => tabItems.map((item) => item.title), [tabItems]);
  const panel = tabItems[activeTab].content;

  const setStorage = useCallback(
    (data: string, index?: number) => {
      _setStorage((prev) => {
        const next = [...prev];
        const _index = index ?? activeTab;
        const currentData = next[_index].startsWith('{')
          ? JSON.parse(next[_index])
          : next[_index];
        const incomingData = data.startsWith('{') ? JSON.parse(data) : data;

        if (
          typeof incomingData !== typeof currentData ||
          typeof incomingData === 'string'
        ) {
          next[_index] =
            typeof incomingData === 'string'
              ? incomingData
              : JSON.stringify(incomingData);
        } else {
          next[_index] = JSON.stringify({
            ...currentData,
            ...incomingData,
          });
        }

        return next;
      });
    },
    [activeTab]
  );

  const highlightTab = useCallback(
    (tab: number, update: number | boolean = true, increment = false) => {
      if (tab === activeTabRef.current) {
        return;
      }

      setHighlightedTabs((prev) => {
        const next = { ...prev };
        const prevCount = typeof next[tab] === 'number' ? next[tab] : 0;

        next[tab] = increment ? prevCount + 1 : update;
        return next;
      });
    },
    []
  );

  const isTabHighlighted = useCallback(
    (tab: number) => {
      return highlightedTabs?.[tab] ?? false;
    },
    [highlightedTabs]
  );

  useEffect(() => {
    if (highlightedTabs[activeTabRef.current]) {
      setHighlightedTabs((prev) => {
        const next = { ...prev };
        next[activeTabRef.current] = false;
        return next;
      });
    }
  }, [activeTab, highlightTab, highlightedTabs]);

  const shouldAddSpacer = useCallback(
    (index: number) => {
      return Boolean(tabItems[index].addSpacer);
    },
    [tabItems]
  );

  return (
    <TabsContext.Provider
      value={{
        state: {
          activeTab,
          titles,
          panel,
          storage,
        },
        actions: {
          setStorage,
          setActiveTab,
          highlightTab,
          isTabHighlighted,
          shouldAddSpacer,
        },
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
