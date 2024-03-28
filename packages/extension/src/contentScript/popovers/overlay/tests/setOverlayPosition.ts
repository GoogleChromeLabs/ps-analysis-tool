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
import setOverlayPosition from '../setOverlayPosition';
import addOverlay from '../addOverlay';

const mockGetBoundingClientRect = (
  x: number,
  y: number,
  height: number,
  width: number
) => {
  return {
    x,
    y,
    height,
    width,
  } as DOMRect;
};

describe('setOverlayPosition', () => {
  beforeAll(() => {
    // Mock showPopover since it is not supported.
    globalThis.HTMLElement.prototype.showPopover = jest.fn();
  });

  it('should set overlay postion: Test 1', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(0, 0, 50, 50)
    );

    const overlay = addOverlay(iframe);

    // Set overlay position.
    setOverlayPosition(overlay, iframe);

    expect(overlay?.style.top).toBe('0px');
    expect(overlay?.style.left).toBe('0px');
  });

  it('should set overlay postion: Test 2', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(10, 20, 30, 20)
    );

    const overlay = addOverlay(iframe);

    // Set overlay position.
    setOverlayPosition(overlay, iframe);

    expect(overlay?.style.top).toBe('20px');
    expect(overlay?.style.left).toBe('10px');
  });

  it('should not set overlay postion if no overlay', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(10, 20, 0, 0)
    );

    const overlay = addOverlay(iframe);

    // Set overlay position.
    setOverlayPosition(overlay, iframe);

    expect(overlay?.style.top).toBe(undefined);
    expect(overlay?.style.left).toBe(undefined);
  });

  afterAll(() => {
    globalThis.HTMLElement.prototype.showPopover =
      undefined as unknown as typeof HTMLElement.prototype.showPopover;
  });
});
