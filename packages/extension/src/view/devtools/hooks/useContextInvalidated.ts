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
import { useCallback, useEffect, type MutableRefObject } from 'react';

/**
 * Internal dependencies.
 */
import { useCookie, useSettings } from '../stateProviders';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

const useContextInvalidated = (
  contextInvalidatedRef: MutableRefObject<boolean | null>
): boolean => {
  const { contextInvalidated, setContextInvalidated } = useCookie(
    ({ state, actions }) => ({
      contextInvalidated: state.contextInvalidated,
      setContextInvalidated: actions.setContextInvalidated,
    })
  );

  const { allowedNumberOfTabs } = useSettings(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  const listenToMouseChange = useCallback(() => {
    if (contextInvalidatedRef.current) {
      if (!chrome.runtime?.id) {
        setContextInvalidated(true);
        localStorage.setItem('contextInvalidated', 'true');
      }
    }
  }, [setContextInvalidated, contextInvalidatedRef]);

  useEffect(() => {
    window.addEventListener('mouseover', listenToMouseChange);

    return () => {
      window.removeEventListener('mouseover', listenToMouseChange);
    };
  }, [listenToMouseChange]);

  useEffect(() => {
    (async () => {
      const localStorageFlag = localStorage.getItem('contextInvalidated');

      if (
        localStorageFlag &&
        localStorageFlag === 'true' &&
        allowedNumberOfTabs === 'unlimited'
      ) {
        const tabId = await getCurrentTabId();

        if (tabId) {
          chrome.tabs.reload(Number(tabId));
          localStorage.removeItem('contextInvalidated');
        }
      }
    })();
  }, [allowedNumberOfTabs]);

  return contextInvalidated;
};

export default useContextInvalidated;
