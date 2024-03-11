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
 * Retrieves the source location based on the provided match and source URL.
 * If the line number is not found, it returns 'inline source'.
 * @param match - The regular expression match array.
 * @param sourceUrl - The URL of the source.
 * @returns The source location.
 */
export const getSourceLocation = (
  match: RegExpMatchArray,
  sourceUrl: string | null
) => {
  const lineNumber = findLineNumber(match);
  if (!lineNumber) {
    return 'inline source';
  }

  return `${sourceUrl}`;
};

const findLineNumber = (match: RegExpMatchArray): number | null => {
  if (!match.input || !match.index) {
    return null;
  }

  const lines = match.input.split('\n');
  let lineNumber = 1;
  let currentOffset = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLength = line.length;

    if (currentOffset + lineLength >= match.index) {
      break;
    }

    lineNumber++;
    currentOffset += lineLength + 1; // Add 1 for newline character
  }

  return lineNumber;
};
