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
import { SidebarItems } from '..';
import matchKey from './matchKey';

const createKeyPath = (
  items: SidebarItems,
  key: string,
  keyPath: string[] = []
) => {
  let keyFound = false;

  const _createKeyPath = (_items: SidebarItems, _keyPath: string[] = []) => {
    Object.entries(_items).forEach(([itemKey, item]) => {
      if (keyFound) {
        return;
      }

      if (matchKey(key || '', itemKey)) {
        _keyPath.push(itemKey);

        keyFound = true;
        return;
      }

      if (item.children) {
        _keyPath.push(itemKey);
        _createKeyPath(item.children, _keyPath);

        if (!keyFound) {
          _keyPath.pop();
        }
      }
    });

    return _keyPath;
  };

  return _createKeyPath(items, keyPath);
};

export default createKeyPath;
