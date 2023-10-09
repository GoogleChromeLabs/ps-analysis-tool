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
import React, { type PropsWithChildren, useMemo } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';
/**
 * Internal dependencies.
 */
import type { CookieJsonDataType } from '../../../../types';
import type {
  CookieTableData,
  TechnologyData,
} from '@cookie-analysis-tool/common';

export interface ContentStore {
  state: {
    tabCookies: { [key: string]: CookieTableData };
    technologies: TechnologyData[] | undefined;
  };
}

const initialState: ContentStore = {
  state: {
    tabCookies: {},
    technologies: [],
  },
};

export const Context = createContext<ContentStore>(initialState);

interface ContentStoreProviderProps {
  cookies: {
    [frame: string]: {
      [key: string]: CookieJsonDataType;
    };
  };
  technologies?: TechnologyData[];
}

export const Provider = ({
  cookies,
  technologies,
  children,
}: PropsWithChildren<ContentStoreProviderProps>) => {
  const tabCookies = useMemo(
    () =>
      Object.entries(cookies)
        .filter(
          ([frame]) => frame.includes('http') || frame === 'Unknown Frame'
        )
        .map(([frame, _cookies]) => {
          const newCookies = Object.fromEntries(
            Object.values(_cookies).map((cookie) => [
              cookie.name + cookie.domain + cookie.path,
              {
                parsedCookie: {
                  name: cookie.name,
                  value: cookie.value,
                  domain: cookie.domain,
                  path: cookie.path,
                  expires: cookie.expires,
                  httponly: cookie.httpOnly,
                  secure: cookie.secure,
                  samesite: cookie.sameSite,
                },
                analytics: {
                  platform: cookie.platform,
                  category:
                    cookie.category === 'Unknown Category'
                      ? 'Uncategorized'
                      : cookie.category,
                  description: cookie.description,
                } as CookieTableData['analytics'],
                url: cookie.pageUrl,
                headerType: 'response',
                isFirstParty: cookie.isFirstParty,
                frameIdList: [],
                isCookieSet: !cookie.isBlocked,
                frameUrl: frame,
              } as CookieTableData,
            ])
          );

          return newCookies;
        })
        .reduce((acc, cookieObj) => {
          return {
            ...acc,
            ...cookieObj,
          };
        }, {}),
    [cookies] // {frame: cookies}
  );

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          technologies,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useContentStore(): ContentStore;
export function useContentStore<T>(selector: (state: ContentStore) => T): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useContentStore<T>(
  selector: (state: ContentStore) => T | ContentStore = (state) => state
) {
  return useContextSelector(Context, selector);
}
