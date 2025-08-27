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

  const [isObservabilityEnabled, setIsObservabilityEnabled] = useState(false);
  const [
    isObservabilityForSettingsPageDisplay,
    setIsObservabilityForSettingsPageDisplay,
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

  const [observabilityEnabled, setObservabilityEnabled] = useState<
    Record<string, boolean>
  >({
    cookies: false,
    protectedAudience: false,
    attributionReporting: false,
    ipProtection: false,
    scriptBlocking: false,
  });

  const valuesRef = useRef({
    observabilityEnabled,
    isObservabilityEnabled,
  });

  const [observabilityEnabledForDisplay, setObservabilityEnabledForDisplay] =
    useState<Record<string, boolean>>({
      cookies: false,
      protectedAudience: false,
      attributionReporting: false,
      ipProtection: false,
      scriptBlocking: false,
    });

  const intitialSync = useCallback(async () => {
    const sessionStorage = await chrome.storage.session.get();
    const currentSettings = await chrome.storage.sync.get();

    if (Object.keys(sessionStorage).includes('pendingReload')) {
      setSettingsChanged(sessionStorage?.pendingReload);

      if (Object.keys(sessionStorage).includes('isObservabilityEnabled')) {
        setIsObservabilityForSettingsPageDisplay(
          sessionStorage.isObservabilityEnabled
        );
      } else {
        setIsObservabilityForSettingsPageDisplay(
          currentSettings.isObservabilityEnabled
        );
      }

      if (Object.keys(sessionStorage).includes('observabilityPartsStatus')) {
        setObservabilityEnabledForDisplay(
          sessionStorage.observabilityPartsStatus
        );
      } else {
        setObservabilityEnabledForDisplay(
          currentSettings.observabilityPartsStatus
        );
      }
    } else {
      setIsObservabilityForSettingsPageDisplay(
        currentSettings.isObservabilityEnabled
      );
      setObservabilityEnabledForDisplay(
        currentSettings.observabilityPartsStatus
      );
    }

    if (Object.keys(currentSettings).includes('isObservabilityEnabled')) {
      setIsObservabilityEnabled(currentSettings.isObservabilityEnabled);
    }

    if (Object.keys(currentSettings).includes('observabilityPartsStatus')) {
      setObservabilityEnabled(currentSettings.observabilityPartsStatus);
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

  const openIncognitoTab = useCallback(async () => {
    if (!incognitoAccess) {
      return;
    }

    const tabs = await chrome.tabs.query({});

    if (tabs.some((tab) => tab.incognito)) {
      const incognitoTab = tabs.find((tab) => tab.incognito);
      if (incognitoTab) {
        chrome.tabs.create({
          url: 'https://example.com',
          windowId: incognitoTab.windowId,
          active: true,
        });
        chrome.windows.update(incognitoTab.windowId, { focused: true });
        return;
      }
    }

    await chrome.windows.create({
      incognito: true,
      url: 'https://example.com',
    });
  }, [incognitoAccess]);

  useEffect(() => {
    if (navigator.userAgent) {
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

  const _setIsobservability = useCallback(async (newValue: boolean) => {
    setIsObservabilityForSettingsPageDisplay(newValue);
    setObservabilityEnabledForDisplay({
      cookies: newValue,
      protectedAudience: newValue,
      attributionReporting: newValue,
      ipProtection: newValue,
      scriptBlocking: newValue,
    });
    setSettingsChanged(true);
    await chrome.storage.session.set({
      isObservabilityEnabled: newValue,
      observabilityPartsStatus: {
        cookies: newValue,
        protectedAudience: newValue,
        attributionReporting: newValue,
        ipProtection: newValue,
        scriptBlocking: newValue,
      },
      pendingReload: true,
    });
  }, []);

  const storeChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('isObservabilityEnabled') &&
        Object.keys(changes.isObservabilityEnabled).includes('newValue')
      ) {
        setIsObservabilityEnabled(changes?.isObservabilityEnabled?.newValue);
      }
      if (
        Object.keys(changes).includes('observabilityPartsStatus') &&
        Object.keys(changes.observabilityPartsStatus).includes('newValue')
      ) {
        setObservabilityEnabled(changes?.observabilityPartsStatus?.newValue);
      }
    },
    []
  );

  const sessionStoreChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        Object.keys(changes).includes('isObservabilityEnabled') &&
        Object.keys(changes.isObservabilityEnabled).includes('newValue')
      ) {
        setIsObservabilityForSettingsPageDisplay(
          changes.isObservabilityEnabled.newValue
        );
      }

      if (
        Object.keys(changes).includes('observabilityPartsStatus') &&
        Object.keys(changes.observabilityPartsStatus).includes('newValue')
      ) {
        setObservabilityEnabledForDisplay(
          changes?.observabilityPartsStatus?.newValue
        );
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
        setIsObservabilityForSettingsPageDisplay(
          valuesRef.current.isObservabilityEnabled
        );
        setObservabilityEnabledForDisplay(
          valuesRef.current.observabilityEnabled
        );
      }
    },
    []
  );

  useEffect(() => {
    valuesRef.current = { observabilityEnabled, isObservabilityEnabled };
  }, [observabilityEnabled, isObservabilityEnabled]);

  useEffect(() => {
    const allSubSwitchesAreOn =
      observabilityEnabled.cookies &&
      observabilityEnabled.protectedAudience &&
      observabilityEnabled.attributionReporting &&
      observabilityEnabled.ipProtection &&
      observabilityEnabled.scriptBlocking;
    const anySubIsOn =
      observabilityEnabled.cookies ||
      observabilityEnabled.protectedAudience ||
      observabilityEnabled.attributionReporting ||
      observabilityEnabled.ipProtection ||
      observabilityEnabled.scriptBlocking;

    if (allSubSwitchesAreOn) {
      setIsObservabilityForSettingsPageDisplay(true);
    } else if (anySubIsOn) {
      setIsObservabilityForSettingsPageDisplay(true);
    }
  }, [
    isObservabilityEnabled,
    observabilityEnabled.attributionReporting,
    observabilityEnabled.cookies,
    observabilityEnabled.ipProtection,
    observabilityEnabled.protectedAudience,
    observabilityEnabled.scriptBlocking,
  ]);

  const handleObservabilityEnabled = useCallback(
    (key: keyof typeof observabilityEnabled, value: boolean) => {
      setObservabilityEnabledForDisplay((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSettingsChange = useCallback(async () => {
    if (settingsChanged) {
      await chrome.runtime.sendMessage({
        type: SERVICE_WORKER_TABS_RELOAD_COMMAND,
        payload: {
          observabilityPartsStatus: observabilityEnabledForDisplay,
        },
      });

      setSettingsChanged(false);
    }
  }, [observabilityEnabledForDisplay, settingsChanged]);

  useEffect(() => {
    (async () => {
      const session = await chrome.storage.session.get();
      if (!session.pendingReload) {
        return;
      }
      if (
        !isEqual(
          isObservabilityEnabled,
          isObservabilityForSettingsPageDisplay
        ) &&
        !isEqual(observabilityEnabled, observabilityEnabledForDisplay)
      ) {
        setSettingsChanged(true);
      } else {
        setSettingsChanged(false);
        chrome.storage.session.remove([
          'pendingReload',
          'isObservabilityEnabled',
        ]);
      }
    })();
  }, [
    isObservabilityEnabled,
    isObservabilityForSettingsPageDisplay,
    observabilityEnabled,
    observabilityEnabledForDisplay,
  ]);

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
          isObservabilityEnabled,
          settingsChanged,
          isObservabilityForSettingsPageDisplay,
          exceedingLimitations,
          observabilityEnabled,
          observabilityEnabledForDisplay,
        },
        actions: {
          handleObservabilityEnabled,
          setIsObservability: _setIsobservability,
          handleSettingsChange,
          setSettingsChanged,
          setExceedingLimitations,
          setIsObservabilityForSettingsPageDisplay,
          setObservabilityEnabledForDisplay,
          openIncognitoTab,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
