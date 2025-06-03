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
import isFrameHidden from '../isFrameHidden';

const mockGetBoundingClientRect = (height: number, width: number) => {
  return {
    height,
    width,
  } as DOMRect;
};

describe('isFrameHidden', () => {
  it('should return true since iframe has no height', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(0, 100)
    );

    expect(isFrameHidden(iframe)).toEqual(true);
  });

  it('should return true since iframe has no width', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(100, 0)
    );

    expect(isFrameHidden(iframe)).toEqual(true);
  });

  it('should return true since iframe has no height and width', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(0, 0)
    );

    expect(isFrameHidden(iframe)).toEqual(true);
  });

  it('should return false since visibleIframeOne is visible', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(20, 30)
    );

    expect(isFrameHidden(iframe)).toEqual(false);
  });
});
