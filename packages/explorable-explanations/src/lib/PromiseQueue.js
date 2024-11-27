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
class PromiseQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.isPaused = false;
    this.skipToIndex = 0;
  }

  // Add a promise-returning function to the queue
  add(promiseFn) {
    this.queue.push(promiseFn);
    if (this.isProcessing && !this.isPaused) {
      this.processQueue();
    }
  }

  // Start processing the queue
  start() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    this.processQueue();
  }

  // Stop processing the queue
  stop() {
    this.isProcessing = false;
  }

  // Pause the queue
  pause() {
    this.isPaused = true;
  }

  // Resume the queue
  resume() {
    if (!this.isPaused) {
      return;
    }
    this.isPaused = false;
    this.processQueue();
  }

  // Process the queue sequentially
  async processQueue() {
    if (!this.isProcessing || this.isPaused) {
      return;
    }

    while (this.queue.length > 0) {
      if (this.isPaused) {
        return;
      }

      if (this.skipToIndex > 0) {
        this.queue.shift(); // Skip promises
        this.skipToIndex--;
        continue;
      }

      const current = this.queue.shift();
      try {
        // eslint-disable-next-line no-await-in-loop
        await current(); // Execute the promise function
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in promise execution:', error);
      }
    }

    this.isProcessing = false;
  }

  // Skip to a specific queue index
  skipTo(index) {
    if (index > this.queue.length) {
      // eslint-disable-next-line no-console
      console.warn('Skipping beyond queue size. Clearing queue.');
      this.clear();
    } else {
      this.skipToIndex = index;
    }
  }

  // Clear the queue
  clear() {
    this.queue = [];
    this.isProcessing = false;
    this.isPaused = false;
  }
}

export default new PromiseQueue();
