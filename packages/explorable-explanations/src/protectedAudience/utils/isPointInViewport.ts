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
 * @returns {boolean} Whether the object is in viewport or not.
 */
export function isPointInViewport(x, y) {
  if (!app.canvasParentElement) {
    return false;
  }
  const rect = app.canvasParentElement.getBoundingClientRect();

  const scrollX = app.canvasParentElement.scrollLeft;
  const scrollY = app.canvasParentElement.scrollTop;

  const viewportWidth = rect.width;
  const viewportHeight = rect.height;

  const minX = scrollX;
  const maxX = scrollX + viewportWidth;
  const minY = scrollY;
  const maxY = scrollY + viewportHeight;

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
