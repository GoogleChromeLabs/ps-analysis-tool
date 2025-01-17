/*
 * Copyright 2024 Google LLC
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
export const scrollToCoordinates = (x, y, override = false) => {
  if (override) {
    document.querySelector('#ps-canvas').parentElement.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  const rect = document
    .querySelector('#ps-canvas')
    .parentElement.getBoundingClientRect();

  let finalX = x - rect.left,
    finalY = y - rect.top;
  if (finalX < 0) {
    finalX = rect.left - x;
  }

  if (finalY < 0) {
    finalY = rect.top - y;
  }

  document.querySelector('#ps-canvas').parentElement.scrollTo({
    left: finalX,
    top: finalY,
    behavior: 'smooth',
  });
};
