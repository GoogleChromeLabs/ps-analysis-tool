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
import sanitizeCsvRecord from '../sanitizeCsvRecord';

describe('sanitizeCsvRecord : ', () => {
  it('should not change valid strings', () => {
    const validString = 'already a valid value 123';
    expect(sanitizeCsvRecord(validString)).toBe(validString);
  });

  it('should add double quotes if a , is present', () => {
    const invalidString = 'a,value';
    const validString = '"a,value"';
    expect(sanitizeCsvRecord(invalidString)).toBe(validString);
  });

  it('should add double quotes before any double quotes in the string', () => {
    const invalidString = 'a value with "quotes"';
    const validString = 'a value with ""quotes""';
    expect(sanitizeCsvRecord(invalidString)).toBe(validString);
  });

  it('should handle comma and quotes simultaneously', () => {
    const invalidString = 'a value with comma , with "quotes"';
    const validString = '"a value with comma , with ""quotes"""';
    expect(sanitizeCsvRecord(invalidString)).toBe(validString);
  });
});
