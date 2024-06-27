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
 * This function will return true if the frame exists.
 * @param {string} targetId The targetId for the frame which needs to be checked if it exists.
 * @returns {boolean} True if frame exists else false.
 */
export const doesFrameExist = async (targetId: string | null) => {
  if (!targetId) {
    return false;
  }
  try {
    const { targetInfo: { browserContextId = '' } = {} } =
      await chrome.debugger.sendCommand({ targetId }, 'Target.getTargetInfo', {
        targetId,
      });
    return browserContextId ? true : false;
  } catch (error) {
    return false;
  }
};
