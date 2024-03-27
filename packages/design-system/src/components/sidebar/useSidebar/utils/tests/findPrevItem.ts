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

import { SidebarItems } from '../..';
import findPrevItem from '../findPrevItem';

describe('findPrevItem', () => {
  it('should find the previous item', () => {
    const items: SidebarItems = {
      item1: {
        title: 'Item 1',
        children: {
          item2: {
            title: 'Item 2',
            dropdownOpen: true,
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
                    children: {
                      item7: {
                        title: 'Item 7',
                        children: {},
                      },
                      item8: {
                        title: 'Item 8',
                        children: {},
                      },
                    },
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

    const result = findPrevItem(items, keyPath);

    expect(result).toEqual('item3');

    const keyPath2 = ['item1', 'item5'];

    const result2 = findPrevItem(items, keyPath2);

    expect(result2).toEqual('item6');
  });
});
