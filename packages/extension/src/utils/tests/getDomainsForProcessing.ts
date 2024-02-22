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
import getDomainsForProcessing from '../getDomainsForProcessing';

describe('getDomainsForProcessing : ', () => {
  it('Should return null if domain is not passed', () => {
    expect(getDomainsForProcessing('')).toBe(null);
  });

  it('Should alternate domains for a given domain if it starts with .', () => {
    expect(getDomainsForProcessing('.google.com')).toStrictEqual([
      '.google.com',
      'google.com',
    ]);
  });

  it('Should alternate domains for a given domain', () => {
    expect(getDomainsForProcessing('google.com')).toStrictEqual([
      '.google.com',
      'google.com',
    ]);
  });
});
