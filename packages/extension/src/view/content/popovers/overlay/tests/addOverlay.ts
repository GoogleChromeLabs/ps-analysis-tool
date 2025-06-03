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
import addOverlay from '../addOverlay';

describe('addOverlay', () => {
  beforeAll(() => {
    // Mock showPopover since it is not supported.
    globalThis.HTMLElement.prototype.showPopover = jest.fn();
  });

  it('should return overlay that was added to the document body', () => {
    const iframe = document.createElement('iframe');

    // Mock getBoundingClientRect since it always returns 0.
    iframe.getBoundingClientRect = jest.fn(
      () =>
        ({
          height: 10,
          width: 200,
        } as DOMRect)
    );

    document.body.appendChild(iframe);

    const overlay = addOverlay(iframe);

    expect(overlay).toBeInTheDocument();
    expect(overlay instanceof HTMLDivElement).toBe(true);
  });

  it('should return null as body not found', () => {
    const iframe = document.createElement('iframe');
    const overlay = addOverlay(iframe);

    expect(overlay).toBe(null);
  });

  afterAll(() => {
    globalThis.HTMLElement.prototype.showPopover =
      undefined as unknown as typeof HTMLElement.prototype.showPopover;
  });
});
