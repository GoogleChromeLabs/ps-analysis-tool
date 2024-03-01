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

const jetpackCommentsDOMQuery = () => {
  const matchItems: string[] = [];

  const jetpackIframeAttrValue = 'jetpack_remote_comment';

  const jetpackCommentIframeSrcRegex =
    /^https:\/\/www\.disqus\.com\/embed\/comments/;

  const iframes = document.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    if (
      iframe.src &&
      jetpackCommentIframeSrcRegex.test(iframe.src) &&
      iframe.name === jetpackIframeAttrValue &&
      iframe.id === jetpackIframeAttrValue &&
      iframe.getAttribute('class') === jetpackIframeAttrValue
    ) {
      matchItems.push('iframe[class]: jetpack_remote_comment');
      matchItems.push('iframe[name]: jetpack_remote_comment');
      matchItems.push('iframe[id]: jetpack_remote_comment');
      matchItems.push(`iframe[src]: ${iframe.src}`);
    }
  });

  return matchItems;
};

export default jetpackCommentsDOMQuery;
