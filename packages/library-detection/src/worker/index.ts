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
import detectMatchingSignatures from '../core/detectMatchingSignatures';
import { checkForGIS, checkForGSIv2 } from '../libraries';

import {
  LIBRARY_DETECTION_WORKER_TASK,
  PreDefinedLibraryWorkerTaskPayload,
} from './constants';

/**
 * Library Detection Worker function that handles tasks related to library detection.
 * @param {MessageEvent<any>} event - The MessageEvent containing task and payload data.
 * @returns {void} This function does not return a value directly but uses postMessage for communication.
 */
export const ldWorkerOnMessageCallback = (event: MessageEvent<any>) => {
  const task: LIBRARY_DETECTION_WORKER_TASK = event.data.task;
  const payload: PreDefinedLibraryWorkerTaskPayload[LIBRARY_DETECTION_WORKER_TASK] =
    event.data.payload;

  switch (task) {
    case LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING: {
      const detectedMatchingSignatures = detectMatchingSignatures(payload, {
        gis: checkForGIS,
        gsiV2: checkForGSIv2,
      });
      postMessage(detectedMatchingSignatures);
      break;
    }
    default:
      postMessage('Task not defined');
  }
};
