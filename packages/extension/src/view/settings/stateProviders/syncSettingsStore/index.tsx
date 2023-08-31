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
import { noop } from '../../../../utils/noop';

/**
 * Internal dependencies.
 */
export interface SettingStoreContext {
  state: {
    allowedNumberOfTabs: string | null;
    stopRequestProcessing: boolean;
  };
  actions: {
    setSettingsInStorage: (key: string, value: any) => void;
  };
}

const initialState: SettingStoreContext = {
  state: {
    allowedNumberOfTabs: null,
    stopRequestProcessing: false,
  },
  actions: {
    setSettingsInStorage: noop,
  },
};

export const Context = createContext<SettingStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );

  const [stopRequestProcessing, setStopRequestProcessing] =
    useState<boolean>(false);

  const intitialSync = useCallback(async () => {
    const currentSettings = await chrome.storage.sync.get();
    setAllowedNumberOfTabs(currentSettings?.allowedNumberOfTabs);
    setStopRequestProcessing(currentSettings?.stopRequestProcessing === 'true');
  }, []);

  const setSettingsInStorage = useCallback(async (key: string, value: any) => {
    const currentSettings = await chrome.storage.sync.get();
    chrome.storage.sync.set({
      ...currentSettings,
      [key]: value,
    });
  }, []);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('allowedNumberOfTabs') &&
        changes['allowedNumberOfTabs']?.newValue
      ) {
        setAllowedNumberOfTabs(changes['allowedNumberOfTabs']?.newValue);
        if (changes['allowedNumberOfTabs']?.newValue === 'single-tab') {
          chrome.tabs.query({}, (tabs) => {
            tabs.map((tab) => {
              chrome.action.setBadgeText({
                tabId: tab?.id,
                text: '',
              });
              return tab;
            });
          });
          await chrome.storage.local.clear();
        }
      }
      if (
        Object.keys(changes).includes('stopRequestProcessing') &&
        changes['stopRequestProcessing']?.newValue
      ) {
        setStopRequestProcessing(
          changes['stopRequestProcessing']?.newValue === 'true'
        );
      }
    },
    []
  );

  useEffect(() => {
    intitialSync();
    chrome.storage.sync.onChanged.addListener(storeChangeListener);
    return () => {
      chrome.storage.sync.onChanged.removeListener(storeChangeListener);
    };
  }, [intitialSync, storeChangeListener]);

  return (
    <Context.Provider
      value={{
        state: {
          allowedNumberOfTabs,
          stopRequestProcessing,
        },
        actions: {
          setSettingsInStorage,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useSettingsStore(): SettingStoreContext;
export function useSettingsStore<T>(
  selector: (state: SettingStoreContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useSettingsStore<T>(
  selector: (state: SettingStoreContext) => T | SettingStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
