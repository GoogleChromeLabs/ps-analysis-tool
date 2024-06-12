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
 * Time a promise.
 * @param {Promise<T>} promise - A promise that need to be timed.
 * @param resolveInto
 * @param {number} timeout - Time for the timeout in milliseconds.
 * @returns {Promose<T|string>} - The parsed URL object or null if the URL is invalid.
 */
export default function resolveWithTimeout<T>(
  promise: Promise<T>,
  resolveInto: T,
  timeout: number
): Promise<T | string> {
  return new Promise((resolve, reject) => {
    // Create a timeout promise that resolves after the specified time
    const timeoutPromise = new Promise<T>((resolveTimeout) => {
      setTimeout(() => {
        resolveTimeout(resolveInto);
      }, timeout);
    });

    // Use Promise.race to resolve with the first promise that completes
    Promise.race([promise, timeoutPromise]).then(resolve).catch(reject);
  });
}
