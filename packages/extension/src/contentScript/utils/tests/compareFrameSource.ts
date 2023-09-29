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
import compareFrameSource from '../compareFrameSource';

describe('compareFrameSource', () => {
  const expectedCases = [
    {
      origin: 'https://www.example.com', // from PS panel sidebar.
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'http://www.example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'www.example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'https://bbc.com/',
      src: 'https://www.bbc.com',
      toBe: true,
    },
  ];

  it('should return true if frameSrc includes the cleaned frameOrigin', () => {
    expectedCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const unexpectedCases = [
    {
      origin: 'https://www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
    {
      origin: 'http://www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
    {
      origin: 'www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
  ];

  it('should return false if frameSrc does not include the cleaned frameOrigin', () => {
    unexpectedCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const edgeCases = [
    {
      origin: '',
      src: '',
      toBe: true,
    },
    {
      origin: 'https://www.example.com',
      src: '',
      toBe: false,
    },
  ];

  it('should handle edge cases', () => {
    edgeCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const realCases = [
    {
      origin: 'https://a4621041136.cdn.optimizely.com',
      src: 'https://a4621041136.cdn.optimizely.com/client_storage/a4621041136.html',
      toBe: true,
    },
    {
      origin:
        'https://05700d83f33eb7346a37437dfe41f3f9.safeframe.googlesyndication.com',
      src: 'https://05700d83f33eb7346a37437dfe41f3f9.safeframe.googlesyndication.com/safeframe/1-0-40/html/container.html',
      toBe: true,
    },
    {
      origin: 'https://elb.the-ozone-project.com',
      src: 'https://elb.the-ozone-project.com/static/load-cookie.html?gdpr=0&amp;gdpr_consent=&amp;usp_consent=1YNN&amp;pubcid=88e843a3-17fc-4662-a021-55d84c00c835&amp;publisherId=OZONEBBC4784&amp;siteId=8890582654&amp;cb=1696009943052&amp;bidder=ozone',
      toBe: true,
    },
    {
      origin: 'https://imasdk.googleapis.com',
      src: 'https://imasdk.googleapis.com/js/core/bridge3.593.1_debug_en.html#goog_2122308160',
      toBe: true,
    },
    {
      origin: 'https://ads.pubmatic.com',
      src: 'https://ads.pubmatic.com/AdServer/js/user_sync.html?kdntuid=1&amp;p=160262&amp;us_privacy=1---',
      toBe: true,
    },
  ];

  it('should handle real cases', () => {
    realCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });
});
