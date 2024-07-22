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
import { getCurrentDateAndTime } from '..';

describe('getCurrentDateAndTime', () => {
  beforeAll(() => {
    const mockDate = new Date(2024, 6, 16, 18, 30, 15); // 2024-07-16 18:30
    global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
  });

  it('should return date and time in YYYY-MM-DD_HH-MM format', () => {
    const result = getCurrentDateAndTime('YYYY-MM-DD_HH-MM-SS');
    expect(result).toBe('2024-07-16_18-30-15');
  });

  it('should return date and time in DD MMMM, YYYY, hh:mmam/pm format', () => {
    const result = getCurrentDateAndTime('DD MMMM, YYYY, hh:mm:ssam/pm');
    expect(result).toBe('16 July, 2024, 06:30:15pm');
  });

  it('should throw an error for an invalid format', () => {
    // @ts-ignore - invalid-format added for testing.
    expect(() => getCurrentDateAndTime('invalid-format')).toThrow(
      'Invalid format'
    );
  });
});
