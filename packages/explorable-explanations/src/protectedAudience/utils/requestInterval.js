/*
 * Copyright 2024 Google LLC
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
 * Creates a request-based interval function similar to `setInterval`,
 * but uses `requestAnimationFrame` for better synchronization with the browser's refresh rate.
 * @param fn {Function} callback - The function to execute at each interval.
 * @param {number} delay - The interval duration in milliseconds.
 * @returns {object} An object with an `id` property for managing the interval.
 */
export const requestInterval = (fn, delay) => {
  let start = performance.now();
  const handle = { id: null };

  /**
   * Loop function executed on each animation frame.
   */
  function loop() {
    const current = performance.now();
    const elapsed = current - start;

    if (elapsed >= delay) {
      fn(); // Execute the callback function
      start = performance.now(); // Reset start time
    }

    handle.id = requestAnimationFrame(loop); // Continue the loop
  }

  handle.id = requestAnimationFrame(loop); // Start the loop
  return handle;
};

export const clearRequestInterval = (handle) => {
  cancelAnimationFrame(handle.id);
};
