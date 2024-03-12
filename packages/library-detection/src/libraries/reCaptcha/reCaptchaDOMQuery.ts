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

const reCaptchaDOMQuery = () => {
  const matchItems: string[] = [];

  const reCaptchaClass = document.querySelector('.g-recaptcha');

  const reCaptchaScriptSrcRegex = /^https:\/\/www\.google\.com\/recaptcha/;

  const scripts = document.querySelectorAll('script');

  scripts.forEach((script) => {
    if (script.src && reCaptchaScriptSrcRegex.test(script.src)) {
      matchItems.push(`script[src]: ${script.src}`);
    }
  });

  if (matchItems.length && reCaptchaClass) {
    const reCaptchaTag = reCaptchaClass.tagName.toLowerCase();
    matchItems.push(`${reCaptchaTag}[class]: g-recaptcha`);
  }

  return matchItems;
};

export default reCaptchaDOMQuery;
