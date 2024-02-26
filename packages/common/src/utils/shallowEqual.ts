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
 * External dependencies
 */
import { shallowEqualArrays, shallowEqualObjects } from 'shallow-equal';

export const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (
      typeof a[0] === 'object' &&
      typeof b[0] === 'object' &&
      a.length === b.length
    ) {
      return a.every((item, index) => shallowEqualObjects(item, b[index]));
    }

    return shallowEqualArrays(a, b);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return shallowEqualObjects(a, b);
  }

  return false;
};
