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
import type { ResponseType } from './types';

export const removeAllPopovers = () => {
  const existingPopovers = Array.from(
    document.querySelectorAll('.' + OVERLAY_CLASS + ', .' + INFOBOX_CLASS)
  );

  existingPopovers.forEach((element: Element) => {
    element.parentNode?.removeChild(element);
  });
};

export const addFrameOverlay = (
  Frame: HTMLIFrameElement | HTMLElement,
  data: ResponseType
): boolean => {
  const overlay = createFrameOverlay(Frame);
  const frameInfoBox = createIframeInfoBlock(Frame, data);
  const body = document.querySelector('body');

  // Overlay will not exist if frame is hidden.
  const isHiddenFrame = !overlay;

  if (!body) {
    return false;
  }

  removeAllPopovers();

  if (overlay) {
    body.appendChild(overlay);
    overlay.showPopover();
  }

  if (frameInfoBox) {
    body.appendChild(frameInfoBox);
    frameInfoBox.showPopover();
  }

  // overlay will not exist for hidden elements. show at bottom of screen.
  if (isHiddenFrame) {
    frameInfoBox.style.top =
      Number(window.innerHeight) - Number(frameInfoBox.offsetHeight) + 5 + 'px';
  } else if (frameInfoBox.offsetHeight > Frame.offsetTop) {
    // is main frame?
    if (document.location.origin === data.selectedFrame) {
      frameInfoBox.style.top = '5px';
    } else {
      // Show info box at bottom if we don't have enough space at top
      frameInfoBox.style.top =
        Number(frameInfoBox.offsetTop) + Number(Frame.offsetHeight) - 1 + 'px';
    }

    // Set infobox tip at top of box.
    frameInfoBox.firstElementChild?.classList.add('toptip');
  } else {
    frameInfoBox.style.top =
      Number(frameInfoBox.offsetTop) -
      Number(frameInfoBox.offsetHeight) +
      5 +
      'px';
  }

  // no need to scroll if frame is hidden;
  if (!isHiddenFrame) {
    frameInfoBox.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  return true;
};

export const findAndAddFrameOverlay = (response: ResponseType) => {
  if (response.selectedFrame === document.location.origin) {
    addFrameOverlay(document.body, response);
    return;
  }

  const iframes = document.querySelectorAll('iframe');
  let frameFound = false;

  for (const iframe of iframes) {
    const src = iframe.getAttribute('src') || '';

    if (!src) {
      return;
    }

    const srcHost = new URL(src).host.replace('www.', ''); // @todo Not the right way.
    const selectedFrameHost = new URL(
      response?.selectedFrame || ''
    ).host.replace('www.', '');

    // @todo Very loosley checked for initial POC, needs more work.
    if (srcHost === selectedFrameHost) {
      frameFound = addFrameOverlay(iframe, response);
      break;
    }
  }

  if (!frameFound) {
    removeAllPopovers();
  }
};
