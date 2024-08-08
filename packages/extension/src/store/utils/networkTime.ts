/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import type { Protocol } from 'devtools-protocol';
import dataStore from '../dataStore';

/**
 * Helps decode timestamps in network-related events, which are only convertible
 * to global time in context of corresponding Network.requestWillBeSent
 * @param { string } requestId request identifier for which network time needs to be calculated
 * @param { Protocol.Network.MonotonicTime } timestamp Timestamp of the request
 * @param { string } tabId Tab the request is associated to.
 * @returns timestamp
 */
export default function networkTime(
  requestId: string,
  timestamp: Protocol.Network.MonotonicTime,
  tabId: string
) {
  const timeInfo = dataStore.requestIdToCDPURLMapping[tabId][requestId];
  // Somehow missed the start event?
  if (!timeInfo) {
    return new Date().getTime();
  }
  return timeInfo.wallTime + (timestamp - timeInfo.timeStamp);
}
