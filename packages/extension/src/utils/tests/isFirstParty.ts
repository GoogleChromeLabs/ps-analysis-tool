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
      isFirstParty('https://newindianexpress.com/', 'newindianexpress.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://indianexpress.com/', '.indianexpress.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://indianexpress.com/', 'accounts.indianexpress.com')
    ).toBeTruthy();

    expect(
      isFirstParty('https://indianexpress.co.in/', '.indianexpress.co.in')
    ).toBeTruthy();

    expect(
      isFirstParty('https://indianexpress.co.in/', 'api.indianexpress.co.in')
    ).toBeTruthy();

    expect(
      isFirstParty('https://amazonaws.com/', 'spark-public.s3.amazonaws.com')
    ).toBeTruthy();
  });

  it('Should return false for third-party domains and subdomains', () => {
    expect(isFirstParty('https://xyz.com/', 'xyza.com')).toBeFalsy();

    expect(
      isFirstParty('https://newindianexpress.com/', 'new.indianexpress.com')
    ).toBeFalsy();

    expect(
      isFirstParty('https://indianexpress.com/', '.indianexpresss.com')
    ).toBeFalsy();

    expect(
      isFirstParty('https://amazonaws.com/', 'spark-public.s3.aamazonaws.com')
    ).toBeFalsy();

    expect(isFirstParty('https://xyza.com/', 'demo.xyz.com')).toBeFalsy();

    expect(isFirstParty('https://xyz.co.us/', 'demo.xyz.co.uk')).toBeFalsy();
  });
});
