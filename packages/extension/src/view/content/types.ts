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
export interface ResponseType {
  selectedFrame?: string;
  firstPartyCookies?: number;
  thirdPartyCookies?: number;
  isInspecting: boolean;
  isOnRWS?: boolean;
  removeAllFramePopovers?: boolean;
  blockedCookies?: number;
  blockedReasons?: string;
  isForProtectedAudience?: boolean;
  selectedAdUnit?: string;
  numberOfBidders?: number;
  bidders?: string[];
  winningBid?: number;
  winningBidder?: string;
  bidCurrency?: string;
}

// @see https://developer.mozilla.org/en-US/docs/Web/API/CookieStore/getAll
export type CookieStoreCookie = {
  name: string;
  domain: string;
  expires: number; // UNIX time in miliseconds
  partitioned: boolean;
  path: string;
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
  value: string;
};
