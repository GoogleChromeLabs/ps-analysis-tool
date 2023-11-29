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
 * External dependencies
 */
import '@testing-library/jest-dom';
/**
 * Internal dependencies.
 */
import toggleFrameHighlighting from '../toggleFrameHighlighting';

describe('toggleFrameHighlighting', () => {
  it('should add "ps-highlighted-frame" class for all iframe', () => {
    const divWithIframes = document.createElement('div');

    // Create div with iframes.
    for (let i = 0; i < 10; i++) {
      divWithIframes.appendChild(document.createElement('iframe'));
    }

    // Insert div into DOM.
    document.body.appendChild(divWithIframes);

    // Call the toggleFrameHighlighting function.
    toggleFrameHighlighting(true);

    expect(
      document.querySelectorAll('iframe.ps-highlighted-frame')
    ).toHaveLength(10);
  });

  it('should remove all "ps-highlighted-frame" class for all iframe', () => {
    const divWithIframes = document.createElement('div');

    // Create div with iframes.
    for (let i = 0; i < 10; i++) {
      divWithIframes.appendChild(document.createElement('iframe'));
    }

    // Insert div into DOM.
    document.body.appendChild(divWithIframes);

    // Call the toggleFrameHighlighting function.
    toggleFrameHighlighting(false);

    expect(
      document.querySelectorAll('iframe.ps-highlighted-frame')
    ).toHaveLength(0);
  });
});
