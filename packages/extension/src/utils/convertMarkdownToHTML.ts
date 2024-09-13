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
import { Marked } from 'marked';
import markedAlert from 'marked-alert';
import mermaid from 'mermaid';

export const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool/images';

const convertMarkdownToHTML = async (markdown: string) => {
  const marked = new Marked().use(markedAlert(), {
    renderer: {
      code: function (code) {
        if (code.lang === 'mermaid') {
          return `<pre class="mermaid">${code.text}</pre>`;
        }
        return `<pre>${code.text}</pre>`;
      },
    },
  });

  let html = await marked.parse(markdown);

  html = html.replace(
    /src="\/?images\/([^"]+)"/g,
    `src="${IMAGE_BASE_URL}/$1"`
  );
  html = html.replace(
    /<a\s+(?![^>]*target=["']_blank["'])/g,
    '<a target="_blank" '
  );

  const DOMParsers = new DOMParser();
  const content = DOMParsers.parseFromString(html, 'text/html');

  if (document.querySelector('body')?.classList.contains('dark')) {
    mermaid.initialize({
      theme: 'dark',
    });
  }

  await Promise.all(
    Array.from(content.querySelectorAll('.mermaid')).map(async (el, i) => {
      if (el?.textContent) {
        const element = await mermaid.render(`mermaid-${i}`, el?.textContent);
        return (el.innerHTML = element.svg);
      }
      return el;
    })
  );

  return content.documentElement.innerHTML;
};

export default convertMarkdownToHTML;
