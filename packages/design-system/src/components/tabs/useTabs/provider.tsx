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
import ProgressBar from '../../progressBar';

export const TabsProvider = ({
  children,
  items,
  isGroup = true,
  name,
  independentGroups = false,
}: PropsWithChildren<TabsProviderProps>) => {
  const [groupedItems, setGroupedItems] = useState<TabItems>({});
  const [expandedGroups, setExpandedGroups] = useState<{
    [group: string]: boolean;
  }>({});

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

  useEffect(() => {
    const initialExpandedGroups: { [group: string]: boolean } = {};

    Object.keys(groupedItems).forEach((group, index) => {
      initialExpandedGroups[group] = independentGroups ? true : index === 0;
    });

    setExpandedGroups(initialExpandedGroups);
  }, [groupedItems, independentGroups]);

  const [activeGroup, _setActiveGroup] = useState<string | null>(
    isGroup ? Object.keys(items)[0] ?? null : null
  );
  const [activeTab, setActiveTab] = useState(0);

  const groupItemsRef = useRef(groupedItems);

  useEffect(() => {
    groupItemsRef.current = groupedItems;
  }, [groupedItems]);

  useEffect(() => {
    _setActiveGroup((prev) =>
      prev === null ? Object.keys(groupItemsRef.current)[0] ?? null : prev
    );
  }, []);

  const setActiveGroup = useCallback((group: string) => {
    _setActiveGroup(group);

    const keys = Object.keys(groupItemsRef.current);
    let index = 0;
    let tabIndex = 0;

    while (index < keys.length && keys[index] !== group) {
      tabIndex += groupItemsRef.current[keys[index]]?.length || 0;
      index++;
    }

    setActiveTab(tabIndex);
  }, []);

  const setExpandedGroup = useCallback(
    (group: string) => {
      if (independentGroups) {
        setExpandedGroups((prev) => ({
          ...prev,
          [group]: !prev[group],
        }));
      } else {
        setExpandedGroups((prev) => {
          const next = Object.keys(prev).reduce<{ [group: string]: boolean }>(
            (acc, key) => {
              acc[key] = key === group ? !prev[key] : false;
              return acc;
            },
            {}
          );

          return next;
        });
      }
    },
    [independentGroups]
  );

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

  const [loading, setLoading] = useState(true);

  const titles = useMemo(() => tabItems.map((item) => item.title), [tabItems]);
  const panel = loading
    ? {
        Element: ProgressBar,
      }
    : tabItems?.[activeTab]?.content ?? {
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
      if (tab === activeTab) {
        return;
      }

      setHighlightedTabs((prev) => {
        const next = { ...prev };
        const prevCount = typeof next[tab] === 'number' ? next[tab] : 0;

        next[tab] = increment ? prevCount + 1 : update;
        return next;
      });
    },
    [activeTab]
  );

  const isTabHighlighted = useCallback(
    (tab: number) => {
      return highlightedTabs?.[tab] ?? false;
    },
    [highlightedTabs]
  );

  useEffect(() => {
    if (highlightedTabs[activeTab]) {
      setHighlightedTabs((prev) => {
        const next = { ...prev };
        next[activeTab] = false;
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
      setActiveTab(0);
      setLoading(false);
      return;
    }

    (async () => {
      const sessionStorage = (await getSessionStorage('tabs')) || {};

      if (!sessionStorage[name]) {
        sessionStorage[name] = {
          activeTab: 0,
          activeGroup: 0,
        };
      }

      const _activeTab = sessionStorage[name].activeTab || 0;
      const _activeGroup =
        sessionStorage[name].activeGroup ||
        Object.keys(groupItemsRef.current)[0];

      setActiveGroup(_activeGroup);
      setActiveTab(_activeTab);
      setLoading(false);
    })();
  }, [name, setActiveGroup]);

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
          expandedGroups,
          independentGroups,
          titles,
          panel,
          storage,
          isGroup,
          loading,
        },
        actions: {
          setStorage,
          setActiveTab,
          setActiveGroup,
          setExpandedGroup,
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
