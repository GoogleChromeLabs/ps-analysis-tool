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
 * Merges two 2D arrays and returns a new 2D array containing only unique inner arrays.
 * Uniqueness is determined by the stringified content of each inner array.
 * @param {any[][]} arr1 - The first 2D array.
 * @param {any[][]} arr2 - The second 2D array.
 * @returns {any[][]} A new 2D array containing unique inner arrays from both inputs.
 */
export default function mergeUnique2DArrays(
  arr1: any[][],
  arr2: any[][]
): any[][] {
  const seen = new Set<string>();
  const result: any[][] = [];

  for (const row of [...arr1, ...arr2]) {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(row);
    }
  }

  return result;
}
