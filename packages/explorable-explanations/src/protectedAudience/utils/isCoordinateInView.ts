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

// auto scroll if x or y is outside of the canvas when adding this offset
const SCROLL_OFFSET = 100;

export const isCoordinateInView = (x: number, y: number) => {
  const rect = app.canvasParentElement?.getBoundingClientRect();

  const scrollTop = app.canvasParentElement?.scrollTop || 0;
  const top = scrollTop + SCROLL_OFFSET;
  const bottom = scrollTop + (rect?.height || 0) - SCROLL_OFFSET / 2;

  const scrollLeft = app.canvasParentElement?.scrollLeft || 0;
  const left = scrollLeft + SCROLL_OFFSET;
  const right = scrollLeft + (rect?.width || 0) - SCROLL_OFFSET * 2;

  if (x < left || x > right) {
    return false;
  }

  if (y < top || y > bottom) {
    return false;
  }

  return true;
};
