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
/**
 * Internal dependencies
 */
import app from '../app';

/**
 * This element checks if the object is in viewport.
 * @param x Coordinate X of the object to scroll to.
 * @param y Coordinate Y of the object to scroll to.
 * @param offset Offset to check if the object is in viewport.
 * @returns {boolean} Whether the object is in viewport or not.
 */
export function isPointInViewport(x: number, y: number, offset = 0): boolean {
  if (!app.canvasParentElement) {
    return false;
  }
  const rect = app.canvasParentElement.getBoundingClientRect();

  const scrollTop = app.canvasParentElement.scrollTop;
  const top = scrollTop + offset;
  const bottom = scrollTop + rect.height - offset;

  const scrollLeft = app.canvasParentElement.scrollLeft;
  const left = scrollLeft + offset;
  const right = scrollLeft + rect.width - offset;

  if (x < left || x > right || y < top || y > bottom) {
    return false;
  }

  return true;
}
