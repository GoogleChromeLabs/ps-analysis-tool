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
import getDevToolWorker from './devToolWorker';

/**
 * Execute a task using a web worker.
 * This is a highlevel abstraction over webworker.
 * This kills the web worker instance after execution completes.
 * @param {PredefinedTasks} task - The predefined task to be executed by the worker.
 * @param {PreDefinedWorkerTaskPayload} payload - The payload or data required for the task.
 * @returns {Promise<MessageEvent>} A promise that resolves with the result of the task
 * or rejects with an error if the task encounters an error.
 */

const executeTaskInWorker = (
  task: string,
  payload: unknown,
  successCallback: (dataFromThread: unknown) => void
) => {
  const workerThread = getDevToolWorker();

  workerThread.postMessage({
    task,
    payload,
  });
  // Send data to worker
  // workerThread.onerror = reject; // Handle errors
  workerThread.onmessage = (resultEvent) => {
    successCallback(resultEvent.data);
  }; // Get result from worker
};

export default executeTaskInWorker;
