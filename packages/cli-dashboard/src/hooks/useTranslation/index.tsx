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
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { createContext, useContextSelector } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

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
  const [i18n, setI18n] = useState<typeof I18n | null>(null);

  useEffect(() => {
    const locale = navigator.language || 'en';
    const localeArray = [
      locale,
      locale.split('-')[0],
      locale.split('_')[0],
      'en',
    ];

    (async () => {
      let idx = 0;

      const fetchWithRetry = async () => {
        if (idx >= localeArray.length) {
          return;
        }

        try {
          const res = await fetch(
            `/_locales/${localeArray[idx]}/messages.json`
          );
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }

          const data = await res.json();

          const i18nObj = I18n;
          i18nObj.initMessages(data);

          setI18n(i18nObj);
        } catch (error) {
          idx++;
          await fetchWithRetry();
        }
      };

      await fetchWithRetry();
    })();
  }, []);

  const _getMessage = useCallback(
    (key: string, substitutions?: string[], escapeLt?: boolean) => {
      return i18n?.getMessage(key, substitutions, escapeLt) || '';
    },
    [i18n]
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
