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
import { createContext, useContextSelector } from 'use-context-selector';
import React, { type PropsWithChildren, useState } from 'react';
import { noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { LibraryData } from '../../types';

export interface LibraryDetectionContext {
  state: {
    libraryMatches: LibraryData;
    isCurrentTabLoading: boolean;
    loadedBefore: boolean;
  };
  actions: {
    setLibraryMatches: React.Dispatch<React.SetStateAction<LibraryData>>;
    setIsCurrentTabLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLoadedBeforeState: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const INITIAL_STATE: LibraryData = {
  gis: {
    signatureMatches: 0,
    matches: [],
  },
  gsiV2: {
    signatureMatches: 0,
    moduleMatch: 0,
    matches: [],
  },
};

const initialState: LibraryDetectionContext = {
  state: {
    libraryMatches: INITIAL_STATE,
    isCurrentTabLoading: false,
    loadedBefore: false,
  },
  actions: {
    setLibraryMatches: noop,
    setIsCurrentTabLoading: noop,
    setLoadedBeforeState: noop,
  },
};

export const Context = createContext<LibraryDetectionContext>(initialState);

export const LibraryDetectionProvider = ({ children }: PropsWithChildren) => {
  const [libraryMatches, setLibraryMatches] =
    useState<LibraryData>(INITIAL_STATE);
  const [isCurrentTabLoading, setIsCurrentTabLoading] =
    useState<boolean>(false);
  const [loadedBefore, setLoadedBeforeState] = useState<boolean>(false);

  return (
    <Context.Provider
      value={{
        state: {
          libraryMatches,
          isCurrentTabLoading,
          loadedBefore,
        },
        actions: {
          setLibraryMatches,
          setIsCurrentTabLoading,
          setLoadedBeforeState,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useLibraryDetectionContext(): LibraryDetectionContext;
export function useLibraryDetectionContext<T>(
  selector: (state: LibraryDetectionContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useLibraryDetectionContext<T>(
  selector: (state: LibraryDetectionContext) => T | LibraryDetectionContext = (
    state
  ) => state
) {
  return useContextSelector(Context, selector);
}
