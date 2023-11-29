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
import addOverlay from '../addOverlay';

let classes: string[] = [];
let isBodyPresent = true;
const frameProp = {
  height: 100,
  width: 100,
};

describe('addOverlay', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn((tagName) => {
      return {
        popover: '',
        tagName: tagName.toUpperCase(),
        getBoundingClientRect: () => {
          return frameProp;
        },
        classList: {
          add: function (className) {
            classes = [...classes, className];
          },
        },
        style: {
          width: '0px',
          height: '0px',
        },
        appendChild: () => {
          // noop
        },
        showPopover: () => {
          // noop
        },
      };
    });

    // @ts-ignore
    globalThis.document.querySelector = jest.fn((tagName) => {
      if (isBodyPresent) {
        return document.createElement(tagName);
      }

      return null;
    });
  });

  it('should return overlay that was added to the document body', () => {
    isBodyPresent = true;
    const iframe = document.createElement('iframe');
    const overlay = addOverlay(iframe);

    expect(overlay).not.toEqual(null);
  });

  it('should return null as body not found', () => {
    isBodyPresent = false;
    const iframe = document.createElement('iframe');
    const overlay = addOverlay(iframe);

    expect(overlay).toEqual(null);
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
    globalThis.document.querySelector = document.querySelector;
  });
});
