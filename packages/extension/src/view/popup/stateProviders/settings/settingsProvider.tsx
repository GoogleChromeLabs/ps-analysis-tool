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
 * Internal dependencies
 */
import Context from './context';
import { SERVICE_WORKER_TABS_RELOAD_COMMAND } from '../../../../constants';

const Provider = ({ children }: PropsWithChildren) => {
  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );
  const [
    allowedNumberOfTabsForSettingsDisplay,
    setAllowedNumberOfTabsForSettingsDisplay,
  ] = useState<string | null>(null);

  const [settingsChanged, _setSettingsChanged] = useState<boolean>(false);

  const [isUsingCDP, _setIsUsingCDP] = useState(false);
  const [isUsingCDPForSettingsDisplay, setIsUsingCDPForSettingsDisplay] =
    useState(false);

  const intitialSync = useCallback(async () => {
    const sessionStorage = await chrome.storage.session.get();
    const currentSettings = await chrome.storage.sync.get();

    if (Object.keys(sessionStorage).includes('pendingReload')) {
      _setSettingsChanged(sessionStorage?.pendingReload);

      if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
        setAllowedNumberOfTabsForSettingsDisplay(
          sessionStorage.allowedNumberOfTabs
        );
      } else {
        setAllowedNumberOfTabsForSettingsDisplay(
          currentSettings.allowedNumberOfTabs
        );
      }

      if (Object.keys(sessionStorage).includes('isUsingCDP')) {
        setIsUsingCDPForSettingsDisplay(sessionStorage.isUsingCDP);
      } else {
        setIsUsingCDPForSettingsDisplay(currentSettings.isUsingCDP);
      }
    } else {
      setAllowedNumberOfTabsForSettingsDisplay(
        currentSettings.allowedNumberOfTabs
      );
      setIsUsingCDPForSettingsDisplay(currentSettings.isUsingCDP);
    }

    if (Object.keys(currentSettings).includes('allowedNumberOfTabs')) {
      setAllowedNumberOfTabs(currentSettings.allowedNumberOfTabs);
    }

    if (Object.keys(currentSettings).includes('isUsingCDP')) {
      _setIsUsingCDP(currentSettings.isUsingCDP);
    }
  }, []);

  const setUsingCDP = useCallback((newValue: boolean) => {
    setIsUsingCDPForSettingsDisplay(newValue);
    chrome.storage.session.set({
      isUsingCDP: newValue,
      pendingReload: true,
    });
  }, []);

  const sessionStoreChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('allowedNumberOfTabs') &&
        Object.keys(changes.allowedNumberOfTabs).includes('newValue')
      ) {
        setAllowedNumberOfTabs(changes?.allowedNumberOfTabs?.newValue);
        _setSettingsChanged(true);
      }

      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        _setIsUsingCDP(changes?.isUsingCDP?.newValue);
        _setSettingsChanged(true);
      }
    },
    []
  );

  const handleSettingsChange = useCallback(async () => {
    if (settingsChanged) {
      await chrome.runtime.sendMessage({
        type: SERVICE_WORKER_TABS_RELOAD_COMMAND,
      });
      _setSettingsChanged(false);
    }
  }, [settingsChanged]);

  const changeSyncStorageListener = useCallback(
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
        _setIsUsingCDP(changes?.isUsingCDP?.newValue);
      }
    },
    []
  );

  const setSettingsChanged = useCallback((newValue: boolean) => {
    _setSettingsChanged(newValue);
  }, []);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  useEffect(() => {
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    chrome.storage.session.onChanged.addListener(sessionStoreChangeListener);

    return () => {
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
      chrome.storage.session.onChanged.removeListener(
        sessionStoreChangeListener
      );
    };
  }, [changeSyncStorageListener, sessionStoreChangeListener]);

  return (
    <Context.Provider
      value={{
        state: {
          allowedNumberOfTabs,
          isUsingCDP,
          settingsChanged,
          allowedNumberOfTabsForSettingsDisplay,
          isUsingCDPForSettingsDisplay,
        },
        actions: {
          setUsingCDP,
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
