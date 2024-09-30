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
import { type PropsWithChildren, useMemo } from 'react';
import {
  type CompleteJson,
  type CookieJsonDataType,
  type CookieTableData,
  useContextSelector,
  createContext,
  type LibraryData,
  reshapeCookies,
} from '@google-psat/common';

export interface ContentStore {
  state: {
    tabCookies: { [key: string]: CookieTableData };
    completeJson: CompleteJson[] | null;
    path: string;
    libraryMatches: LibraryData | null;
  };
}

const initialState: ContentStore = {
  state: {
    tabCookies: {},
    completeJson: null,
    path: '',
    libraryMatches: null,
  },
};

export const Context = createContext<ContentStore>(initialState);

interface ContentStoreProviderProps {
  cookies: {
    [frame: string]: {
      [key: string]: CookieJsonDataType;
    };
  };
  completeJson: CompleteJson[] | null;
  path: string;
  libraryMatches: LibraryData | null;
}

export const Provider = ({
  cookies,
  completeJson,
  children,
  path,
  libraryMatches,
}: PropsWithChildren<ContentStoreProviderProps>) => {
  const tabCookies = useMemo(() => reshapeCookies(cookies), [cookies]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          completeJson,
          path,
          libraryMatches,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useContentStore(): ContentStore;
export function useContentStore<T>(selector: (state: ContentStore) => T): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useContentStore<T>(
  selector: (state: ContentStore) => T | ContentStore = (state) => state
) {
  return useContextSelector(Context, selector);
}
