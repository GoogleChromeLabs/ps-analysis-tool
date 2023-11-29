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
import findSelectedFrameElements from '../findSelectedFrameElements';

let iframes: HTMLIFrameElement[] = [];

describe('findSelectedFrameElements', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn((tagName) => {
      return {
        tagName: tagName.toUpperCase(),
        src: '',
        srcdoc: '',
        setAttribute: function (attrName, attrValue) {
          if (attrName === 'src') {
            this.src = attrValue;
          } else if (attrName === 'srcdoc') {
            this.srcdoc = attrValue;
          }
        },
        getAttribute: function (attrName) {
          if (attrName === 'src') {
            return (this as unknown as HTMLIFrameElement).src;
          }
          return '';
        },
        dataset: {
          psatInsideFrame: '',
        },
        contentDocument: {
          querySelectorAll: () => {
            return [];
          },
        },
      };
    });

    // @ts-ignore
    globalThis.document.querySelectorAll = jest.fn(() => {
      return iframes;
    });
  });

  it('should return empty array as origin is empty', () => {
    const frame = findSelectedFrameElements('');

    expect(frame.length).toEqual(0);
  });

  it('should return body frame as selectedOrigin is the origin', () => {
    const origin = document.location.origin;
    const frame = findSelectedFrameElements(origin);

    expect(frame.length).toEqual(1);
    expect(frame).toContain(document.body);
  });

  it('should return array of frames of same origin', () => {
    const origin = 'https://example.com';

    const innerIframeOne = document.createElement('iframe');
    const innerIframeTwo = document.createElement('iframe');
    const innerIframeThree = document.createElement('iframe');
    const innerIframeFour = document.createElement('iframe');

    innerIframeOne.setAttribute('src', 'https://example.com');
    innerIframeTwo.setAttribute('src', 'https://server.com');
    innerIframeThree.setAttribute('src', 'https://domain.com');
    innerIframeFour.setAttribute('src', 'https://example.com');

    iframes = [
      innerIframeOne,
      innerIframeTwo,
      innerIframeThree,
      innerIframeFour,
    ];

    const frames = findSelectedFrameElements(origin);

    expect(frames.length).toEqual(2);

    frames.forEach((frame) => {
      expect(frame.getAttribute('src')).toEqual(origin);
    });
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
    globalThis.document.querySelectorAll = document.querySelectorAll;
  });
});
