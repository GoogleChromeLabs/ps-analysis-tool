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
import { noop } from '@ps-analysis-tool/design-system';
import { CookieStore } from '../../../../localStore';

enum PLATFORM_OS_MAP {
  mac = 'MacOS',
  win = 'Windows',
  android = 'Android',
  cros = 'Chrome OS',
  linux = 'Linux',
  openbsd = 'OpenBSD',
  fuchsia = 'Fuchsia',
}

export interface SettingStoreContext {
  state: {
    allowedNumberOfTabs: string | null;
    currentTabs: number;
    currentExtensions:
      | {
          extensionName: string;
          extensionId: string;
        }[]
      | null;
    browserInformation: string | null;
    OSInformation: string | null;
  };
  actions: {
    setSettingsInStorage: (key: string, value: string) => void;
  };
}

const initialState: SettingStoreContext = {
  state: {
    allowedNumberOfTabs: null,
    currentTabs: 0,
    currentExtensions: null,
    browserInformation: null,
    OSInformation: null,
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
  const [currentTabs, setCurrentTabs] =
    useState<SettingStoreContext['state']['currentTabs']>(0);
  const [browserInformation, setBrowserInformation] = useState<string | null>(
    null
  );
  const [currentExtensions, setCurrentExtensions] =
    useState<SettingStoreContext['state']['currentExtensions']>(null);
  const [OSInformation, setOSInformation] =
    useState<SettingStoreContext['state']['OSInformation']>(null);

  const intitialSync = useCallback(async () => {
    const currentSettings = await chrome.storage.sync.get();

    setAllowedNumberOfTabs(currentSettings?.allowedNumberOfTabs);

    chrome.tabs.query({}, (tabs) => {
      setCurrentTabs(tabs.length);
    });

    chrome.management.getAll((extensions) => {
      const extensionJSON = [];
      // Iterate over the extensions
      for (let i = 0; i < extensions.length; i++) {
        if (extensions[i].enabled) {
          extensionJSON.push({
            extensionName: extensions[i].name,
            extensionId: extensions[i].id,
          });
        }
      }
      setCurrentExtensions(extensionJSON);
    });

    chrome.runtime.getPlatformInfo((platfrom) => {
      setOSInformation(`${PLATFORM_OS_MAP[platfrom.os]} (${platfrom.arch})`);
    });
  }, []);

  useEffect(() => {
    if (navigator.userAgent) {
      const browserInfo = /Chrome\/([0-9.]+)/.exec(navigator.userAgent);
      if (browserInfo) {
        setBrowserInformation(
          'Version ' + browserInfo[1] + ' ' + OSInformation?.split(' ')[1]
        );
      }
    }
  }, [OSInformation]);

  const setSettingsInStorage = useCallback(
    async (key: string, value: string) => {
      const currentSettings = await chrome.storage.sync.get();

      chrome.storage.sync.set({
        ...currentSettings,
        [key]: value,
      });
    },
    []
  );

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('allowedNumberOfTabs') &&
        changes['allowedNumberOfTabs']?.newValue
      ) {
        setAllowedNumberOfTabs(changes['allowedNumberOfTabs']?.newValue);

        if (changes['allowedNumberOfTabs']?.newValue === 'single') {
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              chrome.action.setBadgeText({
                tabId: tab?.id,
                text: '',
              });
            });
          });

          await chrome.storage.local.clear();
        } else {
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(async (tab) => {
              if (!tab.id) {
                return;
              }
              await CookieStore.addTabData(tab.id?.toString());
              await chrome.tabs.reload(tab?.id);
            });
          });
        }
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
          currentTabs,
          currentExtensions,
          browserInformation,
          OSInformation,
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
