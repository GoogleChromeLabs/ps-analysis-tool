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
import disqusCommentsDOMQuery from '../disqusCommentsDOMQuery';

describe('Disqus Comments DOM Query', () => {
  beforeEach(() => {
    // Clean up the DOM before each test
    document.body.innerHTML = '';
  });

  it('should return the matches found', () => {
    const divWithId = document.createElement('div');
    divWithId.id = 'disqus_thread';

    const iframe = document.createElement('iframe');
    iframe.src = 'https://disqus.com/embed/comments/abc';

    document.body.appendChild(divWithId);
    document.body.appendChild(iframe);

    const matches = disqusCommentsDOMQuery();

    expect(matches).toHaveLength(2);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches).toContain('div[id]: disqus_thread');
    expect(matches).toContain(
      'iframe[src]: https://disqus.com/embed/comments/abc'
    );
  });

  it('should return empty array if both signatures not found', () => {
    const divWithId = document.createElement('div');
    divWithId.id = 'disqus_thread';

    document.body.appendChild(divWithId);

    const matches = disqusCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should return empty array if no signature found', () => {
    const matches = disqusCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });
});
