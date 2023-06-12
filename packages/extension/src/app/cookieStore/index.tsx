/**
 * External dependencies.
 */
import { useContextSelector, createContext } from 'use-context-selector';
import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
/**
 * Internal dependencies.
 */
import { StorageValue, CookieStore, empty } from '../../cookieStore';
import { getCurrentTabId } from '../../utils';

export interface ICookieStoreContext {
  state: StorageValue;
  actions: object;
}

const initialState: ICookieStoreContext = {
  state: empty,
  actions: {},
};

export const Context = createContext<ICookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);
  const [state, setState] = useState<StorageValue>(initialState.state);
  const { subscribe, getSnapshot } = CookieStore.getSyncStore(currentTabId);
  const externalState = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    (async () => {
      const tabId = await getCurrentTabId();
      setCurrentTabId(tabId);
      const storage = await chrome.storage.local.get();
      const state = storage[tabId];

      if (state) {
        setState(state);
      }
    })();
  }, []);

  // Sync
  useEffect(() => {
    setState(externalState);
  }, [externalState]);

  return (
    <Context.Provider value={{ state, actions: {} }}>
      {children}
    </Context.Provider>
  );
};

export function useCookieStore(): ICookieStoreContext;
export function useCookieStore<T>(
  selector: (state: ICookieStoreContext) => T
): T;
export function useCookieStore<T>(
  selector: (state: ICookieStoreContext) => T | ICookieStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
