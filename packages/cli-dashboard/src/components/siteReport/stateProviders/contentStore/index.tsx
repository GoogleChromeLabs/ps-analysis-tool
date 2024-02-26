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
import React, { type PropsWithChildren, useMemo } from 'react';
import {
  type CompleteJson,
  type CookieJsonDataType,
  type CookieTableData,
  type TechnologyData,
  useContextSelector,
  createContext,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import reshapeCookies from '../../../utils/reshapeCookies';

export interface ContentStore {
  state: {
    tabCookies: { [key: string]: CookieTableData };
    technologies: TechnologyData[] | undefined;
    completeJson: CompleteJson[] | null;
  };
}

const initialState: ContentStore = {
  state: {
    tabCookies: {},
    technologies: [],
    completeJson: null,
  },
};

export const Context = createContext<ContentStore>(initialState);

interface ContentStoreProviderProps {
  cookies: {
    [frame: string]: {
      [key: string]: CookieJsonDataType;
    };
  };
  technologies?: TechnologyData[];
  completeJson: CompleteJson[] | null;
}

export const Provider = ({
  cookies,
  technologies,
  completeJson,
  children,
}: PropsWithChildren<ContentStoreProviderProps>) => {
  const tabCookies = useMemo(() => reshapeCookies(cookies), [cookies]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          technologies,
          completeJson,
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
