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

import calculateEffectiveExpiryDate from '../calculateEffectiveExpiryDate';

describe('calculateEffectiveExpiryDate', () => {
  it('Should return Session for undefined', () => {
    expect(calculateEffectiveExpiryDate(undefined)).toBe('Session');
  });

  it('Should return Session for -1', () => {
    expect(calculateEffectiveExpiryDate(-1)).toBe('Session');
  });

  it('Should return date in ISO format for number', () => {
    expect(calculateEffectiveExpiryDate(1733319706)).toBe(
      '2024-12-04T13:41:46.000Z'
    );
  });

  it('Should return date in ISO format for number with decimal', () => {
    expect(calculateEffectiveExpiryDate(1704961011.109784)).toBe(
      '2024-01-11T08:16:51.109Z'
    );
  });

  it('Should return date in ISO format for Date object', () => {
    expect(calculateEffectiveExpiryDate(new Date('2023-09-05T00:00:00'))).toBe(
      '2023-09-04T18:30:00.000Z'
    );
  });

  it('Should return date in ISO format for string', () => {
    expect(calculateEffectiveExpiryDate('2023-09-05T00:00:00')).toBe(
      '2023-09-04T18:30:00.000Z'
    );
  });

  it('Should return Session for invalid string', () => {
    expect(calculateEffectiveExpiryDate('')).toBe('Session');
  });
});
