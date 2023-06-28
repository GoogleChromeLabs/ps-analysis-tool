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
import isFirstParty from '../isFirstParty';

describe('isFirstParty', () => {
  it('Should return true for first party domains and subdomains', () => {
    expect(
      isFirstParty('https://newexample.com/', 'newexample.com')
    ).toBeTruthy();

    expect(isFirstParty('https://example.com/', '.example.com')).toBeTruthy();

    expect(
      isFirstParty('https://example.com/', 'accounts.example.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://example.co.in/', '.example.co.in')
    ).toBeTruthy();

    expect(
      isFirstParty('https://example.co.in/', 'api.example.co.in')
    ).toBeTruthy();

    expect(
      isFirstParty('https://amazonaws.com/', 'spark-public.s3.amazonaws.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://日本.example.com', 'demo.日本.example.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://example.com', 'https://demo.sub-domain.example.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://example.com', 'https://sub1.sub2.example.com')
    ).toBeTruthy();
  });

  it('Should return false for third-party domains and subdomains', () => {
    expect(isFirstParty('https://xyz.com/', 'xyza.com')).toBeFalsy();

    expect(
      isFirstParty('https://newexample.com/', 'new.example.com')
    ).toBeFalsy();

    expect(isFirstParty('https://example.com/', '.examples.com')).toBeFalsy();

    expect(
      isFirstParty('https://amazonaws.com/', 'spark-public.s3.aamazonaws.com')
    ).toBeFalsy();

    expect(isFirstParty('https://xyza.com/', 'demo.xyz.com')).toBeFalsy();

    expect(isFirstParty('https://xyz.co.us/', 'demo.xyz.co.uk')).toBeFalsy();
  });
});
