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
 * External dependencies.
 */
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import isElementVisibleInViewport from '../isElementInViewport';

const { innerHeight, innerWidth } = window;
const mockGetBoundingClientRect = (
  top: number,
  left: number,
  right: number,
  bottom: number
) => {
  return {
    top,
    left,
    right,
    bottom,
  } as DOMRect;
};

describe('isElementVisibleInViewport', () => {
  it('should return true since div is partially visible in viewport and partiallyVisible is set to true', () => {
    const div = document.createElement('div');

    // Mock getBoundingClientRect since it always returns 0.
    div.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(
        innerHeight - 20,
        innerWidth - 20,
        innerWidth - 20 + 50,
        innerHeight - 20 + 50
      )
    );

    expect(isElementVisibleInViewport(div, true)).toBe(true);
  });

  it('should return true since div is fully visible in viewport', () => {
    const div = document.createElement('div');

    // Mock getBoundingClientRect since it always returns 0.
    div.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(
        innerHeight - 100,
        innerWidth - 100,
        innerWidth - 100 + 50,
        innerHeight - 100 + 50
      )
    );

    expect(isElementVisibleInViewport(div, true)).toBe(true);
  });

  it('should return false since div is not fully visible in viewport and partiallyVisible is set to false', () => {
    const div = document.createElement('div');

    // Mock getBoundingClientRect since it always returns 0.
    div.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(
        innerHeight - 20,
        innerWidth - 20,
        innerWidth - 20 + 50,
        innerHeight - 20 + 50
      )
    );

    expect(isElementVisibleInViewport(div, false)).toBe(false);
  });

  it('should return true since div is fully not visible in viewport', () => {
    const div = document.createElement('div');

    // Mock getBoundingClientRect since it always returns 0.
    div.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(
        innerHeight + 50,
        innerWidth + 50,
        innerWidth + 50 + 50,
        innerHeight + 50 + 50
      )
    );

    expect(isElementVisibleInViewport(div, true)).toBe(false);
  });
});
