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
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { noop } from '@ps-analysis-tool/design-system';
import { useContextSelector, createContext } from '@ps-analysis-tool/common';

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
    isUsingCDP: boolean;
    settingsChanged: boolean;
    allowedNumberOfTabsForSettingsPageDisplay: string | null;
    isUsingCDPForSettingsPageDisplay: boolean;
  };
  actions: {
    setProcessingMode: (newState: boolean) => void;
    setIsUsingCDP: (newValue: boolean) => void;
    handleSettingsChange: () => void;
    setSettingsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const initialState: SettingStoreContext = {
  state: {
    allowedNumberOfTabs: null,
    currentTabs: 0,
    currentExtensions: null,
    browserInformation: null,
    OSInformation: null,
    isUsingCDP: false,
    settingsChanged: false,
    allowedNumberOfTabsForSettingsPageDisplay: null,
    isUsingCDPForSettingsPageDisplay: false,
  },
  actions: {
    setIsUsingCDP: noop,
    setProcessingMode: noop,
    handleSettingsChange: noop,
    setSettingsChanged: noop,
  },
};

export const Context = createContext<SettingStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );
  const [
    allowedNumberOfTabsForSettingsPageDisplay,
    setAllowedNumberOfTabsForSettingsPageDisplay,
  ] = useState<string | null>(null);

  const [settingsChanged, setSettingsChanged] = useState<boolean>(false);

  const [isUsingCDP, setIsUsingCDP] = useState(false);
  const [
    isUsingCDPForSettingsPageDisplay,
    setIsUsingCDPForSettingsPageDisplay,
  ] = useState(false);

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
    const sessionStorage = await chrome.storage.session.get();
    const currentSettings = await chrome.storage.sync.get();

    if (Object.keys(sessionStorage).includes('pendingReload')) {
      setSettingsChanged(sessionStorage?.pendingReload);

      if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
        setAllowedNumberOfTabsForSettingsPageDisplay(
          sessionStorage.allowedNumberOfTabs
        );
      } else {
        setAllowedNumberOfTabsForSettingsPageDisplay(
          currentSettings.allowedNumberOfTabs
        );
      }

      if (Object.keys(sessionStorage).includes('isUsingCDP')) {
        setIsUsingCDPForSettingsPageDisplay(sessionStorage.isUsingCDP);
      } else {
        setIsUsingCDPForSettingsPageDisplay(currentSettings.isUsingCDP);
      }
    } else {
      setAllowedNumberOfTabsForSettingsPageDisplay(
        currentSettings.allowedNumberOfTabs
      );
      setIsUsingCDPForSettingsPageDisplay(currentSettings.isUsingCDP);
    }

    if (Object.keys(currentSettings).includes('allowedNumberOfTabs')) {
      setAllowedNumberOfTabs(currentSettings.allowedNumberOfTabs);
    }

    if (Object.keys(currentSettings).includes('isUsingCDP')) {
      setIsUsingCDP(currentSettings.isUsingCDP);
    }

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

  const setProcessingMode = useCallback((newState: boolean) => {
    const valueToBeSet: boolean | string = newState ? 'unlimited' : 'single';
    setAllowedNumberOfTabsForSettingsPageDisplay(valueToBeSet);
    setSettingsChanged(true);
    chrome.storage.session.set({
      allowedNumberOfTabs: valueToBeSet,
      pendingReload: true,
    });
  }, []);

  const _setUsingCDP = useCallback((newValue: boolean) => {
    setIsUsingCDPForSettingsPageDisplay(newValue);
    setSettingsChanged(true);
    chrome.storage.session.set({
      isUsingCDP: newValue,
      pendingReload: true,
    });
  }, []);

  const storeChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('allowedNumberOfTabs') &&
        Object.keys(changes.allowedNumberOfTabs).includes('newValue')
      ) {
        setAllowedNumberOfTabs(changes?.allowedNumberOfTabs?.newValue);
      }

      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        setIsUsingCDP(changes?.isUsingCDP?.newValue);
      }
    },
    []
  );

  const sessionStoreChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('allowedNumberOfTabs') &&
        Object.keys(changes.allowedNumberOfTabs).includes('newValue')
      ) {
        setAllowedNumberOfTabsForSettingsPageDisplay(
          changes.allowedNumberOfTabs.newValue
        );
      }

      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        setIsUsingCDPForSettingsPageDisplay(changes.isUsingCDP.newValue);
      }

      if (
        Object.keys(changes).includes('pendingReload') &&
        Object.keys(changes.pendingReload).includes('newValue')
      ) {
        setSettingsChanged(changes.pendingReload.newValue);
      }
    },
    []
  );

  const handleSettingsChange = useCallback(async () => {
    if (settingsChanged) {
      await chrome.runtime.sendMessage({
        type: 'DevTools::ServiceWorker::RELOAD_ALL_TABS',
      });

      setSettingsChanged(false);
    }
  }, [settingsChanged]);

  useEffect(() => {
    intitialSync();
    chrome.storage.sync.onChanged.addListener(storeChangeListener);
    chrome.storage.session.onChanged.addListener(sessionStoreChangeListener);

    return () => {
      chrome.storage.sync.onChanged.removeListener(storeChangeListener);
      chrome.storage.session.onChanged.removeListener(
        sessionStoreChangeListener
      );
    };
  }, [intitialSync, storeChangeListener, sessionStoreChangeListener]);

  return (
    <Context.Provider
      value={{
        state: {
          allowedNumberOfTabs,
          currentTabs,
          currentExtensions,
          browserInformation,
          OSInformation,
          isUsingCDP,
          settingsChanged,
          allowedNumberOfTabsForSettingsPageDisplay,
          isUsingCDPForSettingsPageDisplay,
        },
        actions: {
          setProcessingMode,
          setIsUsingCDP: _setUsingCDP,
          handleSettingsChange,
          setSettingsChanged,
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
