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
import getFrameCount from '../getFrameCount';

const dimension = {
  height: 0,
  width: 0,
};

describe('getFrameCount', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn(() => {
      return {
        getBoundingClientRect: () => {
          return dimension;
        },
      };
    });
  });

  it('should match the total number iframes', () => {
    const hiddenIframe = document.createElement('iframe');
    const visibleIframe = document.createElement('iframe');

    const iframes = [hiddenIframe, visibleIframe];
    const numberOfFrames = getFrameCount(iframes).numberOfFrames;

    expect(numberOfFrames).toEqual(2);
  });

  it('should match the total number hidden iframes', () => {
    const hiddenIframe = document.createElement('iframe');

    dimension.height = 0;
    dimension.width = 0;

    const iframes = [hiddenIframe, hiddenIframe];
    const numberOfHiddenFrames = getFrameCount(iframes).numberOfFrames;

    expect(numberOfHiddenFrames).toEqual(2);
  });

  it('should match the total number visible iframes', () => {
    const visibleIframe = document.createElement('iframe');

    dimension.height = 20;
    dimension.width = 100;

    const iframes = [visibleIframe, visibleIframe, visibleIframe];
    const numberOfVisibleFrames = getFrameCount(iframes).numberOfVisibleFrames;

    expect(numberOfVisibleFrames).toEqual(3);
  });

  afterAll(() => {
    globalThis.document.createElement = document.createElement;
  });
});
