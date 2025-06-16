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
  const [prebidData, setPrebidData] = useState<{
    [frameId]: PrebidEvents;
  }>({});

  const [prebidExists, setPrebidExists] =
    useState<PrebidContextType['state']['prebidExists']>(null);

  const [frameId, setFrameId] = useState<number>(0);

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
      const pbjsNamespace = prebidData[frameId].pbjsNamespace;
      if (!pbjsNamespace) {
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId, frameIds: [frameId] },
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
        target: { tabId, frameIds: [frameId] },
        func: (namespace: string, _input: object) => {
          localStorage.setItem(
            `__${namespace}_debugging__`,
            `${JSON.stringify(_input)}`
          );
        },
        args: [pbjsNamespace, input],
      });
    },
    [prebidData, frameId, storeRulesInLocalStorage]
  );

  const openGoogleManagerConsole = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    await chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      //@ts-ignore
      func: () => googletag.cmd.push(() => googletag.openConsole()),
      world: 'MAIN',
    });
  }, [frameId]);

  useEffect(() => {
    if (!initialStateFetched.current) {
      return;
    }

    handleWriteRulesToStorage(debuggingModuleConfig);
  }, [debuggingModuleConfig, handleWriteRulesToStorage]);

  const getInitialState = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const pbjsNamespace = prebidData[frameId].pbjsNamespace;

    if (!pbjsNamespace) {
      initialStateFetched.current = true;
      return;
    }

    let [first] = await chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      func: (namespace: string) =>
        sessionStorage.getItem(`__${namespace}_debugging__`),
      args: [pbjsNamespace],
    });

    if (!first || !first.result) {
      [first] = await chrome.scripting.executeScript({
        target: { tabId, frameIds: [frameId] },
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
  }, [frameId, handleWriteRulesToStorage, prebidData]);

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
        prebidEvents: { [frameId: number]: PrebidEvents };
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
          setPrebidData((prev) => {
            const newData = message.payload.prebidEvents;
            const constructedData = prev;
            let updated = false;

            Object.keys(newData).forEach((key) => {
              if (!isEqual(prev[Number(key)], newData[Number(key)])) {
                constructedData[Number(key)] = newData[Number(key)];
                updated = true;
              }
            });
            return updated ? constructedData : prev;
          });
          setPrebidExists((prev) => {
            const pbjsNamespaces = Object.keys(
              message.payload.prebidEvents
            ).filter((key) => {
              return Boolean(
                message.payload.prebidEvents[Number(key)].pbjsNamespace
              );
            });

            let newState = false;

            if (pbjsNamespaces.length > 0) {
              newState = true;
            }
            return isEqual(prev, newState) ? prev : newState;
          });
        }
      }
    },
    []
  );

  const onCommittedNavigationListener = useCallback(
    ({
      frameId: _frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        frameType !== 'outermost_frame' ||
        _frameId !== 0 ||
        tabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }
      initialStateFetched.current = false;
      setFrameId(0);
      setPrebidData({});
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
    const pbjsNamespaces: { [frameId: number]: string } = {};

    Object.keys(prebidData).forEach((key) => {
      const _pbjsNamespace = prebidData[Number(key)].pbjsNamespace;
      if (_pbjsNamespace) {
        pbjsNamespaces[Number(key)] = _pbjsNamespace;
      }
    });

    return {
      state: {
        prebidData: prebidData[frameId],
        pbjsNamespaces,
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
    prebidData,
    frameId,
    prebidExists,
    debuggingModuleConfig,
    storeRulesInLocalStorage,
    changeRule,
    addRule,
    handleWriteRulesToStorage,
    openGoogleManagerConsole,
    handleChangeStoreRulesInLocalStorage,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
