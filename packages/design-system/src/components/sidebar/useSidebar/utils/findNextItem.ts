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
import findItem from './findItem';
import findKeyParent from './findKeyParent';

const handleNextItemOnParent = (currentItem: SidebarItemValue) => {
  const children = Object.keys(currentItem.children);

  return children.length ? children[0] : null;
};

const findNextItem = (
  items: SidebarItems,
  keyPath: string[],
  skipDropdown = false
): string | null => {
  if (keyPath.length === 0) {
    return null;
  }

  const currentKey = keyPath[keyPath.length - 1];
  const currentItem = findItem(items, currentKey) as SidebarItemValue;

  if (currentItem?.dropdownOpen && !skipDropdown) {
    return handleNextItemOnParent(currentItem);
  }

  const parentKey = findKeyParent(keyPath);
  const parentItem = findItem(items, parentKey);
  const children = parentItem ? parentItem.children : items;
  const keys = Object.keys(children);
  const currentIndex = keys.indexOf(currentKey);

  if (currentIndex === -1) {
    return null;
  }

  if (currentIndex === keys.length - 1) {
    return findNextItem(items, keyPath.slice(0, -1), true);
  }

  return keys[currentIndex + 1];
};

export default findNextItem;
