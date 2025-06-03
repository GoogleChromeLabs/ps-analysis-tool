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
import findSelectedFrameElements from '../findSelectedFrameElements';

describe('findSelectedFrameElements', () => {
  it('should return empty array as origin is empty', () => {
    const frame = findSelectedFrameElements('htts://example.com');

    expect(frame).toHaveLength(0);
  });

  it('should return body frame as selectedOrigin is same as the origin', () => {
    const origin = document.location.origin;
    const frame = findSelectedFrameElements(origin);

    expect(frame).toHaveLength(1);
    expect(frame).toContain(document.body);
  });

  it('should return array of frames of same origin', () => {
    const origin = 'https://example.com';

    const iframeOne = document.createElement('iframe');
    const iframeTwo = document.createElement('iframe');
    const iframeThree = document.createElement('iframe');
    const iframeFour = document.createElement('iframe');

    iframeOne.setAttribute('src', 'https://example.com');
    iframeTwo.setAttribute('src', 'https://server.com');
    iframeThree.setAttribute('src', 'https://domain.com');
    iframeFour.setAttribute('src', 'https://example.com');

    const iframes = [iframeOne, iframeTwo, iframeThree, iframeFour];

    iframes.forEach((iframe) => {
      document.body.appendChild(iframe);
    });

    const frames = findSelectedFrameElements(origin);

    expect(frames).toHaveLength(2);

    frames.forEach((frame) => {
      expect(frame.getAttribute('src')).toBe(origin);
    });
  });
});
