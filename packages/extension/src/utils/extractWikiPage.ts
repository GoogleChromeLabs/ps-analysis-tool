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

interface Page {
  pageName: string;
  hash: string | null;
}

/**
 * Extract Wiki page parts.
 * @param url URL
 * @returns page object.
 */
const extractWikiPage = (url: string) => {
  const page: Page = { pageName: '', hash: null };

  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/');

    page.pageName = pathSegments[pathSegments.length - 1];

    // Get the hash part (without the '#' symbol)
    page.hash = parsedUrl.hash ? parsedUrl.hash.substring(1) : null;
  } catch (error) {
    // Fail Silently.
  }

  return page;
};

export default extractWikiPage;
