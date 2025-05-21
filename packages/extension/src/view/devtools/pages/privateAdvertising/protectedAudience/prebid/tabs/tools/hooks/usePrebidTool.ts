/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  PrebidDebugModuleConfig,
  PrebidDebugModuleConfigRule,
} from '@google-psat/common';
/**
 * Internal dependencies
 */
import { replaceRuleTargets, matchRuleTargets } from '../constants';
import { useProtectedAudience } from '../../../../../../../stateProviders';
import { STORE_RULES_TOGGLE } from '../../../../../../../../../constants';
import firstDifferent from '../../../../../../../../../utils/firstDifferent';

const usePrebidTool = () => {
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

  const { pbjsNamespace } = useProtectedAudience(({ state }) => ({
    pbjsNamespace: state.prebidResponse.pbjsNamespace,
  }));

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

  const valueToBeReturned = useMemo(() => {
    return {
      setDebuggingModuleConfig,
      debuggingModuleConfig,
      changeRule,
      addRule,
      handleChangeStoreRulesInLocalStorage,
      storeRulesInLocalStorage,
      openGoogleManagerConsole,
    };
  }, [
    addRule,
    changeRule,
    openGoogleManagerConsole,
    handleChangeStoreRulesInLocalStorage,
    debuggingModuleConfig,
    storeRulesInLocalStorage,
  ]);

  return valueToBeReturned;
};

export default usePrebidTool;
