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

import { SidebarItems } from '../../types';
import findNextItem from '../findNextItem';

describe('findNextItem', () => {
  it('should find the next item', () => {
    const items: SidebarItems = {
      item1: {
        title: 'Item 1',
        children: {
          item2: {
            title: 'Item 2',
            children: {
              item3: {
                title: 'Item 3',
                dropdownOpen: true,
                children: {
                  item4: {
                    title: 'Item 4',
                    children: {},
                  },
                  item6: {
                    title: 'Item 6',
                    children: {},
                  },
                },
              },
            },
          },
          item5: {
            title: 'Item 5',
            children: {},
          },
        },
      },
    };

    const keyPath = ['item1', 'item2', 'item3', 'item4'];

    const result = findNextItem(items, keyPath);

    expect(result).toEqual('item6');

    const keyPath2 = ['item1', 'item2', 'item3', 'item6'];

    const result2 = findNextItem(items, keyPath2);

    expect(result2).toEqual('item5');
  });
});
