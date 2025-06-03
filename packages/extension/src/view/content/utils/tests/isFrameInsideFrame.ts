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
import isFrameInsideFrame from '../isFrameInsideFrame';

describe('isFrameInsideFrame', () => {
  it('should return true when frames are inside', () => {
    // Parent frame.
    const parentIframe = document.createElement('iframe');
    document.body.appendChild(parentIframe);

    // Create new contentDocument for parent iframe.
    const contentDocument = document.implementation.createHTMLDocument();

    Object.defineProperty(parentIframe, 'contentDocument', {
      value: contentDocument,
    });

    // Child frame.
    const childIframe = document.createElement('iframe');
    childIframe.setAttribute('src', 'https://example.com');
    contentDocument.body.appendChild(childIframe);

    const result = isFrameInsideFrame(parentIframe, 'https://example.com');
    expect(result).toBe(true);
  });

  it('should return false since there are no frames inside it', () => {
    // Parent frame.
    const parentIframe = document.createElement('iframe');
    document.body.appendChild(parentIframe);

    // Create new contentDocument for parent iframe.
    const contentDocument = document.implementation.createHTMLDocument();

    Object.defineProperty(parentIframe, 'contentDocument', {
      value: contentDocument,
    });

    const result = isFrameInsideFrame(parentIframe, 'https://example.com');
    expect(result).toBe(false);
  });

  it('should return false since there is no frame src match origin', () => {
    // Parent frame.
    const parentIframe = document.createElement('iframe');
    document.body.appendChild(parentIframe);

    // Create new contentDocument for parent iframe.
    const contentDocument = document.implementation.createHTMLDocument();

    Object.defineProperty(parentIframe, 'contentDocument', {
      value: contentDocument,
    });

    // Child frame.
    const childIframe = document.createElement('iframe');
    childIframe.setAttribute('src', 'https://domain.com');
    contentDocument.body.appendChild(childIframe);

    const result = isFrameInsideFrame(parentIframe, 'https://example.com');
    expect(result).toBe(false);
  });

  it('should return true since at least one frame src match origin', () => {
    // Parent frame.
    const parentIframe = document.createElement('iframe');
    document.body.appendChild(parentIframe);

    // Create new contentDocument for parent iframe.
    const contentDocument = document.implementation.createHTMLDocument();

    Object.defineProperty(parentIframe, 'contentDocument', {
      value: contentDocument,
    });

    // Child frames.
    const childIframeOne = document.createElement('iframe');
    const childIframeTwo = document.createElement('iframe');

    childIframeOne.setAttribute('src', 'https://domain.com');
    childIframeTwo.setAttribute('src', 'https://example.com');

    contentDocument.body.appendChild(childIframeOne);
    contentDocument.body.appendChild(childIframeTwo);

    const result = isFrameInsideFrame(parentIframe, 'https://example.com');
    expect(result).toBe(true);
  });
});
