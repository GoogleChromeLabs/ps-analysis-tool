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
    this.skipToIndex = -1;
    this.nextNodeSkipIndex = [];
    this.nextStepSkipIndex = [];
    this.currentPromiseIndex = 0;
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

    while (this.currentPromiseIndex < this.queue.length) {
      if (this.isPaused) {
        return;
      }

      if (this.skipToIndex > -1) {
        this.currentPromiseIndex = this.skipToIndex;
        this.skipToIndex = -1;
        continue;
      }

      const current = this.queue[this.currentPromiseIndex];
      try {
        // eslint-disable-next-line no-await-in-loop
        await current();
        this.currentPromiseIndex++;
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
      this.clear();
      this.currentPromiseIndex = 0;
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
