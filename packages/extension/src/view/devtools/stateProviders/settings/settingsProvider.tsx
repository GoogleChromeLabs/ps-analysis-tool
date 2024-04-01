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
/**
 * Internal dependencies.
 */
import Context, { type SettingsStoreContext } from './context';
import { SERVICE_WORKER_TABS_RELOAD_COMMAND } from '../../../../constants';

enum PLATFORM_OS_MAP {
  mac = 'MacOS',
  win = 'Windows',
  android = 'Android',
  cros = 'Chrome OS',
  linux = 'Linux',
  openbsd = 'OpenBSD',
  fuchsia = 'Fuchsia',
}

const Provider = ({ children }: PropsWithChildren) => {
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
    useState<SettingsStoreContext['state']['currentTabs']>(0);
  const [browserInformation, setBrowserInformation] = useState<string | null>(
    null
  );
  const [PSATVersion, setPSATVersion] =
    useState<SettingsStoreContext['state']['PSATVersion']>(null);
  const [currentExtensions, setCurrentExtensions] =
    useState<SettingsStoreContext['state']['currentExtensions']>(null);
  const [OSInformation, setOSInformation] =
    useState<SettingsStoreContext['state']['OSInformation']>(null);

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

    const manifestData = chrome.runtime.getManifest();
    setPSATVersion(manifestData.version);
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

  const setProcessingMode = useCallback(async (newState: boolean) => {
    const valueToBeSet: boolean | string = newState ? 'unlimited' : 'single';
    setAllowedNumberOfTabsForSettingsPageDisplay(valueToBeSet);
    setSettingsChanged(true);
    await chrome.storage.session.set({
      allowedNumberOfTabs: valueToBeSet,
      pendingReload: true,
    });
  }, []);

  const _setUsingCDP = useCallback(async (newValue: boolean) => {
    setIsUsingCDPForSettingsPageDisplay(newValue);
    setSettingsChanged(true);
    await chrome.storage.session.set({
      isUsingCDP: newValue,
      pendingReload: true,
    });
  }, []);

  const storeChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes?.['allowedNumberOfTabs']?.['newValue']) {
        setAllowedNumberOfTabs(changes?.allowedNumberOfTabs?.newValue);
        setAllowedNumberOfTabsForSettingsPageDisplay(
          changes?.allowedNumberOfTabs?.newValue
        );
      }

      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        setIsUsingCDP(changes?.isUsingCDP?.newValue);
        setIsUsingCDPForSettingsPageDisplay(changes?.isUsingCDP?.newValue);
      }
    },
    []
  );

  const sessionStoreChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes?.['allowedNumberOfTabs']?.['newValue']) {
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
        type: SERVICE_WORKER_TABS_RELOAD_COMMAND,
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
          PSATVersion,
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

export default Provider;
