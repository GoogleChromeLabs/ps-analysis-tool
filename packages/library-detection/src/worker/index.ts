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
 * External dependencies.
 */
import { LIBRARY_DETECTION_WORKER_TASK } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import detectMatchingSignatures from '../core/detectMatchingSignatures';
import { type PreDefinedLibraryWorkerTaskPayload } from './constants';
import LIBRARIES from '../config';
import type { DetectionFunctions } from '../types';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Library Detection worker function that handles tasks related to library detection.
 * @param {MessageEvent} event - The MessageEvent containing task and payload data.
 */
export const ldWorkerOnMessageCallback = (event: MessageEvent): void => {
  const task: LIBRARY_DETECTION_WORKER_TASK = event.data.task;
  const scripts: PreDefinedLibraryWorkerTaskPayload[LIBRARY_DETECTION_WORKER_TASK] =
    event.data.payload;

  const detectionFunctions = Object.fromEntries(
    LIBRARIES.map((library) => [library.name, library.detectionFunction])
  );

  switch (task) {
    case LIBRARY_DETECTION_WORKER_TASK.DETECT_SIGNATURE_MATCHING: {
      const detectedMatchingSignatures = detectMatchingSignatures(
        scripts,
        detectionFunctions as DetectionFunctions
      );
      postMessage(detectedMatchingSignatures);
      break;
    }
    default:
      postMessage(I18n.getMessage('taskNotDefined'));
  }
};
