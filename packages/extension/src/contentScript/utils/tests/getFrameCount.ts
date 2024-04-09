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
import getFrameCount from '../getFrameCount';

const mockGetBoundingClientRect = (height: number, width: number) => {
  return {
    height,
    width,
  } as DOMRect;
};

describe('getFrameCount', () => {
  it('should match the total number iframes', () => {
    // No need to mock getBoundingClientRect, as we only need total frame count.

    const hiddenIframe = document.createElement('iframe');
    const visibleIframe = document.createElement('iframe');

    const iframes = [hiddenIframe, visibleIframe];
    const numberOfFrames = getFrameCount(iframes).numberOfFrames;

    expect(numberOfFrames).toBe(2);
  });

  it('should match the total number hidden iframes', () => {
    // No need to mock getBoundingClientRect as it returns 0 only.

    const hiddenIframe = document.createElement('iframe');
    const iframes = [hiddenIframe, hiddenIframe];
    const numberOfHiddenFrames = getFrameCount(iframes).numberOfFrames;

    expect(numberOfHiddenFrames).toBe(2);
  });

  it('should match the total number visible iframes', () => {
    const visibleIframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    visibleIframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(20, 30)
    );

    const iframes = [visibleIframe, visibleIframe, visibleIframe];
    const numberOfVisibleFrames = getFrameCount(iframes).numberOfVisibleFrames;

    expect(numberOfVisibleFrames).toBe(3);
  });
});
