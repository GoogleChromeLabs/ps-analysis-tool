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
import getAllowedFeatures from '../getAllowedFeatures';

let frameAllowedFeatures: string[];
let supportsFeaturePolicy: boolean;

describe('getAllowedFeatures', () => {
  // Since feature policy is not supported.
  beforeAll(() => {
    // @ts-ignore
    globalThis.document.createElement = jest.fn(() => {
      if (supportsFeaturePolicy) {
        return {
          featurePolicy: {
            allowedFeatures: () => {
              return frameAllowedFeatures;
            },
          },
        };
      }

      return {};
    });
  });

  it('should return array of PS related allowed features', () => {
    supportsFeaturePolicy = true;
    frameAllowedFeatures = [
      'accelerometer',
      'autoplay',
      'clipboard-write',
      'encrypted-media',
      'gyroscope',
      'picture-in-picture',
      'web-share',
      'attribution-reporting',
      'browsing-topics',
      'interest-cohort',
      'join-ad-interest-group',
      'private-aggregation',
      'run-ad-auction',
      'shared-storage',
      'shared-storage-select-url',
    ];

    const expectedFeatures = [
      'attribution-reporting',
      'browsing-topics',
      'interest-cohort',
      'join-ad-interest-group',
      'private-aggregation',
      'run-ad-auction',
      'shared-storage',
      'shared-storage-select-url',
    ];

    const iframe = document.createElement('iframe');
    const allowedFeatures = getAllowedFeatures(iframe);

    expect(allowedFeatures).toEqual(expectedFeatures);
  });

  it('should return "N/A" as no features are allowed', () => {
    supportsFeaturePolicy = true;
    frameAllowedFeatures = [];

    const iframe = document.createElement('iframe');
    const allowedFeatures = getAllowedFeatures(iframe);

    expect(allowedFeatures).toBe('N/A');
  });

  it('should return "Unknown" if feature policy is not supported', () => {
    supportsFeaturePolicy = false;
    frameAllowedFeatures = [];

    const iframe = document.createElement('iframe');
    const allowedFeatures = getAllowedFeatures(iframe);

    expect(allowedFeatures).toBe('Unknown');
  });

  afterAll(() => {
    globalThis.document.createElement =
      undefined as unknown as typeof document.createElement;
  });
});
