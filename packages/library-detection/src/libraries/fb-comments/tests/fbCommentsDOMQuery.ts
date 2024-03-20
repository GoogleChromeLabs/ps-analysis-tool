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
import fbCommentsDOMQuery from '../fbCommentsDOMQuery';

describe('Facebook Comments DOM Query', () => {
  beforeEach(() => {
    // Clean up the DOM before each test
    document.body.innerHTML = '';
  });

  it('should return the matches found', () => {
    const iframe = document.createElement('iframe');
    iframe.src =
      'https://www.facebook.com/v1.0/plugins/comments.php?app_id=123';

    const divWithClass = document.createElement('div');
    divWithClass.classList.add('fb-comments');

    const divWithId = document.createElement('div');
    divWithId.id = 'fb-root';

    document.body.appendChild(divWithClass);
    document.body.appendChild(divWithId);
    document.body.appendChild(iframe);

    const matches = fbCommentsDOMQuery();

    expect(matches).toHaveLength(3);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches).toContain('div[id]: fb-root');
    expect(matches).toContain('div[class]: fb-comments');
    expect(matches).toContain(
      'iframe[src]: https://www.facebook.com/v1.0/plugins/comments.php?app_id=123'
    );
  });

  it('should return empty array if both id and class not found: 1', () => {
    const divWithId = document.createElement('div');
    divWithId.id = 'fb-root';

    document.body.appendChild(divWithId);

    const matches = fbCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should return empty array if both id and class not found: 2', () => {
    const divWithClass = document.createElement('div');
    divWithClass.classList.add('fb-comments');

    document.body.appendChild(divWithClass);

    const matches = fbCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should return empty array if no signature found', () => {
    const matches = fbCommentsDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });
});
