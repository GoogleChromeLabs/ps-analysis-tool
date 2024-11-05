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
/**
 * This formats the time and returns it in a readable format
 * @param { Protocol.Network.TimeSinceEpoch } startTime time at which the event started.
 * @param { Protocol.Network.TimeSinceEpoch } eventTime time at which the event occured.
 * @returns {Date} the formatted time.
 */
export default function formatTime(
  startTime: Protocol.Network.TimeSinceEpoch,
  eventTime: Protocol.Network.TimeSinceEpoch
) {
  return startTime
    ? `${((eventTime - startTime) * 1000).toFixed(2)}ms`
    : new Date(eventTime * 1000);
}
