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
// @TODO to be moved to types file.
export enum BidderType {
  BID = 'bid',
  NO_BID = 'no-bid',
  WON = 'won',
  TIMED_OUT = 'timed-out',
}

export interface Bidder {
  name: string;
  duration: string;
  type: BidderType;
  data?: any;
  startTime: number;
  endTime: number;
  adUnitCode: string;
  serverResponseTimeMs?: number;
}
