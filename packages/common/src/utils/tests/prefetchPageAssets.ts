/*
 * Copyright 2025 Google LLC
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
import prefetchPageAssets from '../prefetchPageAssets';

describe('prefetchPageAssets', () => {
  let mockFetch: jest.Mock;
  let mockParseFromString: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockParseFromString = jest.fn();
    global.DOMParser = jest.fn().mockImplementation(() => ({
      parseFromString: mockParseFromString,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch page and its assets', async () => {
    const mockHtml = '<html><body></body></html>';
    mockFetch.mockResolvedValueOnce({ text: () => Promise.resolve(mockHtml) });

    const mockDoc = {
      getElementsByTagName: jest.fn().mockImplementation((tag) => {
        switch (tag) {
          case 'script':
            return [{ src: 'https://example.com/script.js' }];
          case 'link':
            return [{ href: 'https://example.com/style.css' }];
          case 'img':
            return [{ src: 'https://example.com/image.jpg' }];
          default:
            return [];
        }
      }),
    };
    mockParseFromString.mockReturnValue(mockDoc);

    await prefetchPageAssets('https://example.com/1', {
      resourceType: ['script', 'stylesheet', 'image'],
    });

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/1');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/script.js');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/style.css');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/image.jpg');
    expect(mockFetch).toHaveBeenCalledTimes(4);
  });

  it('should handle custom asset URLs', async () => {
    const mockHtml = '<html><body></body></html>';
    mockFetch.mockResolvedValueOnce({ text: () => Promise.resolve(mockHtml) });

    const mockDoc = {
      getElementsByTagName: jest.fn().mockReturnValue([]),
    };
    mockParseFromString.mockReturnValue(mockDoc);

    const customAssetUrls = [
      'https://example.com/custom1.js',
      'https://example.com/custom2.css',
    ];
    await prefetchPageAssets('https://example.com/2', {
      getAssetsUrl: () => customAssetUrls,
    });

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/2');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/custom1.js');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/custom2.css');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not fetch already fetched assets', async () => {
    const mockHtml = '<html><body></body></html>';
    mockFetch.mockResolvedValueOnce({ text: () => Promise.resolve(mockHtml) });

    const mockDoc = {
      getElementsByTagName: jest
        .fn()
        .mockImplementation(() => [{ src: 'https://example.com/script.js' }]),
    };
    mockParseFromString.mockReturnValue(mockDoc);

    await prefetchPageAssets('https://example.com/3', {
      resourceType: ['script'],
    });
    await prefetchPageAssets('https://example.com/4', {
      resourceType: ['script'],
    });

    // 1 page fetch + 1 asset fetch
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
