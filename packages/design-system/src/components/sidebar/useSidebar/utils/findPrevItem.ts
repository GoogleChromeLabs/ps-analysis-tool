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
import { SidebarItems } from '../types';
import findItem from './findItem';
import findKeyParent from './findKeyParent';

/**
 * Find the previous item in the sidebar based on the key path.
 * The SidebarItems are assumed to be a tree structure.
 * The key path is an array of keys that represent the path to the current item.
 * Tree traversal is done in a depth-first manner to find the parent of the current item.
 * And then the previous sibling of the current item.
 * @param items Sidebar items.
 * @param keyPath Key path.
 * @returns Previous item key.
 */
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

  let prevKey = keys[currentIndex - 1];
  let prevItem = children[prevKey];

  while (prevItem?.dropdownOpen) {
    const prevItemChildren = Object.keys(prevItem.children);
    prevItem = prevItem.children[prevItemChildren[prevItemChildren.length - 1]];
    prevKey = prevItemChildren[prevItemChildren.length - 1];
  }

  return prevKey;
};

export default findPrevItem;
