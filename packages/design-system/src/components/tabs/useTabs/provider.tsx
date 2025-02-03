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
  const [storage, _setStorage] = useState<string[]>(
    Array(items.length).fill('')
  );

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
        },
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
