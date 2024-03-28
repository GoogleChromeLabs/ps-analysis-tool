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
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import isOnRWS from '../isOnRWS';
import rws from '../test-data/isOnRWSData';

describe('isOnRWS', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = (): Promise<Response> =>
      Promise.resolve({
        json: () => Promise.resolve(rws),
      } as Response);
  });

  it('should return true since the website belongs to RWS', async () => {
    const urls = [
      'https://cafemedia.com',
      'https://bild.de',
      'https://hapara.com',
      'https://songstats.com',
      'https://hindustantimes.com',
    ];

    for (const url of urls) {
      // eslint-disable-next-line no-await-in-loop
      const result = await isOnRWS(url);

      expect(result).toBe(true);
    }
  });

  it('should return false since the website does not belong to RWS', async () => {
    const urls = [
      'https://abc.example.com',
      'https://abc.helloworld.com',
      'https://helloworld.xyz',
    ];

    for (const url of urls) {
      // eslint-disable-next-line no-await-in-loop
      const result = await isOnRWS(url);

      expect(result).toBe(false);
    }
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
