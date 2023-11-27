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
 * Internal dependencies.
 */
import isFrameInsideFrame from '../isFrameInsideFrame';

let iframes: HTMLIFrameElement[] = [];
let hasContent = true;

describe('isFrameInsideFrame', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn((tagName) => {
      if (hasContent) {
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
              return iframes;
            },
          },
        };
      }

      return {};
    });
  });

  it('should return true since frames are inside it', () => {
    const origin = 'https://example.com';
    const srcdoc = `<!DOCTYPE html>
      <html>
        <head>
            <title>Nested Iframe</title>
        </head>
        <body>
            <iframe src='https://www.example.com/1'></iframe>
            <iframe src='https://www.example.com/2'></iframe>
            <iframe src='https://www.example.com/3'></iframe>
        </body>
      </html>`;

    const iframe = document.createElement('iframe');
    const innerIframeOne = document.createElement('iframe');
    const innerIframeTwo = document.createElement('iframe');
    const innerIframeThree = document.createElement('iframe');

    iframe.setAttribute('srcdoc', srcdoc);
    innerIframeOne.setAttribute('src', 'https://www.example.com/1');
    innerIframeTwo.setAttribute('src', 'https://www.example.com/2');
    innerIframeThree.setAttribute('src', 'https://www.example.com/3');

    hasContent = true;
    iframes = [innerIframeOne, innerIframeTwo, innerIframeThree];

    expect(isFrameInsideFrame(iframe, origin)).toEqual(true);
  });

  it('should return false since there are no frames inside it', () => {
    const origin = 'https://example.com';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.example.com');

    hasContent = true;
    iframes = [];

    expect(isFrameInsideFrame(iframe, origin)).toEqual(false);
  });

  it('should return false since there is no frame src match origin', () => {
    const origin = 'https://www.domain.com';
    const srcdoc = `<!DOCTYPE html>
      <html>
        <head>
            <title>Nested Iframe</title>
        </head>
        <body>
            <iframe src='https://www.example.com'></iframe>
        </body>
      </html>`;

    const iframe = document.createElement('iframe');
    const innerIframeOne = document.createElement('iframe');

    iframe.setAttribute('srcdoc', srcdoc);
    innerIframeOne.setAttribute('src', 'https://www.example.com');

    hasContent = true;
    iframes = [innerIframeOne];

    expect(isFrameInsideFrame(iframe, origin)).toEqual(false);
  });

  it('should return true since at least one frame src match origin', () => {
    const origin = 'https://www.domain.com';
    const srcdoc = `<!DOCTYPE html>
      <html>
        <head>
            <title>Nested Iframe</title>
        </head>
        <body>
            <iframe src='https://www.domain.com/1'></iframe>
            <iframe src='https://www.example.com/2'></iframe>
            <iframe src='https://www.example.com/3'></iframe>
        </body>
      </html>`;

    const iframe = document.createElement('iframe');
    const innerIframeOne = document.createElement('iframe');
    const innerIframeTwo = document.createElement('iframe');
    const innerIframeThree = document.createElement('iframe');

    iframe.setAttribute('srcdoc', srcdoc);
    innerIframeOne.setAttribute('src', 'https://www.domain.com/1');
    innerIframeTwo.setAttribute('src', 'https://www.example.com/2');
    innerIframeThree.setAttribute('src', 'https://www.example.com/3');

    hasContent = true;
    iframes = [innerIframeOne, innerIframeTwo, innerIframeThree];

    expect(isFrameInsideFrame(iframe, origin)).toEqual(true);
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
  });
});
