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
 * Internal dependencies
 */
import { SidebarItemValue, SidebarItems } from '..';

const findItem = (items: SidebarItems, keyPath: string[]) => {
  if (keyPath.length === 0) {
    return null;
  }

  let idx = 0,
    item: SidebarItemValue = items[keyPath[idx]];

  while (idx < keyPath.length) {
    const itemKey = keyPath[idx];
    item = items[itemKey];

    idx++;
  }

  return item;
};

export default findItem;
