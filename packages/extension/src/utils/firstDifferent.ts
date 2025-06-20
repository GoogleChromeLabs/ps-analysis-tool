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
 * Returns the first string in `input` that is not in `excludes`.
 * @param input Array of strings to check
 * @param excludes Array of strings to exclude
 * @returns The first string in input that is not in excludes, or undefined if none found
 */
const firstDifferent = (input: string[], excludes: string[]): string => {
  const [first] = input.filter((item) => !excludes?.includes(item));
  return first;
};

export default firstDifferent;
