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
import createFrameOverlay from './createFrameOverlay';
import createTooltip from './tooltip';
import removeAllPopovers from './removeAllPopovers';
import type { ResponseType } from '../types';

/**
 * Adds a frame overlay and tooltip to an HTML iframe or element.
 * @param {HTMLIFrameElement | HTMLElement} Frame - The HTML iframe or element to which the overlay and tooltip are added.
 * @param {ResponseType} data - The response data containing information to display in the tooltip.
 * @returns {boolean} Returns `true` if the overlay and tooltip were successfully added, `false` otherwise.
 */
const addFrameOverlay = (
  Frame: HTMLIFrameElement | HTMLElement,
  data: ResponseType
): boolean => {
  const overlay = createFrameOverlay(Frame);
  const tooltip = createTooltip(Frame, data);
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

  if (tooltip) {
    body.appendChild(tooltip);
    tooltip.showPopover();
  }

  // overlay will not exist for hidden elements. show at bottom of screen.
  if (isHiddenFrame) {
    tooltip.style.top =
      Number(window.innerHeight) - Number(tooltip.offsetHeight) + 5 + 'px';
  } else if (tooltip.offsetHeight > Frame.offsetTop) {
    // is main frame?
    if (document.location.origin === data.selectedFrame) {
      tooltip.style.top = '5px';
    } else {
      // Show info box at bottom if we don't have enough space at top
      tooltip.style.top =
        Number(tooltip.offsetTop) + Number(Frame.offsetHeight) - 1 + 'px';
    }

    // Set infobox tip at top of box.
    tooltip.firstElementChild?.classList.add('tooltip');
  } else {
    tooltip.style.top =
      Number(tooltip.offsetTop) - Number(tooltip.offsetHeight) + 5 + 'px';
  }

  // no need to scroll if frame is hidden;
  if (!isHiddenFrame) {
    tooltip.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  return true;
};

export default addFrameOverlay;
