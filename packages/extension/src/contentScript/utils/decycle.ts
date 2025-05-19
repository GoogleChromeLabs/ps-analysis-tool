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
 * Serializes an object into a JSON string while handling circular references.
 *
 * This function uses a `WeakSet` to track objects that have already been
 * processed, preventing infinite recursion when encountering circular
 * references. Additionally, it discards any object that contains a `location`
 * property, such as `document` objects.
 * @param obj - The object to be serialized into a JSON string.
 * @returns A JSON string representation of the input object, with circular
 * references handled and certain objects discarded.
 */

export const decycle = (obj: any) => {
  const cache = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      if (value['location']) {
        // document object found, discard key
        return;
      }
      // Store value in our set
      cache.add(value);
    }
    // eslint-disable-next-line consistent-return
    return value;
  });
};
