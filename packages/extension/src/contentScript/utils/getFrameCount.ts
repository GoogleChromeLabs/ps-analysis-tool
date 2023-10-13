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
import isFrameHidden from './isFrameHidden';

const getFrameCount = (
  frameElements: HTMLElement[]
): Record<string, number> => {
  const frameCount = {
    numberOfFrames: 0,
    numberOfVisibleFrames: 0,
    numberOfHiddenFrames: 0,
  };

  frameCount.numberOfFrames = frameElements.length;

  for (let i = 0; i < frameCount.numberOfFrames; i++) {
    if (isFrameHidden(frameElements[i])) {
      frameCount.numberOfHiddenFrames++;
    }
  }

  frameCount.numberOfVisibleFrames =
    frameCount.numberOfFrames - frameCount.numberOfHiddenFrames;

  return frameCount;
};

export default getFrameCount;
