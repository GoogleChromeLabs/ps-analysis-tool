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

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getExtensionMessage } from '../getExtensionMessage';
import { getDashboardMessage } from '../getDashboardMessage';
import { createContext, useContextSelector } from 'use-context-selector';

interface TranslationContext {
  getMessage: (
    key: string,
    substitutions?: string[],
    escapeLt?: boolean
  ) => string;
}

const initialContext: TranslationContext = {
  getMessage: () => '',
};

export const Context = createContext(initialContext);

export const TranslationProvider = ({ children }: PropsWithChildren) => {
  const isExtension = useMemo(() => {
    return window.location.protocol === 'chrome-extension:';
  }, []);

  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (isExtension) {
      setMessages({});
      return;
    }

    (async () => {
      const res = await fetch(`/_locales/en/messages.json`);
      const data = await res.json();

      setMessages(data);
    })();
  }, [isExtension]);

  const _getMessage = useCallback(
    (key: string, substitutions?: string[], escapeLt?: boolean) => {
      if (isExtension) {
        // @ts-ignore - Outdated definition
        return getExtensionMessage(key, substitutions, escapeLt);
      }

      return getDashboardMessage(key, messages, substitutions, escapeLt);
    },
    [isExtension, messages]
  );

  return (
    <Context.Provider value={{ getMessage: _getMessage }}>
      {children}
    </Context.Provider>
  );
};

export function useTranslation(): TranslationContext;
export function useTranslation<T>(
  selector: (state: TranslationContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useTranslation<T>(
  selector: (state: TranslationContext) => T | TranslationContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
