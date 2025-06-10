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
/**
 * Internal dependencies.
 */
import findMaximumBidderDuration from '../findMaximumBidderDuration';
import type { Bidder } from '../../types';

describe('findMaximumBidderDuration', () => {
  it('returns 0 for empty array', () => {
    expect(findMaximumBidderDuration([])).toBe(0);
  });

  it('returns the duration for a single bidder', () => {
    const bidders: Bidder[] = [{ duration: '5.5' } as Bidder];
    expect(findMaximumBidderDuration(bidders)).toBe(5.5);
  });

  it('returns the maximum duration from multiple bidders', () => {
    const bidders: Bidder[] = [
      { duration: '2.3' } as Bidder,
      { duration: '7.1' } as Bidder,
      { duration: '4.0' } as Bidder,
    ];
    expect(findMaximumBidderDuration(bidders)).toBe(7.1);
  });

  it('handles non-numeric duration strings gracefully', () => {
    const bidders: Bidder[] = [
      { duration: 'abc' } as Bidder,
      { duration: '3.2' } as Bidder,
    ];
    expect(findMaximumBidderDuration(bidders)).toBe(3.2);
  });

  it('handles negative and zero durations', () => {
    const bidders: Bidder[] = [
      { duration: '-2' } as Bidder,
      { duration: '0' } as Bidder,
      { duration: '1' } as Bidder,
    ];
    expect(findMaximumBidderDuration(bidders)).toBe(1);
  });
});
