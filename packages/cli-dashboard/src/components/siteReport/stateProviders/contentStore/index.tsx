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
import React, { type PropsWithChildren } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';
/**
 * Internal dependencies.
 */
import { CookieData, TechnologyData } from '../../../../types';

export interface ContentStore {
  state: {
    cookies: CookieData[];
    technologies: TechnologyData[] | undefined;
  };
}

const initialState: ContentStore = {
  state: {
    cookies: [],
    technologies: [],
  },
};

export const Context = createContext<ContentStore>(initialState);

interface ContentStoreProviderProps {
  cookies: CookieData[];
  technologies?: TechnologyData[];
}

export const Provider = ({
  cookies,
  technologies,
  children,
}: PropsWithChildren<ContentStoreProviderProps>) => {
  return (
    <Context.Provider
      value={{
        state: {
          cookies,
          technologies,
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
