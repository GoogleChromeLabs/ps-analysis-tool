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
import {
  noop,
  createContext,
  type TabCookies,
  type TabFrames,
} from '@google-psat/common';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    loading: boolean;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
    isInspecting: boolean;
    contextInvalidated: boolean;
    canStartInspecting: boolean;
    frameHasCookies: Record<string, boolean> | null;
  };
  actions: {
    setSelectedFrame: (key: string | null) => void;
    setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
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
    isInspecting: false,
    contextInvalidated: false,
    canStartInspecting: false,
    frameHasCookies: null,
  },
  actions: {
    setSelectedFrame: noop,
    setIsInspecting: noop,
    getCookiesSetByJavascript: noop,
    setContextInvalidated: noop,
    setCanStartInspecting: noop,
  },
};

export default createContext<CookieStoreContext>(initialState);
