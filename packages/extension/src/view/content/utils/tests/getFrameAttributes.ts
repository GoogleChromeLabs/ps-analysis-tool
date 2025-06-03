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
import getFrameAttributes from '../getFrameAttributes';

describe('getFrameAttributes', () => {
  it('should return an object representing the iframe’s attributes', () => {
    // Create a new iframe element
    const iframe = document.createElement('iframe');

    // Set some attributes to the iframe element
    iframe.setAttribute('src', 'https://www.example.com/');
    iframe.setAttribute('width', '300');
    iframe.setAttribute('height', '200');

    // Call the function with the iframe element and expect the returned object to match the set attributes
    expect(getFrameAttributes(iframe)).toEqual({
      src: 'https://www.example.com/',
      width: '300',
      height: '200',
    });
  });

  it('should return an empty object if the iframe has no attributes', () => {
    // Create a new iframe element without setting any attributes
    const iframe = document.createElement('iframe');

    // Call the function with the iframe element and expect an empty object as there are no attributes set
    expect(getFrameAttributes(iframe)).toEqual({});
  });
});
