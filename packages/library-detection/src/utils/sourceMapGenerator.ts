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
 * This function returns the source location i.e. The line number and the column number of the given match and the sourceURL
 * @param {any} match:RegExpMatchArray
 * @param {any} sourceUrl:string|null
 * @param match
 * @param sourceUrl
 * @returns {any}
 */
export const getSourceLocation = (
  match: RegExpMatchArray,
  sourceUrl: string | null
) => {
  const lineNumber = findLineNumber(match);
  if (!lineNumber) {
    return 'inline source';
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const columnNumber = findColumnNumber(match, lineNumber);

  return `${sourceUrl}`;
};

/**
 * This util methods finds the lineNumber required for sourceLocation
 * @param {any} match:RegExpMatchArray
 * @param match
 * @returns {any}
 */
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

/**
 * This util methods finds the columnNumber required for sourceLocation
 * @param {any} match:RegExpMatchArray
 * @param match
 * @param lineNumber
 * @returns {any}
 */
const findColumnNumber = (
  match: RegExpMatchArray,
  lineNumber: number
): number | null => {
  if (!match.input || !match.index) {
    return null;
  }
  const line = match.input.split('\n')[lineNumber - 1];
  return match.index - line.lastIndexOf('\n') - 1; // Adjust for newline
};
