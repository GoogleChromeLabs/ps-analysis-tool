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
import { createContext } from 'use-context-selector';
import {
  noop,
  type TabCookies,
  type TabFrames,
} from '@ps-analysis-tool/common';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    loading: boolean;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
    returningToSingleTab: boolean;
    isCurrentTabBeingListenedTo: boolean;
    isInspecting: boolean;
    contextInvalidated: boolean;
    canStartInspecting: boolean;
    tabToRead: string | null;
    frameHasCookies: Record<string, boolean>;
  };
  actions: {
    setSelectedFrame: (key: string | null) => void;
    setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
    changeListeningToThisTab: () => void;
    getCookiesSetByJavascript: () => void;
    setContextInvalidated: React.Dispatch<React.SetStateAction<boolean>>;
    setCanStartInspecting: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
    tabFrames: null,
    selectedFrame: null,
    loading: true,
    isCurrentTabBeingListenedTo: false,
    returningToSingleTab: false,
    isInspecting: false,
    contextInvalidated: false,
    canStartInspecting: false,
    tabToRead: null,
    frameHasCookies: {},
  },
  actions: {
    setSelectedFrame: noop,
    changeListeningToThisTab: noop,
    setIsInspecting: noop,
    getCookiesSetByJavascript: noop,
    setContextInvalidated: noop,
    setCanStartInspecting: noop,
  },
};

export default createContext<CookieStoreContext>(initialState);
