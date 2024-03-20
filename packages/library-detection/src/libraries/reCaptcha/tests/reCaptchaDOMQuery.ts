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
import reCaptchaDOMQuery from '../reCaptchaDOMQuery';

describe('Disqus Comments DOM Query', () => {
  beforeEach(() => {
    // Clean up the DOM before each test
    document.body.innerHTML = '';
  });

  it('should return the matches found', () => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';

    const div = document.createElement('div');
    div.classList.add('g-recaptcha');

    document.body.appendChild(script);
    document.body.appendChild(div);

    const matches = reCaptchaDOMQuery();

    expect(matches).toHaveLength(2);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches).toContain('div[class]: g-recaptcha');
    expect(matches).toContain(
      'script[src]: https://www.google.com/recaptcha/api.js'
    );
  });

  it('should detect library if script signature is found', () => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';

    document.body.appendChild(script);

    const matches = reCaptchaDOMQuery();

    expect(matches).toHaveLength(1);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should return empty array if script signature is not found', () => {
    const div = document.createElement('div');
    div.classList.add('g-recaptcha');

    document.body.appendChild(div);

    const matches = reCaptchaDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should return empty array if no signature found', () => {
    const matches = reCaptchaDOMQuery();

    expect(matches).toHaveLength(0);
    expect(Array.isArray(matches)).toBe(true);
  });
});
