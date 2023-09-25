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
  useState,
  type PropsWithChildren,
  useRef,
  useEffect,
} from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

/**
 * Internal dependencies.
 */
import { type CookieTableData } from '@cookie-analysis-tool/common';

export interface ContentPanelStore {
  state: {
    selectedFrameCookie: {
      [frame: string]: CookieTableData | null;
    } | null;
    tableColumnSize: number;
    tableContainerRef: React.RefObject<HTMLDivElement>;
  };
  actions: {
    setSelectedFrameCookie: (
      cookie: {
        [frame: string]: CookieTableData | null;
      } | null
    ) => void;
    setTableColumnSize: (size: number) => void;
  };
}

const initialState: ContentPanelStore = {
  state: {
    selectedFrameCookie: null,
    tableColumnSize: 100,
    tableContainerRef: React.createRef<HTMLDivElement>(),
  },
  actions: {
    setSelectedFrameCookie: () => {
      // Do nothing.
    },
    setTableColumnSize: () => {
      // Do nothing.
    },
  },
};

export const Context = createContext<ContentPanelStore>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [selectedFrameCookie, setSelectedFrameCookie] =
    useState<ContentPanelStore['state']['selectedFrameCookie']>(null);

  const [tableColumnSize, setTableColumnSize] = useState(100);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (tableContainerRef.current) {
        setTableColumnSize(tableContainerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setTableColumnSize, tableContainerRef]);

  return (
    <Context.Provider
      value={{
        state: {
          selectedFrameCookie,
          tableColumnSize,
          tableContainerRef,
        },
        actions: {
          setSelectedFrameCookie,
          setTableColumnSize,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useContentPanelStore(): ContentPanelStore;
export function useContentPanelStore<T>(
  selector: (state: ContentPanelStore) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useContentPanelStore<T>(
  selector: (state: ContentPanelStore) => T | ContentPanelStore = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
