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
 * Toggles highlighting of iframes by adding or removing a CSS class.
 * @param {boolean} [highlight] - Indicates whether to highlight the iframes (default is true).
 * @param {string} [adUnit] -  Indicates which frame to highlight in case for protected audience.
 * @param {boolean} [isForPa] -  Indicates wheter its being used for protected audience.
 * @returns {void}
 */
const toggleFrameHighlighting = (
  highlight = true,
  adUnit = '',
  isForPa = false
): void => {
  const iframes = document.querySelectorAll('iframe');

  if (isForPa) {
    const adUnitDiv = document.getElementById(adUnit);
    adUnitDiv?.classList.toggle('ps-highlighted-frame', highlight);
    iframes.forEach((iframe) => {
      iframe.classList.toggle('ps-highlighted-frame', false);
    });
    return;
  }

  const divHighLighted = document.querySelectorAll('div.ps-highlighted-frame');

  divHighLighted.forEach((div) => {
    div.classList.toggle('ps-highlighted-frame', false);
  });

  iframes.forEach((iframe) => {
    iframe.classList.toggle('ps-highlighted-frame', highlight);
  });
};

export default toggleFrameHighlighting;
