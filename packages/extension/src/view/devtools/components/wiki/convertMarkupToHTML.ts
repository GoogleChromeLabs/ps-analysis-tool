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
 * External dependencies.
 */
import { marked } from 'marked';

const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool/images';

const convertMarkupToHTML = async (markup: string) => {
  let html = await marked.parse(markup);

  html = html.replace(/src="images\/([^"]+)"/g, `src="${IMAGE_BASE_URL}/$1"`);
  html = html.replace(
    /<a\s+(?![^>]*target=["']_blank["'])/g,
    '<a target="_blank" '
  );

  return html;
};

export default convertMarkupToHTML;
