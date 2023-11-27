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
import { OVERLAY_CLASS } from '../../../constants';
import createFrameOverlay from '../createFrameOverlay';

const frameProp = {
  height: 0,
  width: 0,
};

let classes: string[] = [];

describe('createFrameOverlay', () => {
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
      };
    });
  });

  it('should return an overlay', () => {
    const frame = document.createElement('iframe');

    frameProp.height = 100;
    frameProp.width = 100;

    // Create overlay.
    const overlay = createFrameOverlay(frame);

    expect(classes).toContain(OVERLAY_CLASS);
    expect(overlay?.popover).toEqual('manual');
  });

  it('should return an overlay with dimension same as frame', () => {
    const frame = document.createElement('iframe');

    frameProp.height = 100;
    frameProp.width = 100;

    // Create overlay.
    const overlay = createFrameOverlay(frame);

    expect(overlay?.style.height).toEqual(`${frameProp.height}px`);
    expect(overlay?.style.width).toEqual(`${frameProp.width}px`);
  });

  it('should return an overlay with ps-fixed class', () => {
    const frame = document.createElement('body');

    frameProp.height = 1080;
    frameProp.width = 1920;

    // Create overlay.
    createFrameOverlay(frame);

    expect(classes).toContain('ps-fixed');
  });

  it('should return null if frame is hidden', () => {
    const frame = document.createElement('iframe');

    frameProp.height = 0;
    frameProp.width = 100;

    // Create overlay.
    const overlayOne = createFrameOverlay(frame);

    frameProp.height = 100;
    frameProp.width = 0;

    // Create overlay.
    const overlaTwo = createFrameOverlay(frame);

    expect(overlayOne).toEqual(null);
    expect(overlaTwo).toEqual(null);
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
  });
});
