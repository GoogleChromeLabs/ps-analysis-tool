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
type TransformedValue = { key: string; value: any } | any;

/**
 * Recursively transforms the values of an object while keeping the top-level keys unchanged.
 * - Objects are converted into arrays of `{ key, value }` pairs.
 * - Arrays are transformed into objects with `{ key: index, value: element }`.
 * - Primitive values remain unchanged.
 * @param obj - The input object to transform.
 * @returns A new object where only the nested values are transformed.
 */
function transformNestedObject<T extends Record<string, any>>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // If it's not an object, return as is
  }

  const transformedObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    transformedObj[key] = processValue(value); // Only transform values
  }

  return transformedObj as T;
}

/**
 * Helper function to transform a value recursively.
 * - Arrays are converted into objects with `{ key: index, value: element }`.
 * - Objects are converted into arrays of `{ key, value }` pairs.
 * @param value - The value to transform.
 * @returns The transformed value.
 */
function processValue(value: any): TransformedValue {
  if (typeof value !== 'object' || value === null) {
    return value; // Base case: return primitive values as-is
  }

  if (Array.isArray(value)) {
    return value.map((item) => transformNestedObject(item));
  }

  return Object.entries(value).map(([key, val]) => ({
    key: key,
    value: processValue(val),
  }));
}

export default transformNestedObject;
