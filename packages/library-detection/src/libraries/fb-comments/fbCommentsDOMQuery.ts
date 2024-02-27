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

const fbCommentsDOMQuery = () => {
  const matchItems: string[] = [];
  const root = document.getElementById('fb-root');

  const commentClass = document.querySelector('.fb-comments');
  const iframeRegex =
    /^https:\/\/www\.facebook\.com\/v\d+\.\d+\/plugins\/comments\.php/;

  if (root) {
    matchItems.push('div[id]: fb-root');
  }

  if (commentClass) {
    matchItems.push('div[class]: fb-comments');
  }

  if (root && commentClass) {
    const iframes = document.querySelectorAll('iframe');

    iframes.forEach((iframe) => {
      if (iframe.src && iframeRegex.test(iframe.src)) {
        matchItems.push(`iframe[src]: ${iframe.src}`);
      }
    });
  }

  return matchItems;
};

export default fbCommentsDOMQuery;
