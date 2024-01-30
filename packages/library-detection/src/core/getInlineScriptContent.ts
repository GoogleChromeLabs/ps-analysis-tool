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
 * Parses the provided HTML content and extracts the contents of inline script tags.
 * @param content The HTML content to parse.
 * @returns An array of strings representing the contents of inline script tags.
 */
const getInlineScriptContent = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  const inlineScripts = doc.querySelectorAll('script:not([src])');
  const scriptContents = Array.from(inlineScripts).map(
    (_script) => _script.textContent
  );

  return scriptContents;
};

export default getInlineScriptContent;
