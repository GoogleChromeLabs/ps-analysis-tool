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
      isFirstParty('newexample.com', 'https://newexample.com/')
    ).toBeTruthy();

    expect(isFirstParty('.example.com', 'https://example.com/')).toBeTruthy();

    expect(
      isFirstParty('accounts.example.com', 'https://example.com/')
    ).toBeTruthy();

    expect(
      isFirstParty('.example.co.in', 'https://example.co.in/')
    ).toBeTruthy();

    expect(
      isFirstParty('api.example.co.in', 'https://example.co.in/')
    ).toBeTruthy();

    expect(
      isFirstParty('spark-public.s3.amazonaws.com', 'https://amazonaws.com/')
    ).toBeTruthy();

    expect(
      isFirstParty('demo.日本.example.com', 'https://日本.example.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://demo.sub-domain.example.com', 'https://example.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://sub1.sub2.example.com', 'https://example.com')
    ).toBeTruthy();
  });

  it('Should return false for third-party domains and subdomains', () => {
    expect(isFirstParty('xyza.com', 'https://xyz.com/')).toBeFalsy();

    expect(
      isFirstParty('new.example.com', 'https://newexample.com/')
    ).toBeFalsy();

    expect(isFirstParty('.examples.com', 'https://example.com/')).toBeFalsy();

    expect(
      isFirstParty('spark-public.s3.aamazonaws.com', 'https://amazonaws.com/')
    ).toBeFalsy();

    expect(isFirstParty('demo.xyz.com', 'https://xyza.com/')).toBeFalsy();

    expect(isFirstParty('demo.xyz.co.uk', 'https://xyz.co.us/')).toBeFalsy();
  });
});
