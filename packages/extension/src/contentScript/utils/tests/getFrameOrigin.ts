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
import getFrameOrigin from '../getFrameOrigin';

describe('getFrameOrigin', () => {
  it('should return frame origin', () => {
    const attributes = [
      { src: 'https://www.example.com', width: '0', height: '0' },
      { src: 'https://www.example.com/', width: '0', height: '100' },
      { src: 'https://www.example.com/blog', width: '100', height: '0' },
      { src: 'https://www.example.com/post/123', width: '100', height: '100' },
      { src: 'https://www.example.com?post=123', width: '50', height: '150' },
    ];

    attributes.forEach((attribute) => {
      // Call the function with the iframe attributes and expect the returned string to match the origin
      expect(getFrameOrigin(attribute)).toBe('https://www.example.com');
    });
  });

  it('should return an empty string if origin is not found', () => {
    const attributes = [
      { src: '', width: '0', height: '100' },
      { src: '/post/123', width: '100', height: '0' },
      { src: 'example.com', width: '100', height: '100' },
    ];

    attributes.forEach((attribute) => {
      // Call the function with the iframe attributes and expect the returned string to match the origin
      expect(getFrameOrigin(attribute)).toBe('');
    });
  });
});
