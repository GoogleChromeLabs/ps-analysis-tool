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
 * External dependencies
 */
import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

/**
 * Internal dependencies
 */
import I18n from '../i18n';

interface Translation {
  actions: {
    getMessage: (
      key: string,
      substitutions?: string[],
      escapeLt?: boolean
    ) => string;
  };
}

const initialState: Translation = {
  actions: {
    getMessage: () => '',
  },
};

export const Context = createContext<Translation>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const i18n = useMemo(() => {
    return new I18n();
  }, []);

  return (
    <Context.Provider
      value={{
        actions: {
          getMessage: i18n.getMessage,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useTranslation(): Translation;
export function useTranslation<T>(selector: (state: Translation) => T): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useTranslation<T>(
  selector: (state: Translation) => T | Translation = (state) => state
) {
  return useContextSelector(Context, selector);
}
