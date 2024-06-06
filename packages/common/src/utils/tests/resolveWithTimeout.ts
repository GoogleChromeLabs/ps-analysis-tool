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
import resolveWithTimeout from '../resolveWithTimeout';

describe('resolveWithTimeout', () => {
  it('should resolve Promise before the timeout', async () => {
    const PROMISE_RESOLVE_TIME = 1000;
    const TIMEOUT = 2000;

    const myPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Promise Resolved');
      }, PROMISE_RESOLVE_TIME);
    });

    const result = await resolveWithTimeout(myPromise, TIMEOUT);

    expect(result).toBe('Promise Resolved');
  });

  it('should not resolve Promise after the timeout', async () => {
    const PROMISE_RESOLVE_TIME = 2000;
    const TIMEOUT = 1000;

    const myPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Promise Resolved');
      }, PROMISE_RESOLVE_TIME);
    });

    const result = await resolveWithTimeout(myPromise, TIMEOUT);

    expect(result).not.toBe('Promise Resolved');
  });
});
