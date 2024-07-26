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
import { type LibraryData, noop, createContext } from '@google-psat/common';
/**
 * Internal dependencies
 */
import getInitialLibraryData from '../getInitialLibraryData';

export interface LibraryDetectionContext {
  state: {
    libraryMatches: LibraryData;
    isCurrentTabLoading: boolean;
    isInitialDataUpdated: boolean;
    loadedBefore: boolean;
    showLoader: boolean;
    tabId: number;
    errorOccured: boolean;
  };
  actions: {
    setLibraryMatches: React.Dispatch<React.SetStateAction<LibraryData>>;
    setIsCurrentTabLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsInitialDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    setLoadedBeforeState: React.Dispatch<React.SetStateAction<boolean>>;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorOccured: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const initialLibraryMatches: LibraryData = getInitialLibraryData();

const initialState: LibraryDetectionContext = {
  state: {
    libraryMatches: initialLibraryMatches,
    isCurrentTabLoading: false,
    isInitialDataUpdated: false,
    loadedBefore: false,
    showLoader: true,
    tabId: -1,
    errorOccured: false,
  },
  actions: {
    setLibraryMatches: noop,
    setIsCurrentTabLoading: noop,
    setIsInitialDataUpdated: noop,
    setLoadedBeforeState: noop,
    setShowLoader: noop,
    setErrorOccured: noop,
  },
};

const Context = createContext<LibraryDetectionContext>(initialState);
export default Context;
