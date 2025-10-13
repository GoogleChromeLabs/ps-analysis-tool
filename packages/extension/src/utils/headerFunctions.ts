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
 * External dependencies
 */
import type { Protocol } from 'devtools-protocol';

/**
 * Extracts the value of a specific HTTP header from the request or response.
 * @param header The name of the header to extract.
 * @param headers The request or response information.
 * @returns The value of the specified header.
 */
export const extractHeader = (
  header: string,
  headers: Protocol.Network.Headers
) => headers?.[header.toLowerCase()] ?? headers?.[header];

/**
 * Constructs a URL string from the provided HTTP/2 pseudo-headers.
 * @param headers - The HTTP/2 headers object containing at least `:authority`, `:scheme`, and `:path`.
 *                  Optionally, `:port` can be included to specify a non-default port.
 * @returns The constructed URL string in the format `${scheme}://${authority}[:port]${path}`.
 */
export const createURL = (headers: Protocol.Network.Headers) => {
  const authority = extractHeader(':authority', headers);
  const scheme = extractHeader(':scheme', headers);
  const path = extractHeader(':path', headers);
  const port = extractHeader(':port', headers);

  if (!authority || !scheme || !path) {
    return null;
  }

  return `${scheme}://${authority}${port ? `:${port}` : ''}${path}`;
};
