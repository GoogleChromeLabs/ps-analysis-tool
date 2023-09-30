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
import { createFrameOverlay } from './overlay';
import { createTooltip, setTooltipPosition } from './tooltip';
import removeAllPopovers from './removeAllPopovers';
import type { ResponseType } from '../types';

/**
 * Adds a frame overlay and tooltip to an HTML iframe or element.
 * @param {HTMLIFrameElement | HTMLElement} Frame - The HTML iframe or element to which the overlay and tooltip are added.
 * @param {ResponseType} data - The response data containing information to display in the tooltip.
 * @returns {boolean} Returns `true` if the overlay and tooltip were successfully added, `false` otherwise.
 */
const addPopover = (
  Frame: HTMLIFrameElement | HTMLElement,
  data: ResponseType
): boolean => {
  const body = document.querySelector('body');

  if (!body) {
    return false;
  }

  const overlay = createFrameOverlay(Frame);
  const tooltip = createTooltip(Frame, data);

  // Overlay will not exist if frame is hidden.
  const isHiddenFrame = !overlay;

  removeAllPopovers();

  if (overlay) {
    body.appendChild(overlay);
    overlay.showPopover();
  }

  if (tooltip) {
    body.appendChild(tooltip);
    tooltip.showPopover();
  }

  setTooltipPosition(tooltip, isHiddenFrame, Frame, data.selectedFrame);

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

export default addPopover;
