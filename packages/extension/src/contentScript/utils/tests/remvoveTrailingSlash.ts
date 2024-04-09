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
import removeTrailingSlash from '../removeTrailingSlash';

describe('removeTrailingSlash', () => {
  it('should return url with no trailing slash', () => {
    const urls = ['https://example.com/', 'https://example.com'];
    const urlWithNoTrailingSlash = 'https://example.com';

    urls.forEach((url) => {
      expect(removeTrailingSlash(url)).toBe(urlWithNoTrailingSlash);
    });
  });
});
