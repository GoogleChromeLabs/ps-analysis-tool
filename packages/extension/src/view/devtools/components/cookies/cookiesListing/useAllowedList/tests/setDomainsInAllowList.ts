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
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import setDomainsInAllowList from '../setDomainsInAllowList';

globalThis.chrome = {
  ...(SinonChrome as unknown as typeof chrome),
  storage: {
    // @ts-ignore
    session: {
      // @ts-ignore
      get: () => ({
        allowList: [
          {
            primaryDomain: 'xyz.domain',
          },
        ],
      }),
      set: () => Promise.resolve(),
    },
  },
};

describe('setDomainsInAllowList', () => {
  it('should return undefined if pageUrl or domain is not defined', async () => {
    const result = await setDomainsInAllowList('', false, '', new Set(), () =>
      Promise.resolve()
    );
    expect(result).toBe(undefined);
  });

  it('should add domain to domainsInAllowList if setting is session_only', async () => {
    globalThis.chrome = {
      ...globalThis.chrome,
      contentSettings: {
        // @ts-ignore
        cookies: {
          get: () =>
            Promise.resolve({
              setting: 'session_only',
            }),
        },
      },
    };

    const domainsInAllowList = new Set<string>();
    const setDomainsInAllowListSpy = jest.fn();
    await setDomainsInAllowList(
      'pageUrl',
      false,
      'domain',
      domainsInAllowList,
      setDomainsInAllowListSpy
    );
    expect(domainsInAllowList.has('domain')).toBe(true);
    expect(setDomainsInAllowListSpy).toHaveBeenCalledWith(domainsInAllowList);
  });

  it('should remove domain from domainsInAllowList if setting is not session_only', async () => {
    globalThis.chrome = {
      ...globalThis.chrome,
      contentSettings: {
        // @ts-ignore
        cookies: {
          get: () =>
            Promise.resolve({
              setting: 'not_session_only',
            }),
        },
      },
    };

    const domainsInAllowList = new Set(['domain']);
    const setDomainsInAllowListSpy = jest.fn();
    await setDomainsInAllowList(
      'pageUrl',
      false,
      'domain',
      domainsInAllowList,
      setDomainsInAllowListSpy
    );

    expect(domainsInAllowList.has('domain')).toBe(false);
    expect(setDomainsInAllowListSpy).toHaveBeenCalledWith(domainsInAllowList);
  });
});
