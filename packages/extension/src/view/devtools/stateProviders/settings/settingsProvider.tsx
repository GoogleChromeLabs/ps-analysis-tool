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
import { I18n } from '@google-psat/i18n';
import isEqual from 'lodash-es/isEqual';
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
  const [settingsChanged, setSettingsChanged] = useState<boolean>(false);
  const [exceedingLimitations, setExceedingLimitations] =
    useState<boolean>(false);
  const [incognitoAccess, setIncognitoAccess] = useState<boolean>(false);

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

      if (Object.keys(sessionStorage).includes('isUsingCDP')) {
        setIsUsingCDPForSettingsPageDisplay(sessionStorage.isUsingCDP);
      } else {
        setIsUsingCDPForSettingsPageDisplay(currentSettings.isUsingCDP);
      }
    } else {
      setIsUsingCDPForSettingsPageDisplay(currentSettings.isUsingCDP);
    }

    if (Object.keys(currentSettings).includes('isUsingCDP')) {
      setIsUsingCDP(currentSettings.isUsingCDP);
    }

    chrome.tabs.query({}, (tabs) => {
      setCurrentTabs(tabs.length);
    });

    chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
      setIncognitoAccess(isAllowed);
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

  const reloadExtension = useCallback(() => {
    chrome.runtime.reload();

    const interval = setInterval(() => {
      if (chrome?.runtime?.id) {
        clearInterval(interval);
        globalThis?.location?.reload();
      }
    }, 100);
  }, []);

  const openIncognitoTab = useCallback(async () => {
    if (!incognitoAccess) {
      return;
    }

    const tabs = await chrome.tabs.query({});
    const currentTab = tabs.find(
      (tab) => tab.id === chrome.devtools.inspectedWindow.tabId
    );

    if (tabs.some((tab) => tab.incognito)) {
      const incognitoTab = tabs.find((tab) => tab.incognito);
      if (incognitoTab) {
        chrome.tabs.create({
          url: currentTab?.url,
          windowId: incognitoTab.windowId,
          active: true,
        });
        chrome.windows.update(incognitoTab.windowId, { focused: true });
        return;
      }
    }

    await chrome.windows.create({
      incognito: true,
      url: currentTab?.url,
    });
  }, [incognitoAccess]);

  useEffect(() => {
    //@ts-ignore -- this exists in the browserVersion above 90
    //@see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues
    if (navigator.userAgentData?.getHighEntropyValues) {
      //@ts-ignore -- this exists in the browserVersion above 90
      navigator.userAgentData
        .getHighEntropyValues(['fullVersionList'])
        .then(
          (data: {
            brands: { brand: string; version: string }[];
            fullVersionList: { brand: string; version: string }[];
            platform: string;
            mobile: boolean;
          }) => {
            data.fullVersionList.forEach((versionData) => {
              if (versionData.brand === 'Google Chrome') {
                setBrowserInformation(
                  I18n.getMessage('version') +
                    ' ' +
                    versionData.version +
                    ' ' +
                    data.platform
                );
              }
            });
          }
        );
    } else {
      const browserInfo = /Chrome\/([0-9.]+)/.exec(navigator.userAgent);
      if (browserInfo) {
        setBrowserInformation(
          I18n.getMessage('version') +
            ' ' +
            browserInfo[1] +
            ' ' +
            OSInformation?.split(' ')[1]
        );
      }
    }
  }, [OSInformation]);

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

      if (
        Object.keys(changes).includes('pendingReload') &&
        Object.keys(changes.pendingReload).includes('oldValue') &&
        !Object.keys(changes.pendingReload).includes('newValue')
      ) {
        setIsUsingCDPForSettingsPageDisplay(isUsingCDP);
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

  useEffect(() => {
    if (!isEqual(isUsingCDP, isUsingCDPForSettingsPageDisplay)) {
      setSettingsChanged(true);
    } else {
      setSettingsChanged(false);
      chrome.storage.session.remove(['pendingReload', 'isUsingCDP']);
    }
  }, [isUsingCDP, isUsingCDPForSettingsPageDisplay]);

  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      url,
      tabId,
    }: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
      const isNotTopLevelFrame =
        frameType !== 'outermost_frame' && frameId !== 0;
      const isInternalChromeURL =
        url?.startsWith('chrome') || url?.startsWith('devtools');
      const isNotCurrentTab = tabId !== chrome.devtools.inspectedWindow.tabId;
      if (
        isNotTopLevelFrame ||
        isInternalChromeURL ||
        !url ||
        isNotCurrentTab
      ) {
        return;
      }

      chrome.tabs.query({}, (tabs) => {
        setCurrentTabs(tabs.length);
      });
    },
    []
  );

  useEffect(() => {
    intitialSync();
    chrome.storage?.sync?.onChanged?.addListener(storeChangeListener);
    chrome.storage?.session?.onChanged?.addListener(sessionStoreChangeListener);
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation.onCommitted.addListener(onCommittedNavigationListener);

    return () => {
      chrome.storage?.sync?.onChanged?.removeListener(storeChangeListener);
      chrome.storage?.session?.onChanged?.removeListener(
        sessionStoreChangeListener
      );
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation.onCommitted.removeListener(
        onCommittedNavigationListener
      );
    };
  }, [
    onCommittedNavigationListener,
    intitialSync,
    storeChangeListener,
    sessionStoreChangeListener,
    messagePassingListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: {
          incognitoAccess,
          currentTabs,
          currentExtensions,
          browserInformation,
          PSATVersion,
          OSInformation,
          isUsingCDP,
          settingsChanged,
          isUsingCDPForSettingsPageDisplay,
          exceedingLimitations,
        },
        actions: {
          setIsUsingCDP: _setUsingCDP,
          handleSettingsChange,
          setSettingsChanged,
          setExceedingLimitations,
          setIsUsingCDPForSettingsPageDisplay,
          openIncognitoTab,
          reloadExtension,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
