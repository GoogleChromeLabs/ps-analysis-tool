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
  useRef,
} from 'react';
import isEqual from 'lodash-es/isEqual';
/**
 * Internal dependencies
 */
import Context from './context';
import { SERVICE_WORKER_TABS_RELOAD_COMMAND } from '../../../../constants';

const Provider = ({ children }: PropsWithChildren) => {
  const [settingsChanged, setSettingsChanged] = useState<boolean>(false);
  const [exceedingLimitations, setExceedingLimitations] =
    useState<boolean>(false);

  const [isUsingCDP, _setIsUsingCDP] = useState(false);
  const initialSyncDone = useRef(false);
  const [isUsingCDPForSettingsDisplay, setIsUsingCDPForSettingsDisplay] =
    useState(false);

  const intitialSync = useCallback(async () => {
    const sessionStorage = await chrome.storage.session.get();
    const currentSettings = await chrome.storage.sync.get();

    if (Object.keys(sessionStorage).includes('pendingReload')) {
      setSettingsChanged(sessionStorage?.pendingReload);

      if (Object.keys(sessionStorage).includes('isUsingCDP')) {
        setIsUsingCDPForSettingsDisplay(sessionStorage.isUsingCDP);
      } else {
        setIsUsingCDPForSettingsDisplay(currentSettings.isUsingCDP);
      }
    } else {
      setIsUsingCDPForSettingsDisplay(currentSettings.isUsingCDP);
    }

    if (Object.keys(currentSettings).includes('isUsingCDP')) {
      _setIsUsingCDP(currentSettings.isUsingCDP);
    }
    initialSyncDone.current = true;
  }, []);

  const setUsingCDP = useCallback(
    async (newValue: boolean) => {
      if (isEqual(newValue, isUsingCDP)) {
        setIsUsingCDPForSettingsDisplay(newValue);
        return;
      }

      setIsUsingCDPForSettingsDisplay(newValue);
      await chrome.storage.session.set({
        isUsingCDP: newValue,
        pendingReload: true,
      });
    },
    [isUsingCDP]
  );

  const sessionStoreChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        setIsUsingCDPForSettingsDisplay(changes?.isUsingCDP?.newValue);
        setSettingsChanged(true);
      }
      if (
        Object.keys(changes).includes('pendingReload') &&
        Object.keys(changes.pendingReload).includes('oldValue') &&
        !Object.keys(changes.pendingReload).includes('newValue')
      ) {
        setIsUsingCDPForSettingsDisplay(isUsingCDP);
      }
    },
    [isUsingCDP]
  );

  const handleSettingsChange = useCallback(async () => {
    if (settingsChanged) {
      await chrome.runtime.sendMessage({
        type: SERVICE_WORKER_TABS_RELOAD_COMMAND,
      });
      setSettingsChanged(false);
    }
  }, [settingsChanged]);

  const changeSyncStorageListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('isUsingCDP') &&
        Object.keys(changes.isUsingCDP).includes('newValue')
      ) {
        _setIsUsingCDP(changes?.isUsingCDP?.newValue);
      }
    },
    []
  );

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        exceedingLimitations?: boolean;
      };
    }) => {
      if (!message.type) {
        return;
      }

      if (!['EXCEEDING_LIMITATION_UPDATE'].includes(message.type)) {
        return;
      }

      const incomingMessageType = message.type;

      if (
        incomingMessageType === 'EXCEEDING_LIMITATION_UPDATE' &&
        typeof message?.payload?.exceedingLimitations !== 'undefined'
      ) {
        setExceedingLimitations(message.payload.exceedingLimitations);
      }
    },
    []
  );

  useEffect(() => {
    if (!initialSyncDone.current) {
      return;
    }

    if (!isEqual(isUsingCDP, isUsingCDPForSettingsDisplay)) {
      setSettingsChanged(true);
    } else {
      setSettingsChanged(false);
      chrome.storage.session.remove(['pendingReload', 'isUsingCDP']);
    }
  }, [isUsingCDP, isUsingCDPForSettingsDisplay]);

  useEffect(() => {
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    chrome.storage.session.onChanged.addListener(sessionStoreChangeListener);
    chrome.runtime?.onMessage?.addListener(messagePassingListener);

    return () => {
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
      chrome.storage.session.onChanged.removeListener(
        sessionStoreChangeListener
      );
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
    };
  }, [
    changeSyncStorageListener,
    sessionStoreChangeListener,
    messagePassingListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: {
          isUsingCDP,
          settingsChanged,
          isUsingCDPForSettingsDisplay,
          exceedingLimitations,
        },
        actions: {
          setUsingCDP,
          handleSettingsChange,
          setSettingsChanged,
          setExceedingLimitations,
          setIsUsingCDPForSettingsDisplay,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
