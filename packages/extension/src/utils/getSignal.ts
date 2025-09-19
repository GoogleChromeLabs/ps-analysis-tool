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
 * Converts number array to IPv6 address format.
 * @param {number[]} buffer The signal from which data needs to be decoded
 * @returns IPv6 address
 */
function formatIPv6(buffer: number[]) {
  const parts = [];
  for (let i = 0; i < 16; i += 2) {
    parts.push(((buffer[i] << 8) | buffer[i + 1]).toString(16));
  }
  // Basic zero compression
  return parts.join(':').replace(/:(0:)+/, '::');
}

/**
 * Converts array buffer to an IP Address
 * @param {number[]} signal The signal from which data needs to be decoded
 * @returns IPv6 address
 */
function getSignal(signal: number[]) {
  if (signal.every((byte) => byte === 0)) {
    return btoa(String.fromCharCode.apply(null, signal as number[]));
  }

  const ipv4MappedPrefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff];
  const prefixMatch = signal
    .slice(0, 12)
    .every((val, i) => val === ipv4MappedPrefix[i]);

  if (signal.length === 16 && prefixMatch) {
    const ipv4Bytes = signal.slice(12);
    return Array.from(ipv4Bytes).join('.');
  }

  if (signal.length === 16) {
    return formatIPv6(signal);
  }

  return btoa(String.fromCharCode.apply(null, signal));
}

export default getSignal;
