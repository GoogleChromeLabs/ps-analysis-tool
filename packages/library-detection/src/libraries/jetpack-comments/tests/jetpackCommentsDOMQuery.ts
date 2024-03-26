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
 * External dependencies.
 */
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import jetpackCommentsDOMQuery from '../jetpackCommentsDOMQuery';

describe('Jetpack Comments DOM Query', () => {
  beforeEach(() => {
    // Clean up the DOM before each test
    document.body.innerHTML = '';
  });

  it('should return the matches found', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'jetpack_remote_comment';
    iframe.name = 'jetpack_remote_comment';
    iframe.classList.add('jetpack_remote_comment');
    iframe.src = 'https://jetpack.wordpress.com/jetpack-comment/abc';

    document.body.appendChild(iframe);

    const matches = jetpackCommentsDOMQuery();

    expect(matches).toHaveLength(4);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches).toContain('iframe[id]: jetpack_remote_comment');
    expect(matches).toContain('iframe[name]: jetpack_remote_comment');
    expect(matches).toContain('iframe[class]: jetpack_remote_comment');
    expect(matches).toContain(
      'iframe[src]: https://jetpack.wordpress.com/jetpack-comment/abc'
    );
  });

  it('should return empty array if no signature found', () => {
    const matches = jetpackCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });
});
