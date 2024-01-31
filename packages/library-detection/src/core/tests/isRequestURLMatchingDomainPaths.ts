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
 * Internal dependencies.
 */
import isRequestURLMatchingDomainPaths from '../isRequestURLMatchingDomainPaths';
import type { DomainPaths } from '../../types';

describe('Test for isRequestURLMatchingDomainPaths', () => {
  it('Should return true since the domain and path matches', () => {
    const requestUrl = 'https://test.com/platform.js';
    const domainPaths: DomainPaths = {
      'js.com': ['/javascript.js', '/creative.js'],
      'test.com': ['/platform.js', '/test.js'],
    };

    expect(isRequestURLMatchingDomainPaths(requestUrl, domainPaths)).toEqual(
      true
    );
  });

  it("Should return false since the domain doesn't matches", () => {
    const requestUrl = 'https://test1.com/platform.js';
    const domainPaths: DomainPaths = {
      'js.com': ['/javascript.js', '/creative.js'],
      'test.com': ['/platform.js', '/test.js'],
    };

    expect(isRequestURLMatchingDomainPaths(requestUrl, domainPaths)).toEqual(
      false
    );
  });

  it("Should return false since the path doesn't matches", () => {
    const requestUrl = 'https://test.com/platform1.js';
    const domainPaths: DomainPaths = {
      'js.com': ['/javascript.js', '/creative.js'],
      'test.com': ['/platform.js', '/test.js'],
    };

    expect(isRequestURLMatchingDomainPaths(requestUrl, domainPaths)).toEqual(
      false
    );
  });
});
