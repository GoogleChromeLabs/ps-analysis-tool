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

import findItem from '../findItem';

describe('findItem', () => {
  it('should find an item', () => {
    const items = {
      item1: {
        title: 'Item 1',
        children: {
          item2: {
            title: 'Item 2',
            children: {
              item3: {
                title: 'Item 3',
                children: {
                  item4: {
                    title: 'Item 4',
                    children: {},
                  },
                },
              },
            },
          },
        },
      },
    };

    let key = 'item4';

    const result = findItem(items, key);

    expect(result).toEqual({ title: 'Item 4', children: {} });

    key = 'item5';

    const result2 = findItem(items, key);

    expect(result2).toEqual(null);
  });
});
