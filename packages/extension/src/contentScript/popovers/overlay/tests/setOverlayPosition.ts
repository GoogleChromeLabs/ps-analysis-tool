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
import setOverlayPosition from '../setOverlayPosition';

const framePosition = {
  x: 0,
  y: 0,
};

const overlayStyle = {
  top: '0',
  left: '0',
};

describe('setOverlayPosition', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn((tagName) => {
      return {
        tagName: tagName.toUpperCase(),
        getBoundingClientRect: () => {
          return framePosition;
        },
        style: overlayStyle,
      };
    });
  });

  it('should set overlay postion: Test 1', () => {
    const frame = document.createElement('iframe');
    const overlay = document.createElement('div');

    framePosition.x = 0;
    framePosition.y = 0;

    // Set overlay position.
    setOverlayPosition(frame, overlay);

    expect(overlayStyle.left).toEqual('0px');
    expect(overlayStyle.top).toEqual('0px');
  });

  it('should set overlay postion: Test 2', () => {
    const frame = document.createElement('iframe');
    const overlay = document.createElement('div');

    framePosition.x = 50;
    framePosition.y = 80;

    // Set overlay position.
    setOverlayPosition(frame, overlay);

    expect(overlayStyle.left).toEqual('50px');
    expect(overlayStyle.top).toEqual('80px');
  });

  it('should not set overlay postion if no iframe: Test 1', () => {
    const overlay = document.createElement('div');

    framePosition.x = 100;
    framePosition.y = 100;

    overlay.style.top = '10px';
    overlay.style.left = '20px';

    // Set overlay position.
    setOverlayPosition(null, overlay);

    expect(overlayStyle.top).toEqual('10px');
    expect(overlayStyle.left).toEqual('20px');
  });

  it('should not set overlay postion if no iframe: Test 2', () => {
    const overlay = document.createElement('div');

    framePosition.x = 100;
    framePosition.y = 100;

    overlay.style.top = '50px';
    overlay.style.left = '100px';

    // Set overlay position.
    setOverlayPosition(null, overlay);

    expect(overlayStyle.top).toEqual('50px');
    expect(overlayStyle.left).toEqual('100px');
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
  });
});
