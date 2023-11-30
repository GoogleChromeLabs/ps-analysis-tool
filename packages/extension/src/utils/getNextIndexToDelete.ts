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
 * Get the element that has to be deleted
 * @param currentIndex The index of the current deleted element.
 * @param totalLength The length of the array of elements.
 * @returns number.
 */
export default function getNextIndexToDelete(
  currentIndex: number,
  totalLength: number
): number | null {
  if (totalLength > 0 && currentIndex < totalLength) {
    return currentIndex;
  } else if (currentIndex + 1 > totalLength && currentIndex - 1 > -1) {
    return currentIndex - 1;
  }
  return null;
}
