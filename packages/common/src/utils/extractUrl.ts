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
 * External dependencies.
 */
import { parse } from 'tldts';

/**
 * Extracts the URL from the given string.
 * @param url - The string containing the URL.
 * @returns The extracted URL or an empty string if the URL cannot be parsed.
 */
export default function extractUrl(url: string) {
  const parsedUrl = parse(url);
  return parsedUrl || '';
}
