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
import { noop, type CookiesCount } from '@ps-analysis-tool/common';

export interface CookieStoreContext {
  state: {
    tabCookieStats: CookiesCount | null;
    isCurrentTabBeingListenedTo: boolean;
    loading: boolean;
    returningToSingleTab: boolean;
    tabId: number | null;
    onChromeUrl: boolean;
  };
  actions: {
    changeListeningToThisTab: () => void;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookieStats: {
      total: 0,
      blockedCookies: {
        total: 0,
      },
      firstParty: {
        total: 0,
        functional: 0,
        marketing: 0,
        analytics: 0,
        uncategorized: 0,
      },
      thirdParty: {
        total: 0,
        functional: 0,
        marketing: 0,
        analytics: 0,
        uncategorized: 0,
      },
    },
    isCurrentTabBeingListenedTo: false,
    loading: true,
    returningToSingleTab: false,
    onChromeUrl: false,
    tabId: null,
  },
  actions: {
    changeListeningToThisTab: noop,
  },
};

export default createContext<CookieStoreContext>(initialState);
