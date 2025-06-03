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
const isElementVisibleInViewport = (
  el: HTMLElement | null,
  partiallyVisible = false
) => {
  if (!el) {
    return false;
  }

  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth, scrollX, scrollY } = window;

  const viewportTop = scrollY;
  const viewportBottom = scrollY + innerHeight;
  const viewportLeft = scrollX;
  const viewportRight = scrollX + innerWidth;

  const elementTop = top + scrollY;
  const elementBottom = bottom + scrollY;
  const elementLeft = left + scrollX;
  const elementRight = right + scrollX;

  return partiallyVisible
    ? ((elementTop >= viewportTop && elementTop < viewportBottom) ||
        (elementBottom > viewportTop && elementBottom <= viewportBottom)) &&
        ((elementLeft >= viewportLeft && elementLeft < viewportRight) ||
          (elementRight > viewportLeft && elementRight <= viewportRight))
    : elementTop >= viewportTop &&
        elementLeft >= viewportLeft &&
        elementBottom <= viewportBottom &&
        elementRight <= viewportRight;
};

export default isElementVisibleInViewport;
