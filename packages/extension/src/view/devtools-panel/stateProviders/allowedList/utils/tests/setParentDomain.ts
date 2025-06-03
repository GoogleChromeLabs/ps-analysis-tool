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
import React from 'react';

/**
 * Internal dependencies.
 */
import setParentDomain from '../setParentDomain';

globalThis.chrome = {
  ...(SinonChrome as unknown as typeof chrome),
  storage: {
    // @ts-ignore
    session: {
      // @ts-ignore
      get: () => ({
        allowList: [
          {
            primaryDomain: '.domain',
          },
        ],
      }),
      set: () => Promise.resolve(),
    },
  },
};

describe('setParentDomain', () => {
  it('should return parent domain if allowListSessionStorage is defined', async () => {
    const setState = jest.fn();
    const useStateMock: any = (initState: any) => [initState, setState];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    await setParentDomain('xyz.domain', setState);

    expect(setState).toHaveBeenCalled();
  });
});
