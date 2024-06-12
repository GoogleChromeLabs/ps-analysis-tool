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
 * Determines if an HTMLElement hasn't been scrolled more than a 3/4th of its height out of viewport's 1/4th quarter.
 * @param element - The HTMLElement to check for vertical centering.
 * @returns True if the element is in view, false otherwise.
 */
export default function isElementInView(element: HTMLElement) {
  const quarterViewPortHeight =
    (window.innerHeight || document.documentElement.offsetHeight) / 4;
  const quarterElementHeight = element.offsetHeight / 4;
  const rect = element.getBoundingClientRect();

  const elementTop = rect.top;
  const elementBottom = rect.bottom;

  if (elementTop > quarterViewPortHeight || elementBottom < 0) {
    return false;
  }

  const cutoffLine = elementBottom - quarterElementHeight;

  if (cutoffLine < 0) {
    return false;
  }

  return true;
}
