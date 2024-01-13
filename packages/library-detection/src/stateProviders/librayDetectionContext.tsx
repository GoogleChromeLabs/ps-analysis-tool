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
 * External dependencies
 */
import React from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

/**
 * Internal dependencies.
 */
import type { Config } from '../types';

export interface LibraryDetectionStoreContext {
  state: {
    [resources: string]: object;
  };
  actions: {
    setResources: () => Promise<void>;
  };
}

interface ProviderProps {
  children: React.ReactNode | undefined;
  config: Config;
}

const initialState = {
  state: {
    resources: {},
  },
  actions: {
    setResources: () => Promise.resolve(),
  },
};

export const Context =
  createContext<LibraryDetectionStoreContext['state']>(initialState);

export const Provider = ({ children, config }: ProviderProps) => {
  return (
    <Context.Provider
      value={{
        state: {
          config,
        },
        actions: {},
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useLibraryDetection(): LibraryDetectionStoreContext;
export function useLibraryDetection<T>(
  selector: (state: LibraryDetectionStoreContext) => T
): T;

/**
 * Table Persistent Settings store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useLibraryDetection<T>(
  selector: (
    state: LibraryDetectionStoreContext
  ) => T | LibraryDetectionStoreContext = (state) => state
) {
  return useContextSelector(Context, selector);
}
