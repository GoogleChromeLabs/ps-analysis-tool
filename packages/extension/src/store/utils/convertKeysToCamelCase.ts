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
 * Converts a snake_case string to camelCase.
 * @param {string} str - The snake_case string.
 * @returns {string} - The converted camelCase string.
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all snake_case keys in an object to camelCase.
 * @param {unknown} obj - The object or array to process.
 * @returns {unknown} - The transformed object with camelCase keys.
 */
function convertKeysToCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as T;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      (acc as Record<string, unknown>)[camelKey] = convertKeysToCamelCase(
        (obj as Record<string, unknown>)[key]
      );
      return acc;
    }, {} as T);
  }
  return obj;
}

export default convertKeysToCamelCase;
