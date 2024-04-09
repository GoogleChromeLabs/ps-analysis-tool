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
import { OVERLAY_CLASS } from '../../../constants';
import createFrameOverlay from '../createFrameOverlay';

const mockGetBoundingClientRect = (height: number, width: number) => {
  return {
    height,
    width,
  } as DOMRect;
};

describe('createFrameOverlay', () => {
  beforeAll(() => {
    // Mock showPopover since it is not supported.
    globalThis.HTMLElement.prototype.showPopover = jest.fn();
  });

  it('should return an overlay', () => {
    const frame = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    frame.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(100, 100)
    );

    // Create overlay.
    const overlay = createFrameOverlay(frame);

    expect(overlay?.popover).toBe('manual');
    expect(overlay).toHaveClass(OVERLAY_CLASS);
    expect(overlay instanceof HTMLDivElement).toBe(true);
  });

  it('should return an overlay with dimension same as frame', () => {
    const frame = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    frame.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(50, 50)
    );

    // Create overlay.
    const overlay = createFrameOverlay(frame);

    expect(overlay?.style.width).toBe('50px');
    expect(overlay?.style.height).toBe('50px');
  });

  it('should return an overlay with "ps-fixed" class', () => {
    const frame = document.createElement('body');

    // Mock getBoundingClientRect since it always returns 0.
    frame.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(100, 100)
    );

    // Create overlay.
    const overlay = createFrameOverlay(frame);

    expect(overlay).toHaveClass('ps-fixed');
  });

  it('should return null if frame is hidden', () => {
    const frameOne = document.createElement('iframe');
    const frameTwo = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    frameOne.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(0, 100)
    );

    // Create overlay.
    const overlayOne = createFrameOverlay(frameOne);

    // Mock getBoundingClientRect since it always returns 0.
    frameTwo.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(0, 100)
    );

    // Create overlay.
    const overlayTwo = createFrameOverlay(frameTwo);

    expect(overlayOne).toBe(null);
    expect(overlayTwo).toBe(null);
  });

  afterAll(() => {
    globalThis.HTMLElement.prototype.showPopover =
      undefined as unknown as typeof HTMLElement.prototype.showPopover;
  });
});
