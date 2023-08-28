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
import { useContextSelector, createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../../../../localStore';
import type { TabCookies, TabFrames } from '../../cookies.types';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
  };
  actions: {
    setSelectedFrame: React.Dispatch<React.SetStateAction<string | null>>;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
    tabFrames: null,
    selectedFrame: null,
  },
  actions: {
    setSelectedFrame: () => undefined,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabCookies, setTabCookies] =
    useState<CookieStoreContext['state']['tabCookies']>(null);

  const [selectedFrame, setSelectedFrame] =
    useState<CookieStoreContext['state']['selectedFrame']>(null);

  const [tabUrl, setTabUrl] =
    useState<CookieStoreContext['state']['tabUrl']>(null);
  const [tabFrames, setTabFrames] =
    useState<CookieStoreContext['state']['tabFrames']>(null);

  const getAllFramesForCurrentTab = useCallback(
    async (_tabId: number | null) => {
      if (!_tabId) {
        return;
      }
      const regexForFrameUrl =
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;
      const currentTabFrames = await chrome.webNavigation.getAllFrames({
        tabId: _tabId,
      });

      setTabFrames((prevState) => {
        const modifiedTabFrames: {
          [key: string]: { frameIds: number[] };
        } = {
          ...prevState,
        };

        currentTabFrames?.forEach(({ url, frameId }) => {
          if (url && url.includes('http')) {
            const parsedUrl = regexForFrameUrl.exec(url);
            if (parsedUrl && parsedUrl[0]) {
              if (modifiedTabFrames[parsedUrl[0]]) {
                modifiedTabFrames[parsedUrl[0]].frameIds.push(frameId);
              } else {
                modifiedTabFrames[parsedUrl[0]] = { frameIds: [frameId] };
              }
            }
          }
        });

        return modifiedTabFrames;
      });
    },
    []
  );

  const intitialSync = useCallback(async () => {
    const _tabId = chrome.devtools.inspectedWindow.tabId;
    await getAllFramesForCurrentTab(_tabId);
    setTabId(_tabId);

    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];

    if (tabData && tabData.cookies) {
      const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
        {};

      await Promise.all(
        Object.entries(tabData.cookies as { [key: string]: CookieData }).map(
          async ([key, value]: [string, CookieData]) => {
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isCookieSet,
            };
          }
        )
      );

      setTabCookies(_cookies);
    }

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabUrl(result);
        }
      }
    );
  }, [getAllFramesForCurrentTab]);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        tabId &&
        Object.keys(changes).includes(tabId.toString()) &&
        changes[tabId.toString()]?.newValue?.cookies
      ) {
        const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
          {};

        await Promise.all(
          Object.entries(
            changes[tabId.toString()].newValue.cookies as {
              [key: string]: CookieData;
            }
          ).map(async ([key, value]) => {
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isCookieSet,
            };
          })
        );
        await getAllFramesForCurrentTab(tabId);
        setTabCookies(_cookies);
      }
    },
    [tabId, getAllFramesForCurrentTab]
  );

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        setTabUrl(changeInfo.url);
        setSelectedFrame(null);
        setTabFrames(null);
        await getAllFramesForCurrentTab(_tabId);
      }
    },
    [tabId, getAllFramesForCurrentTab]
  );

  useEffect(() => {
    intitialSync();
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    };
  }, [intitialSync, storeChangeListener, tabUpdateListener]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          tabUrl,
          tabFrames,
          selectedFrame,
        },
        actions: { setSelectedFrame },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCookieStore(): CookieStoreContext;
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T | CookieStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
