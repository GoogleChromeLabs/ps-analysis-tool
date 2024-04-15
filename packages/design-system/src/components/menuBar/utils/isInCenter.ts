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
 * Determines if an HTMLElement is vertically centered within the viewport.
 * @param {HTMLElement} element - The HTMLElement to check for vertical centering.
 * @returns {boolean} True if the element is vertically centered within the viewport, false otherwise.
 */
const isInCenter = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const elementTop = rect.top;
  const elementBottom = rect.bottom;
  const elementHeight = elementBottom - elementTop;

  const elementCenterY = elementTop + elementHeight / 2;
  const viewportCenterY = viewportHeight / 2;

  return Math.abs(elementCenterY - viewportCenterY) <= elementHeight / 2;
};

export default isInCenter;
