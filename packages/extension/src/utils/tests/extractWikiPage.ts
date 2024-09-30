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
import extractWikiPage from '../extractWikiPage';

interface Page {
  pageName: string;
  hash: string | null;
}

describe('extractWikiPage', () => {
  it('should extract the page name correctly from a basic URL', () => {
    const url =
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/General-Debugging-Actions';
    const expected: Page = {
      pageName: 'General-Debugging-Actions',
      hash: null,
    };

    const result = extractWikiPage(url);
    expect(result).toEqual(expected);
  });

  it('should extract the page name and hash correctly from a URL with a hash', () => {
    const url =
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/General-Debugging-Actions#xyz';
    const expected: Page = {
      pageName: 'General-Debugging-Actions',
      hash: 'xyz',
    };

    const result = extractWikiPage(url);
    expect(result).toEqual(expected);
  });

  it('should extract the page name correctly from a URL with query parameters', () => {
    const url =
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/General-Debugging-Actions?x=20';
    const expected: Page = {
      pageName: 'General-Debugging-Actions',
      hash: null,
    };

    const result = extractWikiPage(url);
    expect(result).toEqual(expected);
  });

  it('should handle URLs with no page name', () => {
    const url = 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/';
    const expected: Page = { pageName: '', hash: null };

    const result = extractWikiPage(url);
    expect(result).toEqual(expected);
  });

  it('should handle invalid URLs by returning default page object', () => {
    const url = 'invalid-url';
    const expected: Page = { pageName: '', hash: null };

    const result = extractWikiPage(url);
    expect(result).toEqual(expected);
  });
});
