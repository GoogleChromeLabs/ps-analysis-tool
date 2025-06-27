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
import { getSessionStorage, updateSessionStorage } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import type { TabItems, TabsProviderProps } from './types';
import { TabsContext, TabsStoreContext } from './context';

export const TabsProvider = ({
  children,
  items,
  isGroup = true,
  name,
}: PropsWithChildren<TabsProviderProps>) => {
  const [groupedItems, setGroupedItems] = useState<TabItems>({});

  useEffect(() => {
    if (!isGroup && Array.isArray(items)) {
      setGroupedItems(
        items.reduce<TabItems>((acc, item, index) => {
          acc[`group-${index}`] = [item];

          return acc;
        }, {})
      );
    } else {
      setGroupedItems(items as TabItems);
    }
  }, [isGroup, items]);

  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  useEffect(() => {
    setActiveGroup((prev) =>
      prev === null ? Object.keys(groupedItems)[0] ?? null : prev
    );
  }, [groupedItems]);

  const [activeTab, _setActiveTab] = useState(0);
  const activeTabRef = useRef(activeTab);
  const groupItemsRef = useRef(groupedItems);

  useEffect(() => {
    groupItemsRef.current = groupedItems;
  }, [groupedItems]);

  const setActiveTab = useCallback((tab: number) => {
    activeTabRef.current = tab;
    _setActiveTab(tab);

    let trackedIndex = 0;
    const group = Object.entries(groupItemsRef.current).find(([, _items]) => {
      const groupTitles = _items.map((item) => {
        return {
          title: item.title,
          index: trackedIndex++,
        };
      });

      return groupTitles.some(({ index }) => index === tab);
    });

    if (group) {
      setActiveGroup(group[0]);
    } else {
      setActiveGroup(null);
    }
  }, []);

  const tabItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  const [storage, _setStorage] = useState<string[]>(
    Array(tabItems.length).fill('')
  );
  const [highlightedTabs, setHighlightedTabs] = useState<
    Record<number, number | boolean>
  >({});

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    _setStorage(Array(tabItems.length).fill(''));
  }, [tabItems.length]);

  const groupedTitles = useMemo(() => {
    let trackedIndex = 0;

    return Object.entries(groupedItems).reduce<
      TabsStoreContext['state']['groupedTitles']
    >((acc, [group, _items]) => {
      const groupTitles = _items.map((item) => {
        return {
          title: item.title,
          index: trackedIndex++,
        };
      });

      return { ...acc, [group]: groupTitles };
    }, {});
  }, [groupedItems]);

  const titles = useMemo(() => tabItems.map((item) => item.title), [tabItems]);
  const panel = tabItems?.[activeTab]?.content ?? {
    Element: null,
  };

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
      return Boolean(tabItems[index]?.addSpacer);
    },
    [tabItems]
  );

  const getTabGroup = useCallback(
    (tab: number) => {
      let group = '';
      let tracker = 0;

      Object.entries(groupedItems).forEach(([groupKey, data]) => {
        if (group) {
          return;
        }

        if (tracker + data.length < tab + 1) {
          tracker += data.length;
        } else {
          group = groupKey;

          return;
        }
      });

      return group;
    },
    [groupedItems]
  );

  useEffect(() => {
    if (!name) {
      return;
    }

    (async () => {
      const sessionStorage = await getSessionStorage('tabs');

      const _activeTab = sessionStorage[name].activeTab || 0;
      const _activeGroup = sessionStorage[name].activeGroup || null;
      setActiveTab(_activeTab);
      setActiveGroup(_activeGroup);
    })();
  }, [name, setActiveTab, setActiveGroup]);

  useEffect(() => {
    if (!name) {
      return;
    }

    (async () => {
      await updateSessionStorage(
        {
          [name]: {
            activeTab,
            activeGroup,
          },
        },
        'tabs'
      );
    })();
  }, [name, activeTab, activeGroup]);

  return (
    <TabsContext.Provider
      value={{
        state: {
          activeTab,
          activeGroup,
          groupedTitles,
          titles,
          panel,
          storage,
          isGroup,
        },
        actions: {
          setStorage,
          setActiveTab,
          highlightTab,
          isTabHighlighted,
          shouldAddSpacer,
          getTabGroup,
        },
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
