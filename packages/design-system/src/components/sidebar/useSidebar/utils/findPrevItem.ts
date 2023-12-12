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
import findItem from './findItem';
import findKeyParent from './findKeyParent';

const findPrevItem = (items: SidebarItems, keyPath: string[]) => {
  if (keyPath.length === 0) {
    return null;
  }

  const currentKey = keyPath[keyPath.length - 1];
  const parentKey = findKeyParent(keyPath);
  const parentItem = parentKey ? findItem(items, parentKey) : null;
  const children = parentItem ? parentItem.children : items;
  const keys = Object.keys(children);
  const currentIndex = keys.indexOf(currentKey);

  if (currentIndex === -1) {
    return null;
  }

  if (currentIndex === 0) {
    return parentKey;
  }

  const prevKey = keys[currentIndex - 1];
  const prevItem = children[prevKey];

  if (prevItem?.dropdownOpen) {
    const prevItemChildren = Object.keys(prevItem.children);
    return prevItemChildren[prevItemChildren.length - 1];
  }

  return prevKey;
};

export default findPrevItem;
