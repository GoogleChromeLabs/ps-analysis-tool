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
  useMemo,
  useRef,
} from 'react';
import { isEqual } from 'lodash-es';
import type {
  PrebidDebugModuleConfig,
  PrebidDebugModuleConfigRule,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Context, { type PrebidContextType } from './context';
import type { PrebidEvents } from '../../../../store';
import { PREBID_EVENTS, STORE_RULES_TOGGLE } from '../../../../constants';
import firstDifferent from '../../../../utils/firstDifferent';
import { replaceRuleTargets, matchRuleTargets } from './constants';

const Provider = ({ children }: PropsWithChildren) => {
  const [prebidAuctionEvents, setPrebidAuctionEvents] = useState<
    PrebidContextType['state']['prebidAuctionEvents']
  >({});

  const [prebidExists, setPrebidExists] =
    useState<PrebidContextType['state']['prebidExists']>(null);

  const [config, setConfig] = useState<PrebidContextType['state']['config']>(
    {}
  );

  const [errorEvents, setErrorEvents] = useState<
    PrebidContextType['state']['errorEvents']
  >([]);

  const [prebidNoBids, setPrebidNoBids] = useState<
    PrebidContextType['state']['prebidNoBids']
  >({});

  const [prebidReceivedBids, setPrebidReceivedBids] = useState<
    PrebidContextType['state']['prebidReceivedBids']
  >([]);

  const [installedModules, setInstalledModules] = useState<
    PrebidContextType['state']['installedModules']
  >([]);

  const [pbjsNamespace, setPBJSNamespace] =
    useState<PrebidContextType['state']['pbjsNamespace']>('');

  const [prebidAdUnits, setPrebidAdUnits] = useState<
    PrebidContextType['state']['prebidAdUnits']
  >({});

  const [versionInfo, setPrebidVersionInfo] =
    useState<PrebidContextType['state']['versionInfo']>('');

  const [debuggingModuleConfig, setDebuggingModuleConfig] =
    useState<PrebidDebugModuleConfig>({
      enabled: false,
      intercept: [],
    });

  const initialStateFetched = useRef(false);

  const [storeRulesInLocalStorage, setStoreRulesInLocalStorage] =
    useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(STORE_RULES_TOGGLE, (result) => {
      const checked = result ? result[STORE_RULES_TOGGLE] : false;
      setStoreRulesInLocalStorage(checked);
    });
  }, []);

  const handleChangeStoreRulesInLocalStorage = useCallback((value: boolean) => {
    chrome.storage.local.set({ [STORE_RULES_TOGGLE]: value });
    setStoreRulesInLocalStorage(value);
  }, []);

  const handleWriteRulesToStorage = useCallback(
    async (input: PrebidDebugModuleConfig) => {
      setDebuggingModuleConfig(input);

      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (!pbjsNamespace) {
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId },
        func: (namespace: string, _input: object) => {
          sessionStorage.setItem(
            `__${namespace}_debugging__`,
            `${JSON.stringify(_input)}`
          );
        },
        args: [pbjsNamespace, input],
      });

      if (!storeRulesInLocalStorage) {
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId },
        func: (namespace: string, _input: object) => {
          localStorage.setItem(
            `__${namespace}_debugging__`,
            `${JSON.stringify(_input)}`
          );
        },
        args: [pbjsNamespace, input],
      });
    },
    [pbjsNamespace, storeRulesInLocalStorage]
  );

  const openGoogleManagerConsole = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    await chrome.scripting.executeScript({
      target: { tabId },
      //@ts-ignore
      func: () => googletag.cmd.push(() => googletag.openConsole()),
      world: 'MAIN',
    });
  }, []);

  useEffect(() => {
    if (!initialStateFetched.current) {
      return;
    }

    handleWriteRulesToStorage(debuggingModuleConfig);
  }, [debuggingModuleConfig, handleWriteRulesToStorage]);

  const getInitialState = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    if (!pbjsNamespace) {
      initialStateFetched.current = true;
      return;
    }

    let [first] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (namespace: string) =>
        sessionStorage.getItem(`__${namespace}_debugging__`),
      args: [pbjsNamespace],
    });

    if (!first || !first.result) {
      [first] = await chrome.scripting.executeScript({
        target: { tabId },
        func: (namespace: string) =>
          localStorage.getItem(`__${namespace}_debugging__`),
        args: [pbjsNamespace],
      });
    }

    if (!first || !first.result) {
      initialStateFetched.current = true;
      return;
    }

    const savedConfig: PrebidDebugModuleConfig = JSON.parse(first.result);
    setDebuggingModuleConfig(savedConfig);
    handleWriteRulesToStorage(savedConfig);
    initialStateFetched.current = true;
  }, [pbjsNamespace, handleWriteRulesToStorage]);

  useEffect(() => {
    getInitialState();
  }, [getInitialState]);

  const addRule = useCallback(
    (
      ruleWhen: PrebidDebugModuleConfigRule,
      ruleType: 'when' | 'then',
      ruleIndex: number
    ) => {
      const targetsToUse =
        ruleType === 'then' ? replaceRuleTargets : matchRuleTargets;

      const newMatchRuleTarget = firstDifferent(
        targetsToUse.map(({ value }) => value),
        Object.keys(ruleWhen)
      );

      if (!newMatchRuleTarget) {
        return;
      }

      setDebuggingModuleConfig((prevState) => {
        const newState = structuredClone(prevState);
        newState.intercept[ruleIndex][ruleType] = {
          ...newState.intercept[ruleIndex][ruleType],
          [newMatchRuleTarget]: '',
        };
        return newState;
      });
    },
    []
  );

  const changeRule = useCallback(
    (
      ruleKey: string,
      ruleType: 'when' | 'then',
      ruleIndex: number,
      newValue: any,
      _delete = false
    ) => {
      if (_delete) {
        setDebuggingModuleConfig((prevState) => {
          const newState = structuredClone(prevState);
          delete newState.intercept[ruleIndex][ruleType][ruleKey];
          return newState;
        });
        return;
      }

      setDebuggingModuleConfig((prevState) => {
        const newState = structuredClone(prevState);
        newState.intercept[ruleIndex][ruleType][ruleKey] = newValue;
        return newState;
      });
    },
    []
  );

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: number;
        prebidEvents: PrebidEvents;
      };
    }) => {
      if (![PREBID_EVENTS].includes(message.type)) {
        return;
      }

      if (!message.type) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;
      if (
        incomingMessageType === PREBID_EVENTS &&
        typeof message.payload.prebidEvents !== 'undefined'
      ) {
        if (tabId.toString() === message.payload.tabId.toString()) {
          setPrebidExists(message.payload.prebidEvents.prebidExists);
          if (!message.payload.prebidEvents.prebidExists) {
            return;
          }
          setConfig((prev) => {
            return isEqual(message.payload.prebidEvents.config, prev)
              ? prev
              : message.payload.prebidEvents.config;
          });
          setErrorEvents(message.payload.prebidEvents.errorEvents);
          setInstalledModules(message.payload.prebidEvents.installedModules);
          setPBJSNamespace(message.payload.prebidEvents.pbjsNamespace);
          setPrebidAdUnits(message.payload.prebidEvents.adUnits);
          setPrebidAuctionEvents(message.payload.prebidEvents.auctionEvents);
          setPrebidNoBids(message.payload.prebidEvents.noBids);
          setPrebidReceivedBids(message.payload.prebidEvents.receivedBids);
          setPrebidVersionInfo(message.payload.prebidEvents.versionInfo);
        }
      }
    },
    []
  );

  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        frameType !== 'outermost_frame' ||
        frameId !== 0 ||
        tabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      setConfig({});
      setErrorEvents([]);
      setInstalledModules([]);
      setPBJSNamespace('');
      setPrebidAdUnits({});
      setPrebidAuctionEvents({});
      setPrebidExists(null);
      setPrebidNoBids({});
      setPrebidReceivedBids([]);
      setPrebidVersionInfo('');
    },
    []
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation?.onCommitted?.addListener(
      onCommittedNavigationListener
    );

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation?.onCommitted?.removeListener(
        onCommittedNavigationListener
      );
    };
  }, [messagePassingListener, onCommittedNavigationListener]);

  const memoisedValue: PrebidContextType = useMemo(() => {
    return {
      state: {
        prebidAdUnits,
        prebidNoBids,
        versionInfo,
        installedModules,
        config,
        prebidReceivedBids,
        errorEvents,
        prebidAuctionEvents,
        pbjsNamespace,
        prebidExists,
        debuggingModuleConfig,
        storeRulesInLocalStorage,
      },
      actions: {
        changeRule,
        addRule,
        handleWriteRulesToStorage,
        openGoogleManagerConsole,
        setDebuggingModuleConfig,
        handleChangeStoreRulesInLocalStorage,
      },
    };
  }, [
    storeRulesInLocalStorage,
    debuggingModuleConfig,
    prebidAdUnits,
    prebidNoBids,
    versionInfo,
    installedModules,
    config,
    prebidReceivedBids,
    errorEvents,
    prebidAuctionEvents,
    pbjsNamespace,
    prebidExists,
    changeRule,
    addRule,
    handleWriteRulesToStorage,
    openGoogleManagerConsole,
    handleChangeStoreRulesInLocalStorage,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
