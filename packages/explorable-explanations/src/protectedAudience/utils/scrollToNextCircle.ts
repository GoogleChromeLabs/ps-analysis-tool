/*
 * Copyright 2025 Google LLC
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

import app from '../app';
import { delay, getCoordinateValues, scrollToCoordinates } from '.';

const scrollToNextCircle = async (scrollDelay: number) => {
  if (app.cancelPromise || !app.autoScroll) {
    return;
  }
  const currentCircleIndex = app.timeline.currentIndex;
  const nextCircleIndex = app.isInteractiveMode
    ? currentCircleIndex
    : currentCircleIndex + 1;
  const position = app.timeline.circlePositions[nextCircleIndex];
  if (!position) {
    return;
  }
  const { x, y } = position;
  const { x: x1, y: y1 } = getCoordinateValues({ x, y });
  await delay(scrollDelay);
  scrollToCoordinates({ x: x1, y: y1 });
};

export default scrollToNextCircle;
