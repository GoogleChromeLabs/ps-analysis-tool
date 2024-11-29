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
 * Internal dependencies
 */
import flow from '../modules/flow';
import app from '../app';

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
  add(promiseFunction) {
    this.queue.push(promiseFunction);
  }

  // Start processing the queue
  start(resumed = false) {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    if (!resumed) {
      this.processQueue();
    }
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
  }

  // Process the queue sequentially
  async processQueue() {
    if (!this.isProcessing || this.isPaused) {
      return;
    }

    while (this.currentPromiseIndex < this.queue.length) {
      if (this.isPaused) {
        continue;
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
        if (app.cancelPromise) {
          flow.clearBelowTimelineCircles();
          app.cancelPromise = false;
          app.timeline.isPaused = false;
          if (this.queue.length === 0) {
            return;
          }
        }
      } catch (error) {
        this.currentPromiseIndex++;
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
    this.currentPromiseIndex = 0;
    this.nextNodeSkipIndex = [];
    this.nextStepSkipIndex = [];
    this.skipToIndex = -1;
  }
}

export default new PromiseQueue();
