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
 * Internal dependencies.
 */
import { createFrameOverlay, createIframeInfoBlock } from './createFrameMarkup';
import { OVERLAY_CLASS, INFOBOX_CLASS } from './constants';

export const removeAllPopovers = () => {
  const existingPopovers = Array.from(
    document.querySelectorAll('.' + OVERLAY_CLASS + ', .' + INFOBOX_CLASS)
  );

  existingPopovers.forEach((element) => {
    element.parentNode.removeChild(element);
  });
};

export const addFrameOverlay = (selectedFrame: string) => {
  const iframes = document.querySelectorAll('iframe');
  let frameFound = false;

  for (const iframe of iframes) {
    const src = iframe.getAttribute('src') || '';
    const srcHost = new URL(src).host.replace('www.', ''); // @todo Not the right way.
    const selectedFrameHost = new URL(selectedFrame).host.replace('www.', '');

    // @todo Very loosley checked for initial POC, needs more work.
    if (srcHost === selectedFrameHost) {
      const overlay = createFrameOverlay(iframe);
      const frameInfoBox = createIframeInfoBlock(iframe);

      const body = document.querySelector('body');

      if (!body || !overlay) {
        return;
      }

      frameFound = true;

      removeAllPopovers();
      body.appendChild(overlay);
      body.appendChild(frameInfoBox);

      overlay.showPopover();
      frameInfoBox.showPopover();

      // because element is not rendered so we can't set the top property properly before.
      frameInfoBox.style.top =
        Number(frameInfoBox.offsetTop) -
        Number(frameInfoBox.offsetHeight) +
        5 +
        'px';

      frameInfoBox.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  if (!frameFound) {
    removeAllPopovers();
  }
};
