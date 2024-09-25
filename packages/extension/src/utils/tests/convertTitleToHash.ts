/*
 * Copyright 2024 Google LLC
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
import convertTitleToHash from '../convertTitleToHash';

describe('convertTitleToHash', () => {
  it('should convert a simple title to a hash', () => {
    const input = 'Main Frame';
    const expectedOutput = 'main-frame';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should convert a title with mixed case to a lowercase hash', () => {
    const input = 'Hello World Title';
    const expectedOutput = 'hello-world-title';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should remove special characters and convert spaces to hyphens', () => {
    const input = 'Another Example Title!!!';
    const expectedOutput = 'another-example-title';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle multiple spaces correctly', () => {
    const input = 'Title   With    Multiple   Spaces';
    const expectedOutput = 'title-with-multiple-spaces';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle leading and trailing spaces', () => {
    const input = '   Leading and Trailing Spaces   ';
    const expectedOutput = 'leading-and-trailing-spaces';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expectedOutput = '';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should replace multiple hyphens with a single hyphen', () => {
    const input = 'Title --- with -- multiple - hyphens';
    const expectedOutput = 'title-with-multiple-hyphens';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });

  it('should remove non-alphanumeric characters except spaces', () => {
    const input = 'Title with #Special@ Characters!';
    const expectedOutput = 'title-with-special-characters';
    const result = convertTitleToHash(input);
    expect(result).toBe(expectedOutput);
  });
});
