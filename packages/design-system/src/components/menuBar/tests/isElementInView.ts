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

import { isElementInView } from '../utils';

describe('isElementInView', () => {
  it('should return true if the element is in view', () => {
    window.innerHeight = 1000;
    const element = {
      offsetHeight: 100,
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 200,
      }),
    };

    expect(isElementInView(element as HTMLElement)).toBe(true);
  });

  it('should return false if the element is not in view', () => {
    window.innerHeight = 1000;
    const element = {
      offsetHeight: 100,
      getBoundingClientRect: () => ({
        top: 1000,
        bottom: 2000,
      }),
    };

    expect(isElementInView(element as HTMLElement)).toBe(false);

    element.getBoundingClientRect = () => ({
      top: 0,
      bottom: -100,
    });

    expect(isElementInView(element as HTMLElement)).toBe(false);

    element.getBoundingClientRect = () => ({
      top: 0,
      bottom: 24,
    });

    expect(isElementInView(element as HTMLElement)).toBe(false);
  });
});
