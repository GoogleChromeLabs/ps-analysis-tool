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
 * Internal dependencies.
 */
import isElementVisibleInViewport from '../isElementInViewport';

const position = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
const { innerHeight, innerWidth } = window;

describe('isElementVisibleInViewport', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn(() => {
      return {
        getBoundingClientRect: () => {
          return position;
        },
      };
    });
  });

  it('should return true since div is partially visible in viewport and partiallyVisible is set to true', () => {
    const div = document.createElement('div');

    position.top = innerHeight - 20;
    position.left = innerWidth - 20;
    position.right = position.left + 50;
    position.bottom = position.top + 50;

    expect(isElementVisibleInViewport(div, true)).toEqual(true);
  });

  it('should return true since div is fully visible in viewport', () => {
    const div = document.createElement('div');

    position.top = innerHeight - 100;
    position.left = innerWidth - 100;
    position.right = position.left + 50;
    position.bottom = position.top + 50;

    expect(isElementVisibleInViewport(div, true)).toEqual(true);
  });

  it('should return false since div is not fully visible in viewport and partiallyVisible is set to false', () => {
    const div = document.createElement('div');

    position.top = innerHeight - 20;
    position.left = innerWidth - 20;
    position.right = position.left + 50;
    position.bottom = position.top + 50;

    expect(isElementVisibleInViewport(div, false)).toEqual(false);
  });

  it('should return true since div is fully not visible in viewport', () => {
    const div = document.createElement('div');

    position.top = innerHeight + 50;
    position.left = innerWidth + 50;
    position.right = position.left + 50;
    position.bottom = position.top + 50;

    expect(isElementVisibleInViewport(div, true)).toEqual(false);
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
  });
});
