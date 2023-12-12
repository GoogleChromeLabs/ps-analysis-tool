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
import matchKey from './matchKey';

const findItem = (
  items: SidebarItems,
  key: string | null
): SidebarItemValue | null => {
  if (!key) {
    return null;
  }

  let keyFound = false,
    item: SidebarItemValue | null = null;

  const _findItem = (_items: SidebarItems) => {
    Object.entries(_items).forEach(([itemKey, _item]) => {
      if (keyFound) {
        return;
      }

      if (matchKey(key || '', itemKey)) {
        keyFound = true;
        item = _item;
        return;
      }

      if (_item.children) {
        _findItem(_item.children);
      }
    });
  };

  _findItem(items);

  return item;
};

export default findItem;
