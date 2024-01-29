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
import onAllowListClick from '../onAllowListClick';
import * as removeFromAllowList from '../removeFromAllowList';

describe('onAllowListClick', () => {
  beforeAll(() => {
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
  });

  afterAll(() => {
    globalThis.chrome = chrome as unknown as typeof chrome;
  });

  it('should return undefined if pageUrl or domainOrParentDomain is not defined', async () => {
    const result = await onAllowListClick(
      '',
      'https://www.example.com/home',
      false,
      false,
      new Set<string>(),
      jest.fn()
    );
    expect(result).toBe(undefined);
  });

  it('should call removeFromAllowList if isDomainInAllowList is true', async () => {
    const removeFromAllowListSpy = jest.spyOn(removeFromAllowList, 'default');
    await onAllowListClick(
      'domain',
      'https://www.example.com/home',
      false,
      true,
      new Set(),
      () => undefined
    );
    expect(removeFromAllowListSpy).toHaveBeenCalled();

    removeFromAllowListSpy.mockRestore();
  });

  it('should call removeFromAllowList if isDomainInAllowList is false but has parent domain', async () => {
    const removeFromAllowListSpy = jest.spyOn(removeFromAllowList, 'default');

    await onAllowListClick(
      'xyz.domain.com',
      'https://www.example.com/home',
      false,
      true,
      new Set('domain.com'),
      () => undefined
    );

    expect(removeFromAllowListSpy).toHaveBeenCalled();

    removeFromAllowListSpy.mockRestore();
  });

  it('should not call removeFromAllowList if isDomainInAllowList is false and call setDomainsCallbck', async () => {
    const setDomainsCallbck = jest.fn();
    const removeFromAllowListSpy = jest.spyOn(removeFromAllowList, 'default');

    await onAllowListClick(
      'zzz.domain',
      'https://www.example.com/home',
      false,
      false,
      new Set(),
      setDomainsCallbck
    );
    expect(removeFromAllowListSpy).not.toHaveBeenCalled();
    expect(setDomainsCallbck).toHaveBeenCalled();
  });
});
