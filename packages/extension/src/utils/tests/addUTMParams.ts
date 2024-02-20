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
import addUTMParams from '../addUTMParams'; // Adjust the import path as necessary

describe('addUTMParams', () => {
  it('should add UTM parameters with default medium', () => {
    expect(addUTMParams('http://example.com')).toBe(
      'http://example.com?utm_source=psat&utm_medium=extension'
    );
  });

  it('should add UTM parameters with specified medium', () => {
    expect(addUTMParams('http://example.com', 'cli')).toBe(
      'http://example.com?utm_source=psat&utm_medium=cli'
    );
  });

  it('should append UTM parameters to existing query', () => {
    expect(addUTMParams('http://example.com?foo=bar', 'cli')).toBe(
      'http://example.com?foo=bar&utm_source=psat&utm_medium=cli'
    );
  });

  it('should return the original URL if it is empty', () => {
    expect(addUTMParams('')).toBe('');
  });
});
